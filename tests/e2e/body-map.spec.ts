import { expect, test } from '@playwright/test';

test('the front body map opens the selected body-part page', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .locator('[data-body-figure="front"]')
    .getByRole('link', { name: 'Elbow' })
    .click();

  await expect(page).toHaveURL(/\/body\/elbow\/$/);
  await expect(
    page.getByRole('heading', { name: 'Elbow', level: 1 }),
  ).toBeVisible();
});

test('each body-map hotspot has an accessible name and a working route', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const hotspots = page.locator('[data-body-map] .body-map__spot');
  await expect(hotspots).not.toHaveCount(0);

  for (const hotspot of await hotspots.all()) {
    const label = (
      await hotspot.locator('.body-map__label').textContent()
    )?.trim();
    const href = await hotspot.getAttribute('href');
    expect(label).toBeTruthy();
    expect(href).toBeTruthy();
    await expect(hotspot).toHaveAccessibleName(label!);
    const response = await request.get(new URL(href!, page.url()).toString());
    expect(response.status(), `${label} route should resolve`).toBe(200);
  }
});

test('the mobile view toggle switches between front and back figures', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const front = page.locator('[data-body-figure="front"]');
  const back = page.locator('[data-body-figure="back"]');

  await expect(front).toBeVisible();
  await expect(back).toBeHidden();
  const backToggle = page
    .locator('[data-body-toggle]')
    .getByRole('button', { name: 'Back', exact: true });
  await backToggle.click();
  await expect(back).toBeVisible();
  await expect(front).toBeHidden();
  await expect(backToggle).toHaveAttribute('aria-pressed', 'true');
});

test.describe('without JavaScript', () => {
  test.use({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });

  test('both body figures remain visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-body-figure="front"]')).toBeVisible();
    await expect(page.locator('[data-body-figure="back"]')).toBeVisible();
  });
});
