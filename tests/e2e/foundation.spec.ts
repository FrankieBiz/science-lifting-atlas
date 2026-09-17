import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('serves a useful static atlas shell without client JavaScript', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Know what you’re training.' }),
  ).toBeVisible();
  await expect(page.getByText('First evidence chain in review')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'From anatomy to evidence.' }),
  ).toBeVisible();
});
