// Pure crop math for the anatomy plate. The poster is cropped and zoomed so
// a chosen point sits at the centre of the plate.

export const POSTERS = {
  front: { width: 862, height: 672 },
  back: { width: 862, height: 672 },
} as const;

/** Position the poster so (x, y) sits at the plate centre. plateRatio = plate height / plate width. */
export function plateImageStyle(
  point: { x: number; y: number },
  zoom: number,
  plateRatio: number,
  poster: { width: number; height: number } = POSTERS.front,
) {
  const ratio = poster.height / poster.width;
  const width = zoom * 100;
  return {
    width,
    left: 50 - (point.x / 100) * width,
    top: 50 - ((point.y / 100) * zoom * ratio * 100) / plateRatio,
  };
}
