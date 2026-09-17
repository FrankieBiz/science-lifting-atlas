import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('serves a useful static atlas shell without client JavaScript', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Understand what moves you.' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Scientific prose is withheld until explicit owner approval.',
    ),
  ).toBeVisible();
});
