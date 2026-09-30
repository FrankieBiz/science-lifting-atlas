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

/** PubMed terms as they were before the registry split (must never drift). */
// Regions are removed from this snapshot when their R task deliberately revises the queries.
const QUERY_SNAPSHOT: Record<string, Record<string, string>> = {
  shoulder: {
    injuries:
      '("rotator cuff"[ti] OR (impingement[ti] AND shoulder[ti]) OR "SLAP lesion*"[ti] OR "superior labr*"[ti] OR (shoulder[ti] AND (dislocation[ti] OR instability[ti])) OR "subacromial pain"[ti]) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '((shoulder pain[ti] OR "rotator cuff"[ti] OR "subacromial"[ti] OR "shoulder instability"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '((shoulder[ti] OR deltoid[ti] OR "rotator cuff"[ti] OR "overhead press"[ti] OR "lateral raise"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '((shoulder[ti] OR glenohumeral[ti] OR scapula*[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
};

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

  it('keeps the original PubMed queries for the existing regions', () => {
    for (const [slug, queries] of Object.entries(QUERY_SNAPSHOT)) {
      const part = ALL_BODY_PARTS.find((p) => p.slug === slug);
      expect(part, slug).toBeDefined();
      expect(
        Object.fromEntries(part!.categories.map((c) => [c.id, c.query])),
      ).toEqual(queries);
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
