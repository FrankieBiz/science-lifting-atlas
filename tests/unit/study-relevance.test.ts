import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';
import {
  relevanceMisses,
  type StudyFile,
} from '../../src/lib/studies/studies.ts';

const MIN_HIT_RATE = 0.9;

describe('study relevance', () => {
  for (const part of BODY_PARTS) {
    const file = JSON.parse(
      readFileSync(path.resolve(`src/data/studies/${part.slug}.json`), 'utf8'),
    ) as StudyFile;

    for (const category of part.categories) {
      it(`${part.slug}/${category.id}: at least 90% of titles match mustMatch`, () => {
        const studies = file.categories[category.id] ?? [];
        expect(studies.length, 'no stored studies').toBeGreaterThan(0);
        const misses = relevanceMisses(studies, category.mustMatch);
        const rate = (studies.length - misses.length) / studies.length;
        const message = [
          `${part.slug}/${category.id}: hit rate ${(rate * 100).toFixed(0)}% (${studies.length - misses.length}/${studies.length}), need ${MIN_HIT_RATE * 100}%`,
          ...misses.slice(0, 10).map((s) => `  missing: ${s.title}`),
          'Tighten the query or widen mustMatch; run pnpm studies:preview.',
        ].join('\n');
        expect(rate, message).toBeGreaterThanOrEqual(MIN_HIT_RATE);
      });
    }
  }
});
