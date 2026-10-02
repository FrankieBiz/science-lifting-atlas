import type { PosterPoint, PosterView } from '../../data/body-parts/types.ts';
import { POSTER_FRAME } from './poster.ts';

type Crop = Readonly<{ x0: number; x1: number; y0: number; y1: number }>;

/** Body crop on each poster, in poster percent. Tuned to the alpha bounds. */
export const BODY_CROP: Readonly<Record<PosterView, Crop>> = {
  front: { x0: 34, x1: 66, y0: 4, y1: 97 },
  back: { x0: 35, x1: 65, y0: 4, y1: 96 },
};

/** CSS percentages for positioning a full poster inside its cropped figure. */
export function mapImageStyle(view: PosterView) {
  const { x0, x1, y0, y1 } = BODY_CROP[view];
  const cropWidth = x1 - x0;
  const cropHeight = y1 - y0;

  return {
    width: 100 / (cropWidth / 100),
    left: (-x0 / cropWidth) * 100,
    top: (-y0 / cropHeight) * 100,
  };
}

/** Map poster coordinates into the cropped figure, as percentages. */
export function mapPoint(point: PosterPoint) {
  const { x0, x1, y0, y1 } = BODY_CROP[point.view];
  return {
    left: ((point.x - x0) / (x1 - x0)) * 100,
    top: ((point.y - y0) / (y1 - y0)) * 100,
  };
}

/** Figure width divided by figure height for the visible poster crop. */
export function figureAspect(view: PosterView) {
  const { x0, x1, y0, y1 } = BODY_CROP[view];
  return ((x1 - x0) * POSTER_FRAME.width) / ((y1 - y0) * POSTER_FRAME.height);
}

/**
 * Which edge of a hotspot its label should align to. Labels are wider than the
 * 44px target, so near the side edges a centred label is cut off by the
 * figure's `overflow: hidden`; aligning it to the inner edge keeps it visible.
 */
export function labelEdge(leftPercent: number): 'start' | 'center' | 'end' {
  if (leftPercent < 30) return 'start';
  if (leftPercent > 70) return 'end';
  return 'center';
}

/** Smallest distance between points displayed on the same figure. */
export function closestPairPx(points: PosterPoint[], figureWidthPx: number) {
  let closest = Number.POSITIVE_INFINITY;
  const byView: Record<PosterView, PosterPoint[]> = { front: [], back: [] };
  for (const point of points) byView[point.view].push(point);

  for (const view of ['front', 'back'] as const) {
    const figureHeightPx = figureWidthPx / figureAspect(view);
    const mapped = byView[view].map((point) => mapPoint(point));
    for (let first = 0; first < mapped.length; first += 1) {
      for (let second = first + 1; second < mapped.length; second += 1) {
        const a = mapped[first];
        const b = mapped[second];
        if (!a || !b) continue;
        const dx = ((a.left - b.left) / 100) * figureWidthPx;
        const dy = ((a.top - b.top) / 100) * figureHeightPx;
        closest = Math.min(closest, Math.hypot(dx, dy));
      }
    }
  }

  return closest;
}
