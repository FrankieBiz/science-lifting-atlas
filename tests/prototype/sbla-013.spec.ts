import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: true });

test('the optional pectoralis model loads only after activation', async ({
  page,
}) => {
  test.setTimeout(90_000);
  const modelRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) modelRequests.push(request.url());
  });
  await page.goto('/muscles/pectoralis-major/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,nofollow',
  );
  await expect(
    page.getByRole('heading', { name: 'What this means for training.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Explore body in 3D' }),
  ).toBeVisible();
  expect(modelRequests).toHaveLength(0);

  const modelResponse = page.waitForResponse((response) =>
    response.url().endsWith('.glb'),
  );
  await page.getByRole('button', { name: 'Explore body in 3D' }).click();
  expect((await modelResponse).status()).toBe(200);
  const viewer = page.locator('model-viewer');
  await expect(viewer).toBeVisible();
  await expect(viewer).toHaveAttribute('src', /sbla013-pectoralis.*\.glb/);
  expect(modelRequests).toHaveLength(1);
  await expect(page.getByText('3D model ready')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Explore body in 3D' }),
  ).toBeHidden();
  const readCamera = () =>
    viewer.evaluate((element) => {
      const model = element as HTMLElement & {
        getCameraOrbit: () => { theta: number; phi: number; radius: number };
        getFieldOfView: () => number;
      };
      const { theta, phi, radius } = model.getCameraOrbit();
      return [theta, phi, radius, model.getFieldOfView()].map((value) =>
        Number(value.toFixed(4)),
      );
    });
  const initialCamera = await readCamera();
  await viewer.hover();
  await page.mouse.wheel(0, -250);
  await expect.poll(readCamera).not.toEqual(initialCamera);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await expect.poll(readCamera).toEqual(initialCamera);
});

test('a failed model request preserves the static route and offers retry', async ({
  page,
}) => {
  await page.route('**/sbla013-pectoralis.glb', (route) =>
    route.fulfill({ status: 503 }),
  );
  await page.goto('/muscles/pectoralis-major/');
  await page.getByRole('button', { name: 'Explore body in 3D' }).click();
  await expect(page.getByText('The 3D model could not load.')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Explore body in 3D' }),
  ).toBeEnabled();
  await expect(page.locator('.entity-hero__specimen img')).toBeVisible();
});

test('the static anatomy and evidence remain with JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/muscles/pectoralis-major/');
  await expect(page.locator('.entity-hero__specimen img')).toBeVisible();
  await expect(
    page.getByText(
      'The static anatomy image above and all evidence remain available',
    ),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'What this means for training.' }),
  ).toBeVisible();
  await context.close();
});
