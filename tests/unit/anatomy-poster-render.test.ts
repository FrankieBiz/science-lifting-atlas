import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { POSTER_FRAME, POSTER_SIZE } from '../../src/lib/body-parts/poster.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path: string) => readFileSync(`${root}${path}`, 'utf8');
const script = read('scripts/assets/render-posters.py');
const explorer = read('src/components/sbla-013/AnatomyExplorer.astro');

/** The number captured by the first group of `pattern`, as a number. */
function number(source: string, pattern: RegExp, label: string) {
  const match = pattern.exec(source);
  if (!match) throw new Error(`${label} not found`);
  return Number(match[1]);
}

describe('poster renderer matches the explorer it replaces', () => {
  it('uses the explorer camera, so every hotspot keeps its place', () => {
    expect(number(script, /^FOV_DEG = ([\d.]+)/m, 'FOV_DEG')).toBe(
      number(explorer, /PerspectiveCamera\(\s*([\d.]+)\s*,/, 'explorer fov'),
    );
    const position = /camera\.position\.set\(\s*0,\s*([\d.]+),\s*([\d.]+)\s*\)/;
    expect(number(script, /^CAMERA_HEIGHT = ([\d.]+)/m, 'height')).toBe(
      number(explorer, position, 'explorer camera height'),
    );
    expect(number(script, /^CAMERA_DISTANCE = ([\d.]+)/m, 'distance')).toBe(
      Number(position.exec(explorer)![2]),
    );
    expect(
      number(
        script,
        /^TARGET = np\.array\(\[0\.0, ([\d.]+), 0\.0\]\)/m,
        'target',
      ),
    ).toBe(
      number(
        explorer,
        /controls\.target\.set\(\s*0,\s*([\d.]+),\s*0\s*\)/,
        'explorer target',
      ),
    );
  });

  it('measures against the same 862 x 672 frame as the hotspot data', () => {
    const frame = /^FRAME = \((\d+), (\d+)\)/m.exec(script);
    expect(frame).not.toBeNull();
    expect([Number(frame![1]), Number(frame![2])]).toEqual([
      POSTER_FRAME.width,
      POSTER_FRAME.height,
    ]);
    expect(number(script, /^DEFAULT_SCALE = (\d+)/m, 'scale')).toBe(
      POSTER_SIZE.width / POSTER_FRAME.width,
    );
  });
});

describe('committed posters', () => {
  /** Width, height and colour type read from a PNG's IHDR chunk. */
  function header(path: string) {
    const bytes = readFileSync(`${root}${path}`);
    expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG');
    return {
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
      colourType: bytes[25],
    };
  }

  it.each([
    'assets/derived/bodyparts3d/anatomy-explorer-poster.png',
    'assets/derived/bodyparts3d/anatomy-explorer-poster-back.png',
  ])('%s is a transparent PNG at poster resolution', (path) => {
    expect(header(path)).toEqual({
      width: POSTER_SIZE.width,
      height: POSTER_SIZE.height,
      colourType: 6, // RGBA
    });
  });
});

const hasPython =
  spawnSync('python3', ['-c', 'import numpy, PIL'], { cwd: root }).status === 0;

describe.skipIf(!hasPython)('silhouette check (needs numpy and Pillow)', () => {
  it('finds each poster framed like the model seen through the explorer camera', () => {
    const run = spawnSync(
      'python3',
      ['scripts/assets/render-posters.py', '--check'],
      { cwd: root, encoding: 'utf8' },
    );
    expect(run.status, `${run.stdout}\n${run.stderr}`).toBe(0);
    expect(run.stdout).toMatch(/front: silhouette IoU 0\.\d+/);
    expect(run.stdout).toMatch(/back: silhouette IoU 0\.\d+/);
  }, 120_000);
});
