import { expect, test } from '@playwright/test';

test('a body part shows its overview, injuries, and newest-first studies', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .locator('#body-parts')
    .locator('a.part-card', { hasText: 'Elbow' })
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

test('the study type filter narrows the list to reviews', async ({ page }) => {
  await page.goto('/body/elbow/');
  const group = page.getByRole('group', { name: 'Study type' });
  await expect(group).toBeVisible();

  await group.getByRole('button', { name: 'Reviews' }).click();
  await expect(group.getByRole('button', { name: 'Reviews' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const visible = page.locator('#studies-injuries li:not([hidden])');
  const kinds = await visible.evaluateAll((rows) =>
    rows.map((row) => row.getAttribute('data-kind')),
  );
  expect(kinds.length).toBeGreaterThan(0);
  expect(new Set(kinds)).toEqual(new Set(['review']));
});

test('Show more reveals more studies', async ({ page }) => {
  await page.goto('/body/elbow/');
  const rows = page.locator('#studies-injuries li:not([hidden])');
  await expect(rows).toHaveCount(10);

  await page
    .getByRole('button', { name: /Show more/ })
    .first()
    .click();
  await expect(rows).toHaveCount(30);
});

test('each list links to the full PubMed search', async ({ page }) => {
  await page.goto('/body/elbow/');
  const link = page
    .locator('#studies-injuries .study-panel__count')
    .getByRole('link', { name: /See all/ });
  await expect(link).toHaveAttribute(
    'href',
    /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\?term=/,
  );
  await expect(link).toHaveAttribute('target', '_blank');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every study category stays readable', async ({ page }) => {
    await page.goto('/body/elbow/');
    for (const id of ['injuries', 'rehab', 'training', 'mechanics']) {
      await expect(page.locator(`#studies-${id}`)).toBeVisible();
    }
  });

  test('shows every study and hides the script-only controls', async ({
    page,
  }) => {
    await page.goto('/body/elbow/');
    await expect(page.locator('#studies-injuries li[data-kind]')).toHaveCount(
      50,
    );
    await expect(
      page.locator('#studies-injuries li[data-kind]:visible'),
    ).toHaveCount(50);
    await expect(page.locator('[data-study-filter]')).toBeHidden();
    await expect(page.locator('[data-more]').first()).toBeHidden();
  });
});
