import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const ORIGIN = 'http://127.0.0.1:4321';
const OUTPUT = resolve(
  'assets/derived/bodyparts3d/anatomy-explorer-poster-back.png',
);
const FRONT_CHECK = resolve(tmpdir(), 'front-check.png');

/** @param {import('@playwright/test').Page} page */
async function captureCanvas(page) {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.querySelector('[data-anatomy-canvas]');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Anatomy canvas was not found');
    }
    if (canvas.width !== 862 || canvas.height !== 672) {
      throw new Error(
        `Expected an 862×672 canvas; received ${canvas.width}×${canvas.height}`,
      );
    }
    return canvas.toDataURL('image/png');
  });

  const base64 = dataUrl.split(',')[1];
  if (!base64) throw new Error('Canvas did not return a PNG data URL');
  return Buffer.from(base64, 'base64');
}

const browser = await chromium.launch();
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

  await page.evaluate(async () => {
    const stage = document.querySelector('[data-stage]');
    if (!(stage instanceof HTMLElement)) {
      throw new Error('Anatomy stage was not found');
    }
    stage.style.width = '862px';
    stage.style.height = '672px';
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  });

  const dimensions = await page
    .locator('[data-anatomy-canvas]')
    .evaluate((node) => {
      if (!(node instanceof HTMLCanvasElement)) {
        throw new Error('Anatomy canvas was not found');
      }
      return { width: node.width, height: node.height };
    });
  if (dimensions.width !== 862 || dimensions.height !== 672) {
    throw new Error(
      `Expected an 862×672 canvas; received ${dimensions.width}×${dimensions.height}`,
    );
  }

  await page.locator('[data-view="front"]').click();
  await page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))),
  );
  await page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))),
  );
  await writeFile(FRONT_CHECK, await captureCanvas(page));

  await page.locator('[data-view="back"]').click();
  await page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))),
  );
  await page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))),
  );
  await writeFile(OUTPUT, await captureCanvas(page));
  console.log(`Back poster written to ${OUTPUT}`);
  console.log(`Front check written to ${FRONT_CHECK}`);
} finally {
  await browser.close();
}
