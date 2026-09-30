import { describe, expect, it } from 'vitest';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';
import {
  BODY_CROP,
  closestPairPx,
  figureAspect,
  mapImageStyle,
  mapPoint,
} from '../../src/lib/body-parts/body-map.ts';

describe('body map crop geometry', () => {
  it('positions the poster using the selected crop', () => {
    expect(BODY_CROP.front).toEqual({ x0: 34, x1: 66, y0: 4, y1: 97 });
    expect(BODY_CROP.back).toEqual({ x0: 35, x1: 65, y0: 4, y1: 96 });
    const imageStyle = mapImageStyle('front');
    expect(imageStyle.width).toBe(312.5);
    expect(imageStyle.left).toBe(-106.25);
    expect(imageStyle.top).toBeCloseTo(-400 / 93, 10);
  });

  it('maps poster coordinates into the cropped figure', () => {
    const point = mapPoint({ view: 'front', x: 50, y: 26 });
    expect(point.left).toBe(50);
    expect(point.top).toBeCloseTo((22 / 93) * 100, 10);
  });

  it('uses the cropped poster dimensions for figure aspect', () => {
    expect(figureAspect('front')).toBeCloseTo((32 * 862) / (93 * 672), 10);
    expect(figureAspect('back')).toBeCloseTo((30 * 862) / (92 * 672), 10);
  });

  it('measures the closest same-view points in CSS pixels', () => {
    expect(
      closestPairPx(
        [
          { view: 'front', x: 50, y: 50 },
          { view: 'front', x: 51, y: 50 },
          { view: 'back', x: 51, y: 50 },
        ],
        320,
      ),
    ).toBeCloseTo(10, 8);
  });

  it('keeps every hotspot at least 44 px from others in its view at 320 px', () => {
    for (const view of ['front', 'back'] as const) {
      const points = BODY_PARTS.flatMap((part) =>
        part.hotspots
          .filter((point) => point.view === view)
          .map((point) => ({ point, name: part.name })),
      );
      const aspect = figureAspect(view);
      let closest = { distance: Number.POSITIVE_INFINITY, left: '', right: '' };

      for (let first = 0; first < points.length; first += 1) {
        for (let second = first + 1; second < points.length; second += 1) {
          const firstPoint = points[first];
          const secondPoint = points[second];
          if (!firstPoint || !secondPoint) continue;
          const a = mapPoint(firstPoint.point);
          const b = mapPoint(secondPoint.point);
          const dx = ((a.left - b.left) / 100) * 320;
          const dy = ((a.top - b.top) / 100) * (320 / aspect);
          const distance = Math.hypot(dx, dy);
          if (distance < closest.distance) {
            closest = {
              distance,
              left: firstPoint.name,
              right: secondPoint.name,
            };
          }
        }
      }

      expect(
        closest.distance,
        `${view}: ${closest.left} and ${closest.right} are ${closest.distance.toFixed(1)} px apart`,
      ).toBeGreaterThanOrEqual(44);
      expect(
        closestPairPx(
          points.map(({ point }) => point),
          320,
        ),
      ).toBeGreaterThanOrEqual(44);
    }
  });
});
