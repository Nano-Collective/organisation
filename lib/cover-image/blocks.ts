// Text blocks — the repeatable content array behind post art.
//
// A post defines its own ordered list of blocks instead of being locked
// to a Title + Subtitle pair. Picking a `BlockStyle` sets the size,
// weight, font and palette role, so most posts need no further tuning;
// the per-block font / size % / colour fields override the style when a
// post needs something specific.
//
// The array-editing helpers below are pure so the page can hold the
// blocks in a single `useState` and the sidebar can stay stateless.

import type {
  BlockColor,
  BlockStyle,
  Colors,
  FontFamily,
  TextBlock,
} from "./types";

export type BlockStyleDef = {
  label: string;
  // Base font size in px, before the content scale and the block's own
  // size percentage are applied.
  size: number;
  weight: 400 | 500 | 600 | 700;
  font: FontFamily;
  color: BlockColor;
};

export const BLOCK_STYLES: Record<BlockStyle, BlockStyleDef> = {
  heading: {
    label: "Heading",
    size: 96,
    weight: 700,
    font: "mono",
    color: "foreground",
  },
  subheading: {
    label: "Subheading",
    size: 36,
    weight: 500,
    font: "sans",
    color: "muted",
  },
  body: {
    label: "Body",
    size: 24,
    weight: 400,
    font: "sans",
    color: "muted",
  },
  cta: {
    label: "CTA pill",
    size: 22,
    weight: 500,
    font: "sans",
    color: "primary",
  },
};

// Dropdown order for the Style picker.
export const BLOCK_STYLE_ORDER: BlockStyle[] = [
  "heading",
  "subheading",
  "body",
  "cta",
];

export const BLOCK_COLOR_ORDER: BlockColor[] = [
  "foreground",
  "muted",
  "faint",
  "primary",
  "secondary",
];

export const BLOCK_COLOR_LABELS: Record<BlockColor, string> = {
  foreground: "Foreground",
  muted: "Muted",
  faint: "Faint",
  primary: "Primary",
  secondary: "Secondary",
};

export function resolveBlockColor(color: BlockColor, colors: Colors): string {
  switch (color) {
    case "foreground":
      return colors.fg;
    case "muted":
      return colors.fgMuted;
    case "faint":
      return colors.fgFaint;
    case "primary":
      return colors.primary;
    case "secondary":
      return colors.secondary;
  }
}

// Monotonic id source. Ids only need to be unique within a session — they
// key the sidebar rows and target the edit helpers. Starting from a plain
// counter (rather than a random value) keeps the module-level defaults
// below identical between the prerender and the client hydration.
let nextBlockId = 0;

export function createBlock(style: BlockStyle, text: string): TextBlock {
  const def = BLOCK_STYLES[style];
  nextBlockId += 1;
  return {
    id: `block-${nextBlockId}`,
    text,
    style,
    font: def.font,
    size: 100,
    color: def.color,
    visible: true,
  };
}

// Migration: the old fixed Title and Subtitle fields become the first two
// blocks, with the same copy, fonts and sizes they rendered before.
export const DEFAULT_POST_BLOCKS: TextBlock[] = [
  createBlock("heading", "get-md"),
  createBlock("subheading", "v1.5.0"),
];

export function withBlockPatched(
  blocks: TextBlock[],
  id: string,
  patch: Partial<TextBlock>,
): TextBlock[] {
  return blocks.map((b) => (b.id === id ? { ...b, ...patch } : b));
}

// Switching style re-applies that style's font, colour and size, so the
// dropdown behaves like a preset rather than leaving stale overrides
// behind.
export function withBlockRestyled(
  blocks: TextBlock[],
  id: string,
  style: BlockStyle,
): TextBlock[] {
  const def = BLOCK_STYLES[style];
  return withBlockPatched(blocks, id, {
    style,
    font: def.font,
    color: def.color,
    size: 100,
  });
}

export function withoutBlock(blocks: TextBlock[], id: string): TextBlock[] {
  return blocks.filter((b) => b.id !== id);
}

// Swap a block with its neighbour. `dir` is -1 for up, 1 for down; a move
// past either end is a no-op.
export function withBlockMoved(
  blocks: TextBlock[],
  id: string,
  dir: -1 | 1,
): TextBlock[] {
  const from = blocks.findIndex((b) => b.id === id);
  const to = from + dir;
  if (from < 0 || to < 0 || to >= blocks.length) return blocks;
  const next = [...blocks];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
