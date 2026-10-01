// The anatomy posters, captured from the explorer by
// scripts/assets/capture-posters.mjs.

/**
 * The frame every hotspot and plate point is measured against. Points are
 * percentages of this frame, so they hold at any capture resolution.
 */
export const POSTER_FRAME = { width: 862, height: 672 } as const;

/** Pixel size of the captured poster files: the frame at 4× resolution. */
export const POSTER_SIZE = {
  width: POSTER_FRAME.width * 4,
  height: POSTER_FRAME.height * 4,
} as const;
