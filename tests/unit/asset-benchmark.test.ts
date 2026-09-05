import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

import {
  SAMPLE,
  median,
  parseObjStats,
  validateSampleIdentity,
} from '../../scripts/assets/benchmark.mjs';

describe('real asset browser benchmark support', () => {
  it('parses OBJ geometry deterministically and triangulates polygon faces', () => {
    const sample = [
      '# fixture',
      'v 0 0 0',
      'v 1 0 0',
      'v 1 1 0',
      'v 0 1 0',
      'vn 0 0 1',
      'f 1//1 2//1 3//1 4//1',
    ].join('\n');

    expect(parseObjStats(sample)).toEqual({
      vertices: 4,
      normals: 1,
      textureCoordinates: 0,
      faces: 1,
      triangles: 2,
    });
  });

  it('calculates the median without mutating the measurements', () => {
    const values = [9, 3, 7, 1, 5];
    expect(median(values)).toBe(5);
    expect(values).toEqual([9, 3, 7, 1, 5]);
    expect(median([2, 8])).toBe(5);
  });

  it('fails closed when the acquired sample bytes do not match provenance', () => {
    expect(() =>
      validateSampleIdentity(Buffer.from('wrong'), {
        bytes: 5,
        sha256: '0'.repeat(64),
      }),
    ).toThrow(/SHA-256 mismatch/);
  });

  it('accepts bytes only when both size and SHA-256 match', () => {
    const bytes = Buffer.from('real-sample');
    expect(
      validateSampleIdentity(bytes, {
        bytes: 11,
        sha256:
          '6294f6de410f563d920232886a2d0ae690f0aea8c344bfc6ed3f21303d298248',
      }),
    ).toBeUndefined();
  });

  it('pins the checked-in lawful sample and recorded browser protocol', async () => {
    const bytes = await readFile(SAMPLE.path);
    validateSampleIdentity(bytes, SAMPLE);
    expect(parseObjStats(bytes.toString('utf8'))).toEqual({
      vertices: 1019,
      normals: 1019,
      textureCoordinates: 0,
      faces: 1536,
      triangles: 1536,
    });

    const report = JSON.parse(
      await readFile(
        new URL(
          '../../docs/licenses/bodyparts3d-browser-benchmark.json',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    expect(report.sample).toMatchObject({
      bytes: SAMPLE.bytes,
      sha256: SAMPLE.sha256,
      vertices: 1019,
      triangles: 1536,
    });
    expect(report.protocol).toMatchObject({
      warmupTrials: 1,
      measuredTrials: 5,
      cache: 'no-store',
      canvas: '320x320 WebGL',
    });
    expect(report.trials).toHaveLength(5);
  });
});
