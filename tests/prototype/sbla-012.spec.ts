import { expect, test } from '@playwright/test';

test('the homepage reflows across phone and tablet widths', async ({
  page,
}) => {
  for (const width of [320, 390, 705, 768, 990]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `viewport ${width}`,
    ).toBeLessThanOrEqual(width);
  }
});

test('record navigation takes the reader directly to takeaways and evidence', async ({
  page,
}) => {
  for (const route of [
    '/muscles/pectoralis-major/',
    '/exercises/barbell-flat-bench-press/',
  ]) {
    await page.goto(route);
    await page
      .getByRole('link', { name: 'Key takeaways', exact: true })
      .click();
    await expect(page).toHaveURL(/#summary-title$/);
    await expect(page.locator('#summary-title')).toBeInViewport();
    await page.goto(route);
    await page
      .getByRole('link', { name: 'Explore evidence', exact: true })
      .click();
    await expect(page).toHaveURL(/#evidence-spine-title$/);
    await expect(page.locator('#evidence-spine-title')).toBeInViewport();
  }
});

test('the local evidence journey links a muscle, claim, and source', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the atlas' }).click();
  await expect(page).toHaveURL(/\/muscles\/pectoralis-major\/$/);
  await expect(page.getByLabel('Prototype publication status')).toContainText(
    'not approved for publication',
  );

  const firstClaim = page.locator('.prototype-claim').first();
  await expect(firstClaim.locator('.claim-certainty')).toBeVisible();
  await firstClaim.getByText('Inspect evidence').click();
  await expect(firstClaim.getByText('Read with care')).toBeVisible();
  await expect(firstClaim.getByText('Source trail')).toBeVisible();
  await firstClaim.locator('a[href*="/sources/"]').first().click();
  await expect(page).toHaveURL(/\/sources\/[^/]+\/$/);
  await expect(page.getByLabel('Prototype publication status')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,nofollow',
  );
});

test('the prototype has stable share routes and a visible methodology disclosure', async ({
  page,
  context,
}) => {
  await page.goto('/muscles/pectoralis-major/');
  const sharedUrl = page.url();
  const recipient = await context.newPage();
  await recipient.goto(sharedUrl);
  await expect(recipient).toHaveURL(sharedUrl);
  await expect(recipient.getByRole('heading', { level: 1 })).toContainText(
    'Pectoralis major',
  );
  await recipient
    .getByRole('link', { name: 'Barbell flat bench press' })
    .click();
  await expect(recipient).toHaveURL(/\/exercises\/barbell-flat-bench-press\/$/);
  await recipient.getByRole('link', { name: 'How it works' }).click();
  await expect(
    recipient.getByText('AI review is not credentialed'),
  ).toBeVisible();
});

test('keyboard, mobile reflow, and reduced motion preserve the evidence path', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(
        () => matchMedia('(prefers-reduced-motion: reduce)').matches,
      ),
    )
    .toBe(true);
  await page.getByRole('link', { name: 'Explore the atlas' }).click();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});

test('every local evidence archetype discloses unpublished status to browsers', async ({
  page,
}) => {
  for (const route of [
    '/muscles/pectoralis-major/',
    '/exercises/barbell-flat-bench-press/',
    '/sources/source-pmid-9356931/',
  ]) {
    await page.goto(route);
    await expect(page.getByLabel('Prototype publication status')).toContainText(
      'not approved for publication',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,nofollow',
    );
  }
});
