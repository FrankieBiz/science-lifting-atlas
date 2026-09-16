import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('serves a useful static atlas shell without client JavaScript', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Strength, mapped to evidence.' }),
  ).toBeVisible();
  await expect(
    page.getByText('Scientific content remains locked pending owner approval.'),
  ).toBeVisible();
});
