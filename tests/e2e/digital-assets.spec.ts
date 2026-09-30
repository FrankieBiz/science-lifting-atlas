import { expect, test } from '@playwright/test';

test.describe('deployed digital assets', () => {
  test('serves all digital assets with 200 OK and valid content types over HTTP', async ({
    request,
  }) => {
    const assets = [
      { path: '/favicon.svg', contentType: 'image/svg+xml' },
      {
        path: '/favicon.ico',
        contentType: /image\/(x-icon|vnd\.microsoft\.icon)/,
      },
      { path: '/apple-touch-icon.png', contentType: 'image/png' },
      { path: '/icons/icon-192.png', contentType: 'image/png' },
      { path: '/icons/icon-512.png', contentType: 'image/png' },
      { path: '/icons/icon-maskable-192.png', contentType: 'image/png' },
      { path: '/icons/icon-maskable-512.png', contentType: 'image/png' },
      { path: '/og-image.png', contentType: 'image/png' },
      { path: '/twitter-image.png', contentType: 'image/png' },
      { path: '/site.webmanifest', contentType: /json/ },
      { path: '/manifest.json', contentType: /json/ },
      { path: '/robots.txt', contentType: /text\/plain/ },
    ];

    for (const asset of assets) {
      const response = await request.get(asset.path);
      expect(response.status(), `Expected ${asset.path} to return 200 OK`).toBe(
        200,
      );

      const contentType = response.headers()['content-type'] ?? '';
      if (typeof asset.contentType === 'string') {
        expect(
          contentType,
          `Expected ${asset.path} content-type to include ${asset.contentType}`,
        ).toContain(asset.contentType);
      } else {
        expect(
          contentType,
          `Expected ${asset.path} content-type to match ${asset.contentType}`,
        ).toMatch(asset.contentType);
      }

      const body = await response.body();
      expect(
        body.length,
        `Expected ${asset.path} body to be non-empty`,
      ).toBeGreaterThan(0);
    }
  });

  test('declares and resolves every digital asset link in HTML page head', async ({
    page,
    request,
  }) => {
    await page.goto('/');

    const faviconSvg = page.locator('link[rel="icon"][type="image/svg+xml"]');
    await expect(faviconSvg).toHaveAttribute('href', './favicon.svg');
    const svgRes = await request.get('./favicon.svg');
    expect(svgRes.status()).toBe(200);

    const faviconIco = page.locator('link[rel="alternate icon"]');
    await expect(faviconIco).toHaveAttribute('href', './favicon.ico');
    const icoRes = await request.get('./favicon.ico');
    expect(icoRes.status()).toBe(200);

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toHaveAttribute(
      'href',
      './apple-touch-icon.png',
    );
    const appleRes = await request.get('./apple-touch-icon.png');
    expect(appleRes.status()).toBe(200);

    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', './site.webmanifest');
    const manifestRes = await request.get('./site.webmanifest');
    expect(manifestRes.status()).toBe(200);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', './og-image.png');
    const ogRes = await request.get('./og-image.png');
    expect(ogRes.status()).toBe(200);

    const twitterImage = page.locator('meta[name="twitter:image"]');
    await expect(twitterImage).toHaveAttribute(
      'content',
      './twitter-image.png',
    );
    const twitterRes = await request.get('./twitter-image.png');
    expect(twitterRes.status()).toBe(200);

    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#0b0e11');
  });

  test('nested pages link the same assets with depth-correct paths', async ({
    page,
    request,
  }) => {
    await page.goto('/body/knee/');

    const hrefs = [
      ['link[rel="icon"]', 'href', '../../favicon.svg'],
      ['link[rel="apple-touch-icon"]', 'href', '../../apple-touch-icon.png'],
      ['link[rel="manifest"]', 'href', '../../site.webmanifest'],
      ['meta[property="og:image"]', 'content', '../../og-image.png'],
    ] as const;

    for (const [selector, attribute, expected] of hrefs) {
      await expect(page.locator(selector)).toHaveAttribute(attribute, expected);
      const response = await request.get(new URL(expected, page.url()).href);
      expect(response.status(), `${expected} resolves`).toBe(200);
    }
  });
});
