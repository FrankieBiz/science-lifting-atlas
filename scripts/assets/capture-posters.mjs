// Capture the front and back anatomy posters from the live explorer.
//
// The posters keep the explorer's 862×672 framing, because every hotspot and
// plate point is stored as a percentage of that frame. Only the pixel count
// grows: the stage is rendered SUPERSAMPLE times larger than the output and
// downscaled in the browser, so edges stay smooth when the pages crop and zoom the poster.
//
// Usage: start the dev server, then
//   pnpm assets:capture-posters            (expects http://127.0.0.1:4321)
//   POSTER_ORIGIN=http://127.0.0.1:4322 pnpm assets:capture-posters

import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { POSTER_FRAME, POSTER_SIZE } from '../../src/lib/body-parts/poster.ts';

const ORIGIN = process.env.POSTER_ORIGIN ?? 'http://127.0.0.1:4321';
// Chromium caps a WebGL drawing buffer near 33 megapixels; 2× would exceed it.
const SUPERSAMPLE = 1.5;
const RENDER = {
  width: POSTER_SIZE.width * SUPERSAMPLE,
  height: POSTER_SIZE.height * SUPERSAMPLE,
};
const OUTPUTS = {
  front: resolve('assets/derived/bodyparts3d/anatomy-explorer-poster.png'),
  back: resolve('assets/derived/bodyparts3d/anatomy-explorer-poster-back.png'),
};

if (
  POSTER_SIZE.width * POSTER_FRAME.height !==
  POSTER_SIZE.height * POSTER_FRAME.width
) {
  throw new Error('POSTER_SIZE must keep the POSTER_FRAME aspect ratio');
}

/** @param {import('@playwright/test').Page} page */
async function nextFrames(page) {
  for (let frame = 0; frame < 2; frame += 1) {
    await page.evaluate(
      () => new Promise((done) => requestAnimationFrame(() => done(undefined))),
    );
  }
}

/** @param {import('@playwright/test').Page} page */
async function captureCanvas(page) {
  const dataUrl = await page.evaluate(
    ({ render, output }) => {
      const canvas = document.querySelector('[data-anatomy-canvas]');
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Anatomy canvas was not found');
      }
      if (canvas.width !== render.width || canvas.height !== render.height) {
        throw new Error(
          `Expected a ${render.width}×${render.height} canvas; received ${canvas.width}×${canvas.height}`,
        );
      }
      // A clamped drawing buffer silently changes the framing.
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      if (
        gl?.drawingBufferWidth !== render.width ||
        gl.drawingBufferHeight !== render.height
      ) {
        throw new Error(
          `WebGL drawing buffer was clamped to ${gl?.drawingBufferWidth}×${gl?.drawingBufferHeight}`,
        );
      }
      const poster = document.createElement('canvas');
      poster.width = output.width;
      poster.height = output.height;
      const context = poster.getContext('2d');
      if (!context) throw new Error('2D canvas is unavailable');
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(canvas, 0, 0, output.width, output.height);
      return poster.toDataURL('image/png');
    },
    { render: RENDER, output: POSTER_SIZE },
  );

  const base64 = dataUrl.split(',')[1];
  if (!base64) throw new Error('Canvas did not return a PNG data URL');
  return Buffer.from(base64, 'base64');
}

// Chromium's multi-process sandbox cannot start inside some agent sandboxes.
const args = process.env.POSTER_SINGLE_PROCESS
  ? ['--no-sandbox', '--disable-gpu-sandbox', '--single-process']
  : [];
const browser = await chromium.launch({ args });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(ORIGIN);
  const loadButton = page.locator('[data-load]');
  if (await loadButton.isVisible()) await loadButton.click();
  await page
    .locator('[data-explorer-status]')
    .getByText('Ready to explore')
    .waitFor({ state: 'visible', timeout: 60_000 });

  // The front poster shows the default selection, Pectoralis major.
  await page
    .getByRole('searchbox', { name: 'Find a muscle' })
    .fill('pectoralis');
  await page
    .getByRole('button', { name: 'Pectoralis major', exact: true })
    .click();

  await page.evaluate(async (size) => {
    const stage = document.querySelector('[data-stage]');
    if (!(stage instanceof HTMLElement)) {
      throw new Error('Anatomy stage was not found');
    }
    stage.style.width = `${size.width}px`;
    stage.style.height = `${size.height}px`;
    stage.style.maxWidth = 'none';
    stage.style.maxHeight = 'none';
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  }, RENDER);

  for (const view of /** @type {const} */ (['front', 'back'])) {
    await page.locator(`[data-view="${view}"]`).click();
    await nextFrames(page);
    await writeFile(OUTPUTS[view], await captureCanvas(page));
    console.log(`${view} poster written to ${OUTPUTS[view]}`);
  }
} finally {
  await browser.close();
}
