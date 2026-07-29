// Canvas render path for the download button.
//
// `renderCoverToCanvas` takes a fully-resolved snapshot of the page
// state plus a ref to the live preview's icons container (so we can
// re-rasterise the react-icons SVGs with the user's chosen tint).
// The output is a PNG data URL.
//
// Helpers carry the running cursor (`ctx.y`) on a small context object
// rather than via a module-level mutable, so multiple downloads can
// run concurrently without interference.

import { roundRect, svgToImage } from "./canvas-helpers";
import { hexToRgba } from "./color";
import { resolveFont } from "./fonts";
import { SOCIAL_ICONS } from "./social";
import type {
  Alignment,
  BadgesItem,
  BgStyle,
  Colors,
  ContentItem,
  FooterItem,
  IconsItem,
  Pattern,
  TextItem,
} from "./types";

export type RenderInput = {
  width: number;
  height: number;
  alignment: Alignment;
  sidePadding: number;
  bottomPadding: number;
  contentGap: number;
  verticalCenter: boolean;
  bgStyle: BgStyle;
  pattern: Pattern;
  colors: Colors;
  primaryColor: string;
  secondaryColor: string;
  items: ContentItem[];
  footer: FooterItem | null;
  iconsContainerRef: React.RefObject<HTMLDivElement | null>;
};

type Cursor = {
  ctx: CanvasRenderingContext2D;
  xForWidth: (w: number) => number;
  width: number;
  sidePadding: number;
  // y-offset that advances as each item is drawn.
  y: number;
};

export async function renderCoverToCanvas(input: RenderInput): Promise<string> {
  const {
    width,
    height,
    alignment,
    sidePadding,
    bottomPadding,
    contentGap,
    verticalCenter,
    bgStyle,
    pattern,
    colors,
    primaryColor,
    secondaryColor,
    items,
    footer,
    iconsContainerRef,
  } = input;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background — mirrors the CSS getBackgroundStyle so the canvas
  // output matches the live preview exactly.
  drawBackground(
    ctx,
    bgStyle,
    colors,
    primaryColor,
    secondaryColor,
    width,
    height,
  );
  drawPattern(ctx, pattern, colors.grid, width, height);

  // Orbs + corner accents only render in the gradient style; the other
  // styles (radial / mesh / solid) are deliberately cleaner.
  if (bgStyle === "gradient") {
    drawOrbs(ctx, primaryColor, secondaryColor, width, height);
    drawCornerAccents(ctx, primaryColor, secondaryColor, width, height);
  }

  // Pre-load social icons if the items list needs them.
  const iconImages = await loadIconImages(items, iconsContainerRef);

  // Content
  const totalHeight = items.reduce((sum, item, i) => {
    const h = itemHeight(item) + (item.marginBottom ?? 0);
    return sum + h + (i > 0 ? contentGap : 0);
  }, 0);
  const startY = verticalCenter
    ? (height - totalHeight) / 2
    : height - bottomPadding - totalHeight;

  ctx.textBaseline = "top";
  const xForWidth = (w: number) => {
    switch (alignment) {
      case "left":
        return sidePadding;
      case "center":
        return (width - w) / 2;
      case "right":
        return width - sidePadding - w;
    }
  };

  const cur: Cursor = { ctx, xForWidth, width, sidePadding, y: startY };
  for (let i = 0; i < items.length; i++) {
    if (i > 0) cur.y += contentGap;
    const item = items[i];
    if (item.kind === "text") {
      drawText(cur, item);
    } else if (item.kind === "icons") {
      drawIcons(cur, item, iconImages);
    } else {
      drawBadges(cur, item);
    }
  }

  if (footer) drawFooter(ctx, footer, width, height);

  return canvas.toDataURL("image/png");
}

// Height a single item occupies in the stack, excluding its margin. Text
// and icons are their nominal size; a pill row adds its vertical padding
// and border. Wrapped pill rows aren't accounted for here — the pre-pass
// only needs a close-enough total to centre the stack.
function itemHeight(item: ContentItem): number {
  if (item.kind !== "badges") return item.size;
  return item.size + item.padY * 2 + (item.borderWidth ?? 0) * 2;
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  bgStyle: BgStyle,
  colors: Colors,
  primaryColor: string,
  secondaryColor: string,
  width: number,
  height: number,
) {
  const mid = colors.bgMid;
  const edge = colors.bgEdge;
  const pRgba = hexToRgba(primaryColor, 0.4);
  const sRgba = hexToRgba(secondaryColor, 0.3);
  if (bgStyle === "gradient") {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, edge);
    bg.addColorStop(0.5, mid);
    bg.addColorStop(1, edge);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  } else if (bgStyle === "radial") {
    const bg = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75,
    );
    bg.addColorStop(0, mid);
    bg.addColorStop(1, edge);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  } else if (bgStyle === "mesh") {
    // Layer four radial gradients over a solid mid-tone base.
    ctx.fillStyle = mid;
    ctx.fillRect(0, 0, width, height);
    const meshStops: Array<[number, number, number, string]> = [
      [0.2 * width, 0.25 * height, 0.5 * width, pRgba],
      [0.8 * width, 0.2 * height, 0.55 * width, sRgba],
      [0.75 * width, 0.85 * height, 0.5 * width, pRgba],
      [0.15 * width, 0.8 * height, 0.55 * width, sRgba],
    ];
    for (const [cx, cy, r, color] of meshStops) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color);
      g.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = mid;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  pattern: Pattern,
  gridColor: string,
  width: number,
  height: number,
) {
  if (pattern === "none") return;
  ctx.save();
  ctx.globalAlpha = 0.3;
  const patternColor = hexToRgba(gridColor, 0.4);
  ctx.strokeStyle = patternColor;
  ctx.fillStyle = patternColor;
  ctx.lineWidth = 1;
  if (pattern === "grid") {
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  } else if (pattern === "dots") {
    for (let x = 20; x < width; x += 40) {
      for (let y = 20; y < height; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "diagonal") {
    // Lines at 45°; spacing chosen so perpendicular distance between
    // lines matches the CSS repeating-linear-gradient at 40px.
    const spacing = 40 * Math.SQRT2;
    for (let xi = -height; xi < width + spacing; xi += spacing) {
      ctx.beginPath();
      ctx.moveTo(xi, 0);
      ctx.lineTo(xi + height, height);
      ctx.stroke();
    }
  } else if (pattern === "waves") {
    // Mirrors the SVG <path d="M 0 10 Q 10 2 20 10 T 40 10"> tile.
    for (let yBase = 10; yBase < height; yBase += 20) {
      ctx.beginPath();
      ctx.moveTo(0, yBase);
      for (let x = 0; x < width; x += 40) {
        ctx.quadraticCurveTo(x + 10, yBase - 8, x + 20, yBase);
        ctx.quadraticCurveTo(x + 30, yBase + 8, x + 40, yBase);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawOrbs(
  ctx: CanvasRenderingContext2D,
  primaryColor: string,
  secondaryColor: string,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.filter = "blur(64px)";
  ctx.globalAlpha = 0.4;
  const o1cx = width + 100 - 192;
  const o1cy = -100 + 192;
  const orb1 = ctx.createRadialGradient(o1cx, o1cy, 0, o1cx, o1cy, 192);
  orb1.addColorStop(0, primaryColor);
  orb1.addColorStop(0.7, hexToRgba(primaryColor, 0));
  ctx.fillStyle = orb1;
  ctx.beginPath();
  ctx.arc(o1cx, o1cy, 192, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.3;
  const o2cx = -50 + 128;
  const o2cy = height + 50 - 128;
  const orb2 = ctx.createRadialGradient(o2cx, o2cy, 0, o2cx, o2cy, 128);
  orb2.addColorStop(0, secondaryColor);
  orb2.addColorStop(0.7, hexToRgba(secondaryColor, 0));
  ctx.fillStyle = orb2;
  ctx.beginPath();
  ctx.arc(o2cx, o2cy, 128, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCornerAccents(
  ctx: CanvasRenderingContext2D,
  primaryColor: string,
  secondaryColor: string,
  width: number,
  height: number,
) {
  const tl = ctx.createLinearGradient(0, 0, 96, 96);
  tl.addColorStop(0, hexToRgba(primaryColor, 0.2));
  tl.addColorStop(1, hexToRgba(primaryColor, 0));
  ctx.fillStyle = tl;
  ctx.fillRect(0, 0, 96, 96);

  const br = ctx.createLinearGradient(width, height, width - 96, height - 96);
  br.addColorStop(0, hexToRgba(secondaryColor, 0.2));
  br.addColorStop(1, hexToRgba(secondaryColor, 0));
  ctx.fillStyle = br;
  ctx.fillRect(width - 96, height - 96, 96, 96);
}

async function loadIconImages(
  items: ContentItem[],
  iconsContainerRef: React.RefObject<HTMLDivElement | null>,
): Promise<HTMLImageElement[]> {
  const iconsItem = items.find((it): it is IconsItem => it.kind === "icons");
  if (!iconsItem || !iconsContainerRef.current) return [];
  const svgs = Array.from(iconsContainerRef.current.querySelectorAll("svg"));
  return Promise.all(svgs.map((s) => svgToImage(s, iconsItem.color)));
}

function drawText(cur: Cursor, item: TextItem) {
  const { ctx, xForWidth, y } = cur;
  const family = resolveFont(item.fontFamily);
  ctx.font = `${item.weight} ${item.size}px ${family}`;
  ctx.fillStyle = item.color;
  const ctxAny = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  const prevLs = ctxAny.letterSpacing;
  if (item.letterSpacing && "letterSpacing" in ctx) {
    ctxAny.letterSpacing = `${item.size * item.letterSpacing}px`;
  }
  const text = item.uppercase ? item.text.toUpperCase() : item.text;
  const w = ctx.measureText(text).width;
  ctx.fillText(text, xForWidth(w), y);
  if ("letterSpacing" in ctx) ctxAny.letterSpacing = prevLs ?? "0px";
  cur.y = y + item.size + (item.marginBottom ?? 0);
}

function drawIcons(
  cur: Cursor,
  item: IconsItem,
  iconImages: HTMLImageElement[],
) {
  const { ctx, xForWidth, y } = cur;
  const count = SOCIAL_ICONS.length;
  const total = count * item.size + (count - 1) * item.gap;
  let x = xForWidth(total);
  for (const img of iconImages) {
    ctx.drawImage(img, x, y, item.size, item.size);
    x += item.size + item.gap;
  }
  cur.y = y + item.size + (item.marginBottom ?? 0);
}

function drawBadges(cur: Cursor, item: BadgesItem) {
  // Badges: laid out left-to-right like the preview, wrapping at the
  // content frame width so they don't overflow. A `borderColor` turns the
  // row into outlined pills (the "CTA pill" block style) instead of
  // filled ones.
  const { ctx, xForWidth, width, sidePadding, y } = cur;
  ctx.font = `500 ${item.size}px ${resolveFont(item.fontFamily)}`;
  ctx.textBaseline = "middle";
  const radius = item.size * 0.3;
  // The CSS box grows by the border on each side, so mirror that here and
  // stroke inside the outer rect to keep the two paths the same size.
  const bw = item.borderColor ? (item.borderWidth ?? 1) : 0;
  const badgeH = item.size + item.padY * 2 + bw * 2;
  const maxRowWidth = width - sidePadding * 2;
  let row: Array<{ label: string; w: number }> = [];
  let rowWidth = 0;
  const rowGap = item.gap;
  const lines: Array<Array<{ label: string; w: number }>> = [];
  const flush = () => {
    if (row.length > 0) {
      lines.push(row);
      row = [];
      rowWidth = 0;
    }
  };
  for (const label of item.labels) {
    const w = ctx.measureText(label).width + item.padX * 2 + bw * 2;
    const next = rowWidth + (row.length > 0 ? rowGap : 0) + w;
    if (next > maxRowWidth && row.length > 0) {
      flush();
    }
    row.push({ label, w });
    rowWidth = rowWidth + (row.length > 1 ? rowGap : 0) + w;
  }
  flush();
  let badgeY = y;
  for (const line of lines) {
    const lineWidth =
      line.reduce((s, b) => s + b.w, 0) + Math.max(0, line.length - 1) * rowGap;
    let bx = xForWidth(lineWidth);
    for (const { label, w } of line) {
      // Pill: rounded rect — filled and/or outlined — with text centred.
      if (item.fill) {
        ctx.fillStyle = item.fill;
        roundRect(ctx, bx, badgeY, w, badgeH, radius);
        ctx.fill();
      }
      if (bw > 0 && item.borderColor) {
        ctx.strokeStyle = item.borderColor;
        ctx.lineWidth = bw;
        roundRect(
          ctx,
          bx + bw / 2,
          badgeY + bw / 2,
          w - bw,
          badgeH - bw,
          Math.max(0, radius - bw / 2),
        );
        ctx.stroke();
      }
      ctx.fillStyle = item.color;
      ctx.textAlign = "center";
      ctx.fillText(label, bx + w / 2, badgeY + badgeH / 2);
      ctx.textAlign = "start";
      bx += w + rowGap;
    }
    badgeY += badgeH + 6;
  }
  ctx.textBaseline = "top";
  cur.y = badgeY - 6 + (item.marginBottom ?? 0);
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  footer: FooterItem,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.textBaseline = "top";
  ctx.font = `${footer.weight} ${footer.size}px ${resolveFont(footer.fontFamily)}`;
  ctx.fillStyle = footer.color;
  const w = ctx.measureText(footer.text).width;
  ctx.fillText(
    footer.text,
    width - footer.inset - w,
    height - footer.inset - footer.size,
  );
  ctx.restore();
}
