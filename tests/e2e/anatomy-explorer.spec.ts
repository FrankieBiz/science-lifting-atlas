import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('homepage anatomy supports search, selection, isolation, and view controls', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Explore the body.' }),
  ).toBeVisible();
  await expect(page.locator('[data-explorer-status]')).toHaveText(
    'Ready to explore',
    { timeout: 20_000 },
  );
  await page.getByRole('searchbox', { name: 'Find a muscle' }).fill('biceps');
  await page
    .getByRole('button', { name: 'Biceps brachii', exact: true })
    .click();
  await expect(page.locator('[data-selected-name]')).toHaveText(
    'Biceps brachii',
  );
  await page.getByRole('button', { name: 'Isolate muscle' }).click();
  await expect(
    page.getByRole('button', { name: 'Isolate muscle' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Back view', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Back view', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Reset model' }).click();
  await expect(
    page.getByRole('button', { name: 'Isolate muscle' }),
  ).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('a[href*="muscles/pectoralis-major"]')).toHaveCount(
    0,
  );
  if (process.env.SBLA_CAPTURE_POSTER === '1') {
    await page
      .getByRole('searchbox', { name: 'Find a muscle' })
      .fill('pectoralis');
    await page
      .getByRole('button', { name: 'Pectoralis major', exact: true })
      .click();
    const png = await page
      .locator('canvas')
      .evaluate((canvas) =>
        (canvas as HTMLCanvasElement).toDataURL('image/png'),
      );
    await writeFile(
      'assets/derived/bodyparts3d/anatomy-explorer-poster.png',
      Buffer.from(png.split(',')[1]!, 'base64'),
    );
  }
});

test('anatomy workspace fits a narrow screen and survives a failed model request', async ({
  page,
}) => {
  await page.route('**/anatomy-explorer*.glb', (route) =>
    route.fulfill({ status: 503 }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-explorer-status]')).toContainText(
    'Static view',
  );
  await expect(page.locator('[data-anatomy-poster]')).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await expect(
    page.getByRole('button', { name: 'Load interactive anatomy' }),
  ).toBeVisible();
});

test('production excludes unpublished muscle guide claims from HTML', async ({
  request,
}) => {
  const html = await (await request.get('/')).text();
  expect(html).not.toContain('data-muscle-guide');
  expect(html).not.toContain('data-learning-check');
  expect(html).not.toContain(
    'Can these case reports establish an injury rate?',
  );
  expect(html).not.toContain('claim-bench-press-pectoralis-rupture');
  expect(html).not.toContain('claim-pectoralis-major-adduction');
});
