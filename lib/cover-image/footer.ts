// Corner watermark.
//
// The wordmark is a fixed constant rather than a free-text field so every
// export stays on-brand; the only control is the show/hide toggle. It's
// deliberately outside the block array — it pins to the bottom-right edge
// instead of flowing with the content stack.

import { FONT_SANS } from "./fonts";
import type { Colors, FooterItem } from "./types";

export const FOOTER_TEXT = "nanocollective.org";

const FOOTER_SIZE = 18;

export function buildFooter(input: {
  show: boolean;
  colors: Colors;
  contentScale: number;
  // Reuses the layout's side padding so the watermark lines up with the
  // content frame rather than floating at its own arbitrary inset.
  sidePadding: number;
}): FooterItem | null {
  if (!input.show) return null;
  return {
    text: FOOTER_TEXT,
    size: FOOTER_SIZE * (input.contentScale / 100),
    weight: 500,
    color: input.colors.fgFaint,
    fontFamily: FONT_SANS,
    inset: input.sidePadding,
  };
}
