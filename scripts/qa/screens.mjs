// Capture full-page screenshots of the homepage and every body-part page at
// desktop and phone widths, plus the elbow page with the Rehab tab and the
// Reviews filter active. Assumes the built site is served on port 4321:
//   pnpm build && pnpm preview --host 127.0.0.1 --port 4321
// Screenshots land in test-results/screens/ (git-ignored).

import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4321';
const OUT = path.resolve('test-results/screens');
const SIZES = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'phone', width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const size of SIZES) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
    });
    const page = await context.newPage();

    /** @param {string} route @param {string} name */
    const shoot = async (route, name) => {
      await page.goto(`${BASE}${route}`);
      await page.waitForLoadState('networkidle');
      const file = path.join(OUT, `${name}-${size.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
    };

    await shoot('/', 'home');
    for (const part of BODY_PARTS) {
      await shoot(`/body/${part.slug}/`, part.slug);
    }

    await page.goto(`${BASE}/body/elbow/`);
    await page.getByRole('tab', { name: /Rehab and treatment/ }).click();
    await page
      .getByRole('group', { name: 'Study type' })
      .getByRole('button', { name: 'Reviews' })
      .click();
    const file = path.join(OUT, `elbow-rehab-reviews-${size.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);

    await context.close();
  }
} finally {
  await browser.close();
}
