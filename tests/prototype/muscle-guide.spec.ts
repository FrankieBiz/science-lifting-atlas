import { expect, test } from '@playwright/test';

test.describe('interactive muscle guide', () => {
  test.use({ javaScriptEnabled: true });
  test('muscle guide connects selection, injury context and evidence', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const guide = page.locator('[data-muscle-guide]');
    await expect(
      guide.getByRole('heading', { name: 'Pectoralis major' }),
    ).toBeVisible();
    await guide.getByRole('tab', { name: 'Injury context' }).click();
    await expect(
      guide
        .locator('.muscle-guide__context')
        .getByText(/Case reports and pooled case series have no denominator/),
    ).toBeVisible();
    await guide.getByText('Inspect evidence', { exact: true }).last().click();
    await expect(
      guide.locator('[data-guide-panel="injuries"] a').first(),
    ).toBeVisible();
    for (const link of await guide
      .locator('[data-guide-panel="injuries"] a')
      .all()) {
      const href = await link.getAttribute('href');
      expect((await request.get(href!)).ok()).toBe(true);
    }
    await page.locator('[data-muscle="biceps-brachii"]').click();
    await expect(
      guide.getByRole('heading', { name: 'Biceps brachii' }),
    ).toBeVisible();
    await expect(guide.locator('[data-guide-empty]')).toBeVisible();
    await expect(guide.locator('[data-guide-content]')).toBeHidden();
    await page.locator('[data-muscle="pectoralis-major"]').click();
    await expect(
      guide.getByRole('tab', { name: 'Injury context' }),
    ).toHaveAttribute('aria-selected', 'true');
    await guide.getByRole('tab', { name: 'Injury context' }).focus();
    await page.keyboard.press('Home');
    await expect(guide.getByRole('tab', { name: 'Overview' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(guide.getByRole('tab', { name: 'Movement' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.setViewportSize({ width: 320, height: 800 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  });
});

test('muscle guide is readable without JavaScript', async ({ page }) => {
  await page.goto('/');
  const guide = page.locator('[data-muscle-guide]');
  await expect(guide.locator('[data-guide-panel="movement"]')).toBeVisible();
  await expect(guide.locator('[data-guide-panel="injuries"]')).toBeVisible();
});
