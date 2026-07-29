// Shared types for the cover / post image generator.
//
// These describe the shapes of:
//   - user-controlled state values (Alignment, Mode, Pattern, BgStyle, FontFamily)
//   - the derived `Colors` palette produced by paletteFromHue
//   - the `ContentItem` discriminated union that drives both the live preview
//     and the canvas download
//   - the `PreviewProps` contract between the page and CoverPreview

export type Alignment = "left" | "center" | "right";
export type Mode = "cover" | "post";
export type Theme = "light" | "dark";
export type Pattern = "grid" | "dots" | "diagonal" | "waves" | "none";
export type BgStyle = "gradient" | "radial" | "mesh" | "solid";
export type FontFamily = "sans" | "mono" | "serif" | "display";

// A post's content is an ordered array of text blocks rather than a
// fixed Title/Subtitle pair. `BlockStyle` supplies the default size,
// weight, font and colour for a block; the per-block font/size/colour
// fields override those defaults.
export type BlockStyle = "heading" | "subheading" | "body" | "cta";

// Palette role a block draws its colour from, so blocks follow the hue
// slider and the light/dark theme instead of storing raw hex.
export type BlockColor =
  | "foreground"
  | "muted"
  | "faint"
  | "primary"
  | "secondary";

export type TextBlock = {
  id: string;
  text: string;
  style: BlockStyle;
  font: FontFamily;
  // Percentage of the style's default size. 100 = use the style default.
  size: number;
  color: BlockColor;
  visible: boolean;
};

// Coarse preset for the vertical gap between consecutive content
// items (title, subtitle, badges, icons). The page multiplies the
// chosen pixel value by the content scale, so the relative spacing
// stays consistent when the user bumps the scale slider.
export type Spacing = "tight" | "normal" | "relaxed" | "loose";

export type Colors = {
  primary: string;
  secondary: string;
  grid: string;
  // Background base tint and the edge it fades to.
  bgMid: string;
  bgEdge: string;
  // Theme-aware text colours, threaded through to the content items so
  // the same build renders on a light or dark canvas.
  fg: string;
  fgMuted: string;
  fgFaint: string;
};

export type TextItem = {
  kind: "text";
  text: string;
  size: number;
  weight: 400 | 500 | 600 | 700;
  color: string;
  uppercase?: boolean;
  letterSpacing?: number;
  fontFamily?: string;
  marginBottom?: number;
};

export type IconsItem = {
  kind: "icons";
  size: number;
  gap: number;
  color: string;
  marginBottom?: number;
};

// Rounded pill row. Used both by the tag list (filled, no border) and by
// "CTA pill" text blocks (bordered, single label, own font).
export type BadgesItem = {
  kind: "badges";
  labels: string[];
  size: number;
  gap: number;
  padX: number;
  padY: number;
  color: string;
  fill?: string;
  borderColor?: string;
  borderWidth?: number;
  fontFamily?: string;
  marginBottom?: number;
};

export type ContentItem = TextItem | IconsItem | BadgesItem;

// Corner watermark. Positioned independently of the content stack — it
// sits a fixed inset from the bottom-right edge rather than flowing with
// the blocks.
export type FooterItem = {
  text: string;
  size: number;
  weight: 400 | 500 | 600 | 700;
  color: string;
  fontFamily?: string;
  inset: number;
};

export type PreviewProps = {
  width: number;
  height: number;
  alignment: Alignment;
  bottomPadding: number;
  sidePadding: number;
  contentGap: number;
  verticalCenter: boolean;
  bgStyle: BgStyle;
  pattern: Pattern;
  colors: Colors;
  items: ContentItem[];
  footer: FooterItem | null;
  iconsContainerRef: React.RefObject<HTMLDivElement | null>;
};
