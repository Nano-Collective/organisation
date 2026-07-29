// Build the derived `ContentItem[]` from the current user state.
//
// This is a pure function of the form state — no React, no DOM, no
// refs — so it's easy to test and reason about. Both the live preview
// (`CoverPreview`) and the canvas download (`render.ts`) consume the
// same output, so the export always matches what the user sees.

import { BLOCK_STYLES, resolveBlockColor } from "./blocks";
import { hexToRgba } from "./color";
import { FONT_SANS } from "./fonts";
import type { Colors, ContentItem, TextBlock } from "./types";

// CTA pill geometry, expressed as ratios of the block's font size so a
// pill keeps its proportions at any size. The values match the tag list's
// 22px/14px/8px so both read as the same component.
const CTA_PAD_X_RATIO = 14 / 22;
const CTA_PAD_Y_RATIO = 8 / 22;
const CTA_BORDER_RATIO = 2 / 22;

export type BuildItemsInput = {
  mode: "cover" | "post";
  // Cover state
  coverSubtitle: string;
  coverWebsite: string;
  showCoverSubtitle: boolean;
  showCoverIcons: boolean;
  showCoverWebsite: boolean;
  // Post state
  postBlocks: TextBlock[];
  showPostIcons: boolean;
  postBadges: string;
  showPostBadges: boolean;
  // Active palette — blocks resolve their colour role against this, so
  // the hue slider and the light/dark theme flow straight through.
  colors: Colors;
  // Size scaling (post-build, content-scale %)
  contentScale: number;
};

export function buildItems(input: BuildItemsInput): ContentItem[] {
  const cs = input.contentScale / 100;
  const { colors } = input;
  if (input.mode === "cover") {
    const out: ContentItem[] = [];
    if (input.showCoverSubtitle) {
      out.push({
        kind: "text",
        text: input.coverSubtitle,
        size: 18 * cs,
        weight: 500,
        color: colors.fgFaint,
        uppercase: true,
        letterSpacing: 0.025,
        fontFamily: FONT_SANS,
      });
    }
    if (input.showCoverIcons) {
      out.push({
        kind: "icons",
        size: 56 * cs,
        gap: 32 * cs,
        color: colors.fgMuted,
        marginBottom: 20 * cs,
      });
    }
    if (input.showCoverWebsite) {
      out.push({
        kind: "text",
        text: input.coverWebsite,
        size: 48 * cs,
        weight: 700,
        color: colors.fg,
        fontFamily: FONT_SANS,
      });
    }
    return out;
  }

  const out: ContentItem[] = [];
  // Blocks render top to bottom in array order.
  for (const block of input.postBlocks) {
    if (!block.visible || block.text.trim().length === 0) continue;
    const def = BLOCK_STYLES[block.style];
    const size = def.size * cs * (block.size / 100);
    const color = resolveBlockColor(block.color, colors);
    if (block.style === "cta") {
      out.push({
        kind: "badges",
        labels: [block.text.trim()],
        size,
        gap: 12 * cs,
        padX: size * CTA_PAD_X_RATIO,
        padY: size * CTA_PAD_Y_RATIO,
        color,
        borderColor: color,
        borderWidth: Math.max(1, size * CTA_BORDER_RATIO),
        fontFamily: block.font,
      });
    } else {
      out.push({
        kind: "text",
        text: block.text,
        size,
        weight: def.weight,
        color,
        fontFamily: block.font,
      });
    }
  }
  if (input.showPostBadges && input.postBadges.trim().length > 0) {
    const labels = input.postBadges
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    if (labels.length > 0) {
      out.push({
        kind: "badges",
        labels,
        size: 22 * cs,
        gap: 12 * cs,
        padX: 14 * cs,
        padY: 8 * cs,
        color: colors.fg,
        fill: hexToRgba(colors.primary, 0.18),
      });
    }
  }
  if (input.showPostIcons) {
    out.push({
      kind: "icons",
      size: 56 * cs,
      gap: 32 * cs,
      color: colors.fgMuted,
    });
  }
  return out;
}
