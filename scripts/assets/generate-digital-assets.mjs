import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '../../');
const PUBLIC = resolve(ROOT, 'public');
const ICONS_DIR = resolve(PUBLIC, 'icons');

await mkdir(ICONS_DIR, { recursive: true });

// 1. Vector Favicon SVG (Brand Mark)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#151b22" />
      <stop offset="70%" stop-color="#0b0e11" />
      <stop offset="100%" stop-color="#06080a" />
    </radialGradient>
    <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="subtleGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="tissueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0887d" />
      <stop offset="50%" stop-color="#d46a5f" />
      <stop offset="100%" stop-color="#993241" />
    </linearGradient>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c5d5e0" />
      <stop offset="100%" stop-color="#6e808d" />
    </linearGradient>
    <linearGradient id="axisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e8e3d7" stop-opacity="0" />
      <stop offset="15%" stop-color="#e8e3d7" stop-opacity="0.3" />
      <stop offset="50%" stop-color="#e8e3d7" stop-opacity="0.85" />
      <stop offset="85%" stop-color="#e8e3d7" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#e8e3d7" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="coreLight" cx="38%" cy="38%" r="62%">
      <stop offset="0%" stop-color="#ffb8b0" />
      <stop offset="35%" stop-color="#d46a5f" />
      <stop offset="100%" stop-color="#801e23" />
    </radialGradient>
  </defs>

  <!-- Background container -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="510" height="510" x="1" y="1" rx="111" fill="none" stroke="#8ea0ad" stroke-opacity="0.2" stroke-width="2" />

  <!-- Outer Calibration Circle -->
  <circle cx="256" cy="256" r="212" fill="none" stroke="#8ea0ad" stroke-opacity="0.14" stroke-width="1.5" stroke-dasharray="4 8" />

  <!-- Coordinate Registration Ticks -->
  <path d="M 256 30 L 256 44 M 256 468 L 256 482 M 30 256 L 44 256 M 468 256 L 482 256" stroke="#6aafa3" stroke-width="2.5" stroke-opacity="0.65" stroke-linecap="round" />

  <!-- Subtle anatomical egg contour -->
  <ellipse cx="256" cy="256" rx="160" ry="192" fill="#d46a5f" fill-opacity="0.04" />

  <!-- Outer Tilted Orbit (-12 deg) -->
  <g transform="rotate(-12 256 256)">
    <ellipse cx="256" cy="256" rx="182" ry="218" fill="none" stroke="url(#silverGrad)" stroke-width="2.2" stroke-opacity="0.48" />
    <circle cx="74" cy="256" r="5" fill="#8ea0ad" />
    <circle cx="438" cy="256" r="5" fill="#8ea0ad" />
  </g>

  <!-- Inner Tilted Orbit (+18 deg) in Tissue Red -->
  <g transform="rotate(18 256 256)">
    <ellipse cx="256" cy="256" rx="140" ry="178" fill="none" stroke="url(#tissueGrad)" stroke-width="2.8" stroke-opacity="0.7" />
    <circle cx="116" cy="256" r="4.5" fill="#d46a5f" />
    <circle cx="396" cy="256" r="4.5" fill="#d46a5f" />
  </g>

  <!-- Central Observational Axis -->
  <line x1="256" y1="60" x2="256" y2="452" stroke="url(#axisGrad)" stroke-width="1.5" />
  <line x1="242" y1="128" x2="270" y2="128" stroke="#e8e3d7" stroke-opacity="0.35" stroke-width="1" />
  <line x1="246" y1="192" x2="266" y2="192" stroke="#e8e3d7" stroke-opacity="0.35" stroke-width="1" />
  <line x1="246" y1="320" x2="266" y2="320" stroke="#e8e3d7" stroke-opacity="0.35" stroke-width="1" />
  <line x1="242" y1="384" x2="270" y2="384" stroke="#e8e3d7" stroke-opacity="0.35" stroke-width="1" />

  <!-- Anatomical 'S' Vector Monogram -->
  <path d="M 294 182 C 294 150 272 134 244 134 C 212 134 194 156 194 190 C 194 244 318 238 318 314 C 318 356 284 378 244 378 C 208 378 186 356 184 324"
        fill="none" stroke="#e8e3d7" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Luminous Tissue Core -->
  <circle cx="256" cy="252" r="30" fill="#d46a5f" fill-opacity="0.38" filter="url(#coreGlow)" />
  <circle cx="256" cy="252" r="15" fill="url(#coreLight)" filter="url(#subtleGlow)" />
  <circle cx="253" cy="249" r="4" fill="#ffffff" fill-opacity="0.95" />
</svg>`;

// Maskable Icon SVG (with ~18% safe padding for circular adaptive icons)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGradMask" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#151b22" />
      <stop offset="70%" stop-color="#0b0e11" />
      <stop offset="100%" stop-color="#06080a" />
    </radialGradient>
    <filter id="coreGlowMask" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="tissueGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0887d" />
      <stop offset="50%" stop-color="#d46a5f" />
      <stop offset="100%" stop-color="#993241" />
    </linearGradient>
    <linearGradient id="silverGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c5d5e0" />
      <stop offset="100%" stop-color="#6e808d" />
    </linearGradient>
    <radialGradient id="coreLightMask" cx="38%" cy="38%" r="62%">
      <stop offset="0%" stop-color="#ffb8b0" />
      <stop offset="35%" stop-color="#d46a5f" />
      <stop offset="100%" stop-color="#801e23" />
    </radialGradient>
  </defs>

  <rect width="512" height="512" fill="url(#bgGradMask)" />

  <g transform="translate(51.2, 51.2) scale(0.8)">
    <circle cx="256" cy="256" r="212" fill="none" stroke="#8ea0ad" stroke-opacity="0.14" stroke-width="1.5" stroke-dasharray="4 8" />
    <path d="M 256 30 L 256 44 M 256 468 L 256 482 M 30 256 L 44 256 M 468 256 L 482 256" stroke="#6aafa3" stroke-width="2.5" stroke-opacity="0.65" stroke-linecap="round" />
    <g transform="rotate(-12 256 256)">
      <ellipse cx="256" cy="256" rx="182" ry="218" fill="none" stroke="url(#silverGradMask)" stroke-width="2.2" stroke-opacity="0.48" />
      <circle cx="74" cy="256" r="5" fill="#8ea0ad" />
      <circle cx="438" cy="256" r="5" fill="#8ea0ad" />
    </g>
    <g transform="rotate(18 256 256)">
      <ellipse cx="256" cy="256" rx="140" ry="178" fill="none" stroke="url(#tissueGradMask)" stroke-width="2.8" stroke-opacity="0.7" />
      <circle cx="116" cy="256" r="4.5" fill="#d46a5f" />
      <circle cx="396" cy="256" r="4.5" fill="#d46a5f" />
    </g>
    <line x1="256" y1="60" x2="256" y2="452" stroke="#e8e3d7" stroke-opacity="0.6" stroke-width="1.5" />
    <path d="M 294 182 C 294 150 272 134 244 134 C 212 134 194 156 194 190 C 194 244 318 238 318 314 C 318 356 284 378 244 378 C 208 378 186 356 184 324"
          fill="none" stroke="#e8e3d7" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="256" cy="252" r="30" fill="#d46a5f" fill-opacity="0.38" filter="url(#coreGlowMask)" />
    <circle cx="256" cy="252" r="15" fill="url(#coreLightMask)" />
    <circle cx="253" cy="249" r="4" fill="#ffffff" fill-opacity="0.95" />
  </g>
</svg>`;

// 2. Open Graph Card HTML (1200x630)
const ogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: #0b0e11;
      color: #e8e3d7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      display: flex;
      position: relative;
    }
    .background-pattern {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 900px 600px at 80% 45%, rgba(212, 106, 95, 0.08), transparent 70%),
        radial-gradient(ellipse 800px 500px at 15% 85%, rgba(106, 175, 163, 0.05), transparent 70%),
        radial-gradient(circle at 50% 50%, #13171c 0%, #0b0e11 85%);
      z-index: 1;
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(142, 160, 173, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(142, 160, 173, 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 2;
    }
    .border-frame {
      position: absolute;
      inset: 24px;
      border: 1px solid rgba(142, 160, 173, 0.16);
      pointer-events: none;
      z-index: 10;
    }
    .corner-mark {
      position: absolute;
      width: 16px;
      height: 16px;
      border-color: #6aafa3;
      border-style: solid;
      opacity: 0.7;
    }
    .corner-tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }
    
    .content-area {
      position: relative;
      z-index: 5;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 64px 72px;
      align-items: center;
      justify-content: space-between;
    }
    .left-column {
      max-width: 620px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .eyebrow {
      font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;
      color: #6aafa3;
      font-size: 13px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .eyebrow::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d46a5f;
      box-shadow: 0 0 10px #d46a5f;
    }
    h1 {
      font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
      font-size: 58px;
      font-weight: 500;
      line-height: 1.08;
      letter-spacing: -0.02em;
      color: #f7f4ed;
    }
    .thesis {
      font-size: 24px;
      line-height: 1.4;
      color: #8ea0ad;
      font-weight: 400;
    }
    .badges {
      margin-top: 14px;
      display: flex;
      gap: 14px;
    }
    .badge {
      font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 7px 14px;
      background: rgba(142, 160, 173, 0.08);
      border: 1px solid rgba(142, 160, 173, 0.22);
      border-radius: 4px;
      color: #c5d5e0;
    }
    .badge-accent {
      border-color: rgba(212, 106, 95, 0.4);
      background: rgba(212, 106, 95, 0.1);
      color: #e87a6f;
    }

    .right-column {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 420px;
      height: 420px;
    }
    .plate-graphic {
      width: 380px;
      height: 380px;
      filter: drop-shadow(0 0 45px rgba(212, 106, 95, 0.22));
    }
    .coordinates-stamp {
      position: absolute;
      bottom: 40px;
      right: 72px;
      font-family: ui-monospace, "SFMono-Regular", Consolas, monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      color: rgba(142, 160, 173, 0.5);
      z-index: 10;
    }
  </style>
</head>
<body>
  <div class="background-pattern"></div>
  <div class="grid-lines"></div>
  <div class="border-frame"></div>
  <div class="corner-mark corner-tl"></div>
  <div class="corner-mark corner-tr"></div>
  <div class="corner-mark corner-bl"></div>
  <div class="corner-mark corner-br"></div>

  <div class="content-area">
    <div class="left-column">
      <div class="eyebrow">Plate 00 · Scientific Evidence System · SBLA/001</div>
      <h1>Science-Based Lifting Atlas</h1>
      <p class="thesis">Evidence-first resistance training anatomy traced from practical language to claims and exact locators.</p>
      <div class="badges">
        <span class="badge badge-accent">Claim-Level Proof</span>
        <span class="badge">Static-First</span>
        <span class="badge">Open Access</span>
      </div>
    </div>
    <div class="right-column">
      <svg class="plate-graphic" viewBox="0 0 512 512">
        <defs>
          <filter id="ogCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="ogCoreLight" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#ffc0b8" />
            <stop offset="40%" stop-color="#d46a5f" />
            <stop offset="100%" stop-color="#801e23" />
          </radialGradient>
        </defs>
        
        <circle cx="256" cy="256" r="218" fill="none" stroke="#8ea0ad" stroke-opacity="0.16" stroke-width="1.5" stroke-dasharray="6 8" />
        <circle cx="256" cy="256" r="206" fill="rgba(11, 14, 17, 0.4)" stroke="#6aafa3" stroke-opacity="0.3" stroke-width="1" />
        
        <!-- Registration crosshairs -->
        <path d="M 256 16 L 256 36 M 256 476 L 256 496 M 16 256 L 36 256 M 476 256 L 496 256" stroke="#6aafa3" stroke-width="2" stroke-opacity="0.6" stroke-linecap="round" />
        
        <!-- Outer Orbit (-12 deg) -->
        <g transform="rotate(-12 256 256)">
          <ellipse cx="256" cy="256" rx="176" ry="212" fill="none" stroke="#8ea0ad" stroke-width="2.5" stroke-opacity="0.45" />
          <circle cx="80" cy="256" r="6" fill="#8ea0ad" />
          <circle cx="432" cy="256" r="6" fill="#8ea0ad" />
        </g>
        
        <!-- Inner Orbit (+18 deg) in Tissue Red -->
        <g transform="rotate(18 256 256)">
          <ellipse cx="256" cy="256" rx="134" ry="172" fill="none" stroke="#d46a5f" stroke-width="3" stroke-opacity="0.75" />
          <circle cx="122" cy="256" r="5" fill="#d46a5f" />
          <circle cx="390" cy="256" r="5" fill="#d46a5f" />
        </g>

        <!-- Vertical observational axis -->
        <line x1="256" y1="50" x2="256" y2="462" stroke="#e8e3d7" stroke-opacity="0.6" stroke-width="1.5" />
        <line x1="240" y1="128" x2="272" y2="128" stroke="#e8e3d7" stroke-opacity="0.4" stroke-width="1" />
        <line x1="246" y1="192" x2="266" y2="192" stroke="#e8e3d7" stroke-opacity="0.4" stroke-width="1" />
        <line x1="246" y1="320" x2="266" y2="320" stroke="#e8e3d7" stroke-opacity="0.4" stroke-width="1" />
        <line x1="240" y1="384" x2="272" y2="384" stroke="#e8e3d7" stroke-opacity="0.4" stroke-width="1" />

        <!-- S Monogram in warm white -->
        <path d="M 296 180 C 296 148 274 132 244 132 C 212 132 192 154 192 188 C 192 244 320 238 320 316 C 320 358 286 380 244 380 C 206 380 184 358 182 322"
              fill="none" stroke="#e8e3d7" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Glowing Core -->
        <circle cx="256" cy="252" r="34" fill="#d46a5f" fill-opacity="0.4" filter="url(#ogCoreGlow)" />
        <circle cx="256" cy="252" r="16" fill="url(#ogCoreLight)" />
        <circle cx="252" cy="248" r="4.5" fill="#ffffff" fill-opacity="0.95" />
      </svg>
    </div>
  </div>

  <div class="coordinates-stamp">REG: LAT 46.2° / ELEV +12 / REF SBLA-SYSTEM-2026</div>
</body>
</html>`;

console.log('Writing public/favicon.svg...');
await writeFile(resolve(PUBLIC, 'favicon.svg'), faviconSvg);

// Icons render through sharp (librsvg), not a browser page. A page wraps the
// SVG in an 8px body margin and does not scale its fixed 512px size, which
// clipped the 180/192px renders and left a white strip on every icon.
/** @param {string} svg @param {number} size @param {string} path */
async function renderIcon(svg, size, path) {
  await sharp(Buffer.from(svg), { density: (72 * size) / 512 })
    .resize(size, size)
    .png()
    .toFile(path);
}

console.log('Rendering icons via sharp...');
// "any" icons keep the rounded tile and a transparent corner.
await renderIcon(faviconSvg, 192, resolve(ICONS_DIR, 'icon-192.png'));
await renderIcon(faviconSvg, 512, resolve(ICONS_DIR, 'icon-512.png'));
// Full-bleed square art: iOS and Android apply their own mask.
await renderIcon(maskableSvg, 180, resolve(PUBLIC, 'apple-touch-icon.png'));
await renderIcon(maskableSvg, 192, resolve(ICONS_DIR, 'icon-maskable-192.png'));
await renderIcon(maskableSvg, 512, resolve(ICONS_DIR, 'icon-maskable-512.png'));

if (process.argv.includes('--icons-only')) {
  console.log('Skipping the Open Graph card (--icons-only).');
} else {
  console.log('Rendering the Open Graph card via Playwright...');
  const browser = await chromium.launch({ headless: true });
  try {
    const pageOg = await browser.newPage({
      viewport: { width: 1200, height: 630 },
    });
    await pageOg.setContent(ogHtml);
    await pageOg.screenshot({ path: resolve(PUBLIC, 'og-image.png') });
    await pageOg.screenshot({ path: resolve(PUBLIC, 'twitter-image.png') });
    await pageOg.close();
  } finally {
    await browser.close();
  }
}

// 3. Generate multi-resolution favicon.ico via Python PIL
console.log('Generating multi-resolution favicon.ico via PIL...');
const icoPath = resolve(PUBLIC, 'favicon.ico');
const sourceIconPath = resolve(ICONS_DIR, 'icon-512.png');

const pythonIcoScript = `
from PIL import Image
import sys

source_path = sys.argv[1]
ico_path = sys.argv[2]

img = Image.open(source_path)
img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print(f"favicon.ico created successfully at {ico_path}")
`;

const pyResult = spawnSync(
  'python3',
  ['-c', pythonIcoScript, sourceIconPath, icoPath],
  {
    encoding: 'utf8',
  },
);
if (pyResult.status !== 0) {
  throw new Error(`Failed to generate favicon.ico: ${pyResult.stderr}`);
}

// 4. Generate Web App Manifests
console.log('Writing web app manifests...');
const webmanifest = {
  name: 'Science-Based Lifting Atlas',
  short_name: 'Lifting Atlas',
  description: 'Evidence-first resistance training anatomy',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'any',
  background_color: '#0b0e11',
  theme_color: '#0b0e11',
  icons: [
    {
      src: './icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: './icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: './icons/icon-maskable-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: './icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

await writeFile(
  resolve(PUBLIC, 'site.webmanifest'),
  JSON.stringify(webmanifest, null, 2) + '\n',
);
await writeFile(
  resolve(PUBLIC, 'manifest.json'),
  JSON.stringify(webmanifest, null, 2) + '\n',
);

// 5. Generate robots.txt
console.log('Writing robots.txt...');
const robotsTxt = `User-agent: *
Allow: /
`;
await writeFile(resolve(PUBLIC, 'robots.txt'), robotsTxt);

console.log('All digital assets generated successfully.');
