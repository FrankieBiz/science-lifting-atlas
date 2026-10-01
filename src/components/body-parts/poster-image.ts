import { getImage } from 'astro:assets';

import backPoster from '../../../assets/derived/bodyparts3d/anatomy-explorer-poster-back.png';
import frontPoster from '../../../assets/derived/bodyparts3d/anatomy-explorer-poster.png';
import type { PosterView } from '../../data/body-parts/types.ts';
import { POSTER_FRAME, POSTER_SIZE } from '../../lib/body-parts/poster.ts';

const SOURCES = { front: frontPoster, back: backPoster } as const;

/**
 * Pages crop and zoom the poster, so the rendered image is often several
 * times wider than its box. These widths cover a zoomed plate on a 3× phone.
 */
const WIDTHS = [
  POSTER_FRAME.width,
  POSTER_FRAME.width * 2,
  POSTER_FRAME.width * 3,
  POSTER_SIZE.width,
];

/**
 * Astro emits optimized images at root-absolute `/assets/` URLs and ignores the
 * relative `assetsPrefix`. Rewrite them to `./assets/`, like every other build
 * asset, so the relative-asset build hook can point them at each page's root.
 * Dev-server URLs (`/_image?…`) pass through unchanged.
 */
function relativeBuildUrls(value: string) {
  return value.replace(/(^|,\s*)\/assets\//gu, '$1./assets/');
}

/**
 * Every poster on the home page uses the body map's `sizes`, the largest need
 * there, so the browser downloads one file per view and reuses it for the
 * explorer and the region cards. The body-map crop shows about a third of the
 * poster width: two figures per row below 62rem, then a figure near 26rem.
 */
export const HOME_POSTER_SIZES = '(max-width: 62rem) 156vw, min(100vw, 82rem)';

/** Responsive WebP attributes for one anatomy poster. `sizes` is required. */
export async function posterImage(view: PosterView, sizes: string) {
  const image = await getImage({
    src: SOURCES[view],
    widths: WIDTHS,
    format: 'webp',
    quality: 82,
  });
  return {
    src: relativeBuildUrls(image.src),
    srcset: relativeBuildUrls(image.srcSet.attribute),
    sizes,
    width: POSTER_FRAME.width,
    height: POSTER_FRAME.height,
  };
}
