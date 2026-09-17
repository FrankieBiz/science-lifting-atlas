import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('the static home journey exposes evidence status without unpublished claim routes', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Understand what moves you.' }),
  ).toBeVisible();
  await expect(page.getByText('Reviewed claims')).toBeVisible();
  await expect(page.getByText('Public claims')).toBeVisible();
  await expect(
    page.getByText(
      'Scientific prose is withheld until explicit owner approval.',
    ),
  ).toBeVisible();
  await expect(page.locator('a[href^="/muscles/"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/exercises/"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/sources/"]')).toHaveCount(0);
});

test('the methodology route discloses AI roles and the publication gate', async ({
  page,
}) => {
  await page.goto('/methodology/');

  await expect(
    page.getByRole('heading', { name: 'How the atlas earns a statement.' }),
  ).toBeVisible();
  await expect(page.getByText('AI review is not credentialed')).toBeVisible();
  await expect(
    page.getByText('No scientific claim is public yet.'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Fail-closed publication' }),
  ).toBeVisible();
});

test('the ordinary build excludes every unpublished prototype route', async ({
  request,
}) => {
  for (const route of [
    '/muscles/pectoralis-major/',
    '/exercises/barbell-flat-bench-press/',
    '/exercises/cable-fly-standing-bilateral-shoulder-height/',
    '/sources/source-pmid-9356931/',
  ]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});
