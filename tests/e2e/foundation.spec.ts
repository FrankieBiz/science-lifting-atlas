import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('serves a useful static foundation without client JavaScript', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Science-Based Lifting Atlas' }),
  ).toBeVisible();
  await expect(
    page.getByText('Evidence-first resistance training anatomy'),
  ).toBeVisible();
});
