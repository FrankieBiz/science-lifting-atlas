import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';
import {
  cleanTitle,
  dateParts,
  formatAuthors,
  parsePubmedDate,
  publishedDate,
  pubmedSearchUrl,
  relevanceMisses,
  sortNewestFirst,
  studyKind,
  studyType,
  toStudy,
  type Study,
  type StudyFile,
} from '../../src/lib/studies/studies';

const study = (pmid: string, date: string): Study => ({
  pmid,
  title: `Study ${pmid}`,
  authors: 'A',
  journal: 'J',
  date,
  displayDate: date,
  type: null,
  doi: null,
  url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
});

describe('parsePubmedDate', () => {
  it.each([
    ['2026 Sep 12', '2026-09-12'],
    ['2026 Sep 3', '2026-09-03'],
    ['2026 Sep', '2026-09-01'],
    ['2026', '2026-01-01'],
    ['2026 Jul-Aug', '2026-07-01'],
    ['2026 Spring', '2026-01-01'],
  ])('%s → %s', (input, expected) => {
    expect(parsePubmedDate(input)).toBe(expected);
  });

  it('returns null for empty or malformed dates', () => {
    expect(parsePubmedDate('')).toBeNull();
    expect(parsePubmedDate(undefined)).toBeNull();
    expect(parsePubmedDate('Sep 2026')).toBeNull();
  });
});

describe('publishedDate', () => {
  it('prefers the online date when the issue date is later', () => {
    expect(
      publishedDate({ pubdate: '2026 Dec', epubdate: '2026 Aug 1' }),
    ).toEqual({ date: '2026-08-01', displayDate: '2026 Aug 1' });
  });

  it('keeps the issue date when there is no earlier online date', () => {
    expect(publishedDate({ pubdate: '2025 Mar 4', epubdate: '' })).toEqual({
      date: '2025-03-04',
      displayDate: '2025 Mar 4',
    });
  });
});

describe('study formatting', () => {
  it('labels the most specific publication type', () => {
    expect(studyType(['Journal Article', 'Review', 'Systematic Review'])).toBe(
      'Systematic review',
    );
    expect(studyType(['Journal Article'])).toBeNull();
  });

  it('shortens long author lists', () => {
    expect(formatAuthors([{ name: 'A' }, { name: 'B' }])).toBe('A, B');
    expect(
      formatAuthors([
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
      ]),
    ).toBe('A, B, C, et al.');
    expect(formatAuthors([])).toBe('Unknown authors');
  });

  it('strips markup from titles', () => {
    expect(cleanTitle('<i>In vivo</i> loading &amp; strain ')).toBe(
      'In vivo loading & strain',
    );
  });

  it('builds a linked study from an esummary record', () => {
    expect(
      toStudy({
        uid: '123',
        title: 'Elbow study.',
        source: 'J Elbow',
        pubdate: '2026 Sep',
        authors: [{ name: 'Smith J' }],
        articleids: [{ idtype: 'doi', value: '10.1/x' }],
        pubtype: ['Randomized Controlled Trial'],
      }),
    ).toEqual({
      pmid: '123',
      title: 'Elbow study.',
      authors: 'Smith J',
      journal: 'J Elbow',
      date: '2026-09-01',
      displayDate: '2026 Sep',
      type: 'Randomized trial',
      doi: '10.1/x',
      url: 'https://pubmed.ncbi.nlm.nih.gov/123/',
    });
    expect(toStudy({ uid: '1', title: '' })).toBeNull();
  });
});

describe('sortNewestFirst', () => {
  it('orders by date, newest first, then by PMID', () => {
    const sorted = sortNewestFirst([
      study('1', '2024-01-01'),
      study('3', '2026-05-01'),
      study('2', '2026-05-01'),
      study('4', '2025-12-31'),
    ]);
    expect(sorted.map((s) => s.pmid)).toEqual(['3', '2', '4', '1']);
  });
});

describe('body-part directory', () => {
  const dataDir = path.resolve('src/data/studies');

  it('has unique slugs and category ids', () => {
    const slugs = BODY_PARTS.map((part) => part.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const part of BODY_PARTS) {
      const ids = part.categories.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(part.commonInjuries.length).toBeGreaterThan(0);
    }
  });

  it('has a fetched, newest-first study file for every body part', () => {
    const files = new Set(readdirSync(dataDir));
    for (const part of BODY_PARTS) {
      expect(files.has(`${part.slug}.json`)).toBe(true);
      const file = JSON.parse(
        readFileSync(path.join(dataDir, `${part.slug}.json`), 'utf8'),
      ) as StudyFile;
      for (const category of part.categories) {
        const studies = file.categories[category.id] ?? [];
        expect(studies.length).toBeGreaterThan(0);
        expect(studies).toEqual(sortNewestFirst(studies));
      }
    }
  });
});

describe('dateParts', () => {
  it('keeps only the precision PubMed gave', () => {
    expect(
      dateParts({ date: '2026-09-03', displayDate: '2026 Sep 3' }),
    ).toEqual({ year: '2026', month: 'Sep', day: '3' });
    expect(dateParts({ date: '2026-09-01', displayDate: '2026 Sep' })).toEqual({
      year: '2026',
      month: 'Sep',
      day: null,
    });
    expect(dateParts({ date: '2026-01-01', displayDate: '2026' })).toEqual({
      year: '2026',
      month: null,
      day: null,
    });
  });
});

describe('body-part plates', () => {
  it('places every region inside the poster', () => {
    for (const part of BODY_PARTS) {
      expect(part.plate.x).toBeGreaterThan(0);
      expect(part.plate.x).toBeLessThan(100);
      expect(part.plate.y).toBeGreaterThan(0);
      expect(part.plate.y).toBeLessThan(100);
    }
  });
});

describe('studyKind', () => {
  it.each([
    ['Meta-analysis', 'review'],
    ['Systematic review', 'review'],
    ['Review', 'review'],
    ['Guideline', 'review'],
    ['Randomized trial', 'trial'],
    ['Clinical trial', 'trial'],
    ['Trial protocol', 'other'],
    ['Case report', 'other'],
    [null, 'other'],
  ] as const)('%s → %s', (type, kind) => {
    expect(studyKind(type)).toBe(kind);
  });
});

describe('pubmedSearchUrl', () => {
  it('encodes the term and sorts by date', () => {
    expect(pubmedSearchUrl('"tennis elbow"[ti] AND humans[mh]')).toBe(
      'https://pubmed.ncbi.nlm.nih.gov/?term=%22tennis%20elbow%22%5Bti%5D%20AND%20humans%5Bmh%5D&sort=date',
    );
  });
});

describe('relevanceMisses', () => {
  it('returns the studies whose title does not match', () => {
    const on = { ...study('1', '2026-01-01'), title: 'Elbow tendinopathy' };
    const off = { ...study('2', '2026-01-01'), title: 'Kidney outcomes' };
    expect(relevanceMisses([on, off], /elbow/i)).toEqual([off]);
    expect(relevanceMisses([], /elbow/i)).toEqual([]);
  });
});
