import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import explorer from '../../docs/licenses/anatomy-explorer-manifest.json';
import {
  ALL_BODY_PARTS,
  BODY_PARTS,
  REGION_ORDER,
  bodyPartForMuscle,
} from '../../src/data/body-parts/index.ts';
import { MUSCLE_REGIONS } from '../../src/data/body-parts/muscle-map.ts';
import { plateImageStyle } from '../../src/lib/body-parts/plate.ts';
import { validateBodyPart } from '../../src/lib/body-parts/validate.ts';

describe('body-part registry', () => {
  it('has one file per region, in REGION_ORDER', () => {
    expect(ALL_BODY_PARTS.map((part) => part.slug)).toEqual([...REGION_ORDER]);
    for (const part of ALL_BODY_PARTS) {
      expect(
        existsSync(path.resolve(`src/data/body-parts/regions/${part.slug}.ts`)),
        part.slug,
      ).toBe(true);
    }
  });

  it('passes the validator for every published region', () => {
    const errors = BODY_PARTS.flatMap(validateBodyPart);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  it('maps every explorer muscle to a published region', () => {
    for (const entity of explorer.entities) {
      expect(MUSCLE_REGIONS[entity.id], entity.id).toBeDefined();
      expect(bodyPartForMuscle(entity.id)?.status, entity.id).toBe('published');
    }
    for (const slugs of Object.values(MUSCLE_REGIONS)) {
      for (const slug of slugs) {
        expect(REGION_ORDER as readonly string[]).toContain(slug);
      }
    }
  });

  it('has a study file for every published region', () => {
    for (const part of BODY_PARTS) {
      expect(
        existsSync(path.resolve(`src/data/studies/${part.slug}.json`)),
        part.slug,
      ).toBe(true);
      const file = JSON.parse(
        readFileSync(
          path.resolve(`src/data/studies/${part.slug}.json`),
          'utf8',
        ),
      ) as { slug: string };
      expect(file.slug).toBe(part.slug);
    }
  });
});

describe('plateImageStyle', () => {
  it('matches the elbow hero plate from the current build', () => {
    const style = plateImageStyle({ x: 40.8, y: 37.2 }, 2.6, 1.25);
    expect(style.width).toBeCloseTo(260, 2);
    expect(style.left).toBeCloseTo(-56.08, 2);
    expect(style.top).toBeCloseTo(-10.32, 2);
  });
});
