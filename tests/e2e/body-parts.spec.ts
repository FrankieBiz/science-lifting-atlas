import { expect, test } from '@playwright/test';

test('a body part shows its overview, injuries, and newest-first studies', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .locator('#body-parts')
    .getByRole('link', { name: /Elbow/ })
    .click();

  await expect(page).toHaveURL(/\/body\/elbow\/$/);
  await expect(
    page.getByRole('heading', { name: 'Elbow', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'What it does.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Tennis elbow (lateral epicondylopathy)',
    }),
  ).toBeVisible();

  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(4);
  await expect(page.locator('#studies-injuries')).toBeVisible();
  await expect(page.locator('#studies-rehab')).toBeHidden();

  await page.getByRole('tab', { name: /Rehab and treatment/ }).click();
  await expect(page.locator('#studies-rehab')).toBeVisible();
  await expect(page.locator('#studies-injuries')).toBeHidden();

  const dates = await page
    .locator('#studies-rehab time')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('datetime')));
  expect(dates.length).toBeGreaterThan(0);
  expect(dates).toEqual([...dates].sort().reverse());
  await expect(
    page.locator('#studies-rehab .study-row').first(),
  ).toHaveAttribute('href', /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every study category stays readable', async ({ page }) => {
    await page.goto('/body/elbow/');
    for (const id of ['injuries', 'rehab', 'training', 'mechanics']) {
      await expect(page.locator(`#studies-${id}`)).toBeVisible();
    }
  });
});
