import { expect, test } from '@playwright/test';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';

const CATEGORY_IDS = ['injuries', 'rehab', 'training', 'mechanics'];

for (const part of BODY_PARTS) {
  test.describe(`/body/${part.slug}/`, () => {
    test('loads with its overview, four tabs, and newest-first studies', async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(error.message));

      await page.goto(`/body/${part.slug}/`);

      await expect(
        page.getByRole('heading', { name: part.name, level: 1 }),
      ).toBeVisible();
      await expect(page.getByRole('tab')).toHaveCount(4);

      for (const id of CATEGORY_IDS) {
        const dates = await page
          .locator(`#studies-${id} time`)
          .evaluateAll((nodes) =>
            nodes.map((node) => node.getAttribute('datetime') ?? ''),
          );
        expect(dates.length, `${id} has studies`).toBeGreaterThan(0);
        expect(dates, `${id} is newest first`).toEqual(
          [...dates].sort().reverse(),
        );

        const firstLink = page.locator(`#studies-${id} .study-row`).first();
        await expect(firstLink).toHaveAttribute(
          'href',
          /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/,
        );

        await expect(
          page
            .locator(`#studies-${id} .study-panel__count`)
            .getByRole('link', { name: /See all/ }),
        ).toHaveAttribute(
          'href',
          /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\?term=/,
        );
      }

      expect(errors, 'no console errors').toEqual([]);
    });

    test('does not scroll sideways at 320 px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(`/body/${part.slug}/`);
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(width).toBeLessThanOrEqual(320);
    });
  });
}
