import { expect, test } from '@playwright/test';

test.describe('private preview visitor path', () => {
  test.use({ javaScriptEnabled: true });

  test('selection explains what is available for each muscle', async ({
    page,
  }) => {
    await page.goto('/');
    const guide = page.locator('[data-muscle-guide]');
    const explorer = page.locator('.anatomy-explorer');

    await page.locator('[data-muscle="gastrocnemius-heads"]').click();
    await expect(
      guide.getByRole('heading', { name: 'Gastrocnemius' }),
    ).toBeVisible();
    await expect(guide.locator('[data-guide-badge]')).toHaveText(
      '3D anatomy preview',
    );
    await expect(guide.locator('[data-guide-intro]')).toContainText(
      'A research guide for Gastrocnemius is not available',
    );
    await expect(guide.locator('[data-guide-empty]')).toBeVisible();
    await expect(guide.locator('[data-guide-content]')).toBeHidden();
    await expect(guide).not.toContainText('Choose Pectoralis major');
    await expect(explorer.locator('[data-guide-link]')).toBeHidden();
    await expect(explorer.locator('[data-evidence-link]')).toBeHidden();

    await page.locator('[data-muscle="pectoralis-major"]').click();
    await expect(guide.locator('[data-guide-badge]')).toHaveText(
      'Unpublished evidence preview',
    );
    await expect(guide.locator('[data-guide-content]')).toBeVisible();
    await expect(explorer.locator('[data-guide-link]')).toBeVisible();
    await expect(explorer.locator('[data-evidence-link]')).toBeVisible();
  });

  test('home action opens the body explorer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore the body' }).click();
    await expect(page).toHaveURL(/#anatomy-explorer$/);
    await expect(page.locator('#anatomy-explorer')).toBeVisible();
  });
});

test('methodology describes the current independent review rule', async ({
  page,
}) => {
  await page.goto('/methodology/');
  await expect(page.locator('#roles-title').locator('..')).toContainText(
    'independent',
  );
  await expect(page.locator('#roles-title').locator('..')).toContainText(
    'did not author',
  );
  await expect(page.locator('#roles-title').locator('..')).not.toContainText(
    'distinct Claude account',
  );
});
