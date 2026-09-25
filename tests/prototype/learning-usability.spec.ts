import { expect, test } from '@playwright/test';

test.describe('learning usability', () => {
  test.use({ javaScriptEnabled: true });
  test('learning sequence gives feedback and recovers from another muscle', async ({
    page,
  }) => {
    await page.goto('/');
    const guide = page.locator('[data-muscle-guide]');
    const check = guide.locator('[data-learning-check]').first();
    await check
      .getByRole('button', { name: 'Forearm bone', exact: true })
      .click();
    await expect(check.locator('[data-check-feedback]')).toContainText(
      'Try another answer',
    );
    await check
      .getByRole('button', { name: 'Upper arm bone', exact: true })
      .click();
    await expect(check.locator('[data-check-feedback]')).toContainText(
      'Correct',
    );
    await guide.getByRole('button', { name: 'Next section' }).click();
    await expect(guide.locator('[data-guide-panel="movement"]')).toBeFocused();
    await expect(guide.locator('[data-guide-step]')).toHaveText(
      'Section 2 of 4',
    );
    await guide.getByRole('button', { name: 'Previous section' }).click();
    await expect(guide.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.locator('[data-muscle="biceps-brachii"]').click();
    await guide
      .getByRole('button', { name: 'Learn about Pectoralis major' })
      .click();
    await expect(
      page.locator('[data-muscle="pectoralis-major"]'),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(guide.locator('[data-guide-content]')).toBeVisible();
  });
  test('camera focus remains resettable', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: 'Focus muscle', exact: true })
      .click();
    await expect(page.locator('[data-explorer-status]')).toContainText(
      'Focused on Pectoralis major',
    );
    await page.getByRole('button', { name: 'Reset model' }).click();
    await expect(page.locator('[data-explorer-status]')).toHaveText(
      'Ready to explore',
    );
  });
});

test('learning answer remains readable without JavaScript on record pages', async ({
  page,
}) => {
  await page.goto('/muscles/pectoralis-major/');
  const check = page.locator('[data-learning-check]').first();
  await check.getByText('Reveal answer', { exact: true }).click();
  await expect(check.locator('[data-static-answer]')).toBeVisible();
  await page.goto('/exercises/cable-fly-standing-bilateral-shoulder-height/');
  await expect(page.locator('.movement-diagram')).toHaveCount(0);
  await expect(page.locator('.entity-hero__specimen')).toContainText(
    'What you’ll explore',
  );
});
