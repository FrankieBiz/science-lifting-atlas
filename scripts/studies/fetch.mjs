// Pull the newest PubMed studies for every published body-part category and
// write them to src/data/studies/<slug>.json. Run with `pnpm studies:fetch`,
// then commit. `pnpm studies:fetch elbow knee` refreshes only those regions.
// Set NCBI_API_KEY for a faster request rate.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';
import { createPubmedClient } from '../../src/lib/studies/pubmed.ts';

const PER_CATEGORY = 50;
// Over-fetch so de-duplication against earlier categories still fills the list.
const SEARCH_DEPTH = 100;
const MIN_PER_CATEGORY = 10;
const OUT_DIR = path.resolve('src/data/studies');

const client = createPubmedClient();

/**
 * @param {string} slug
 * @returns {Promise<Set<string>>} PMIDs in the region's previous file
 */
async function previousPmids(slug) {
  try {
    const file = JSON.parse(
      await readFile(path.join(OUT_DIR, `${slug}.json`), 'utf8'),
    );
    return new Set(
      Object.values(file.categories ?? {})
        .flat()
        .map((/** @type {any} */ study) => study.pmid),
    );
  } catch {
    return new Set();
  }
}

/**
 * @param {import('../../src/data/body-parts/index.ts').BodyPart} part
 * @returns {Promise<{ file: import('../../src/lib/studies/studies.ts').StudyFile, problems: string[], summary: string }>}
 */
async function fetchPart(part) {
  const before = await previousPmids(part.slug);
  /** @type {Set<string>} */
  const seen = new Set();
  const categories = /** @type {any} */ ({});
  const totals = /** @type {any} */ ({});
  const queries = /** @type {any} */ ({});
  /** @type {string[]} */
  const problems = [];
  /** @type {string[]} */
  const parts = [];
  // Order matters: a study keeps the first category it appears in.
  for (const category of part.categories) {
    const { ids, count } = await client.search(category.query, SEARCH_DEPTH);
    const fresh = ids.filter((id) => !seen.has(id)).slice(0, PER_CATEGORY);
    fresh.forEach((id) => seen.add(id));
    const studies = await client.summarize(fresh);
    categories[category.id] = studies;
    totals[category.id] = count;
    queries[category.id] = category.query;
    const added = studies.filter((study) => !before.has(study.pmid)).length;
    parts.push(`${category.id} ${studies.length} (+${added} new)`);
    if (studies.length < MIN_PER_CATEGORY) {
      problems.push(
        `${part.slug}/${category.id}: only ${studies.length} studies (need ${MIN_PER_CATEGORY}); query returned ${count} matches`,
      );
    }
  }
  return {
    file: {
      slug: part.slug,
      fetchedAt: new Date().toISOString().slice(0, 10),
      categories,
      totals,
      queries,
    },
    problems,
    summary: `${part.slug}: ${parts.join(', ')}`,
  };
}

const requested = process.argv.slice(2);
const unknown = requested.filter(
  (slug) => !BODY_PARTS.some((part) => part.slug === slug),
);
if (unknown.length > 0) {
  console.error(`Not a published region: ${unknown.join(', ')}`);
  process.exit(1);
}
const only = new Set(requested);
const parts = BODY_PARTS.filter(
  (part) => only.size === 0 || only.has(part.slug),
);

await mkdir(OUT_DIR, { recursive: true });
let failed = false;
for (const part of parts) {
  const { file, problems, summary } = await fetchPart(part);
  if (problems.length > 0) {
    failed = true;
    for (const problem of problems) console.error(`ERROR ${problem}`);
    console.error(`${part.slug}: file NOT written`);
    continue;
  }
  await writeFile(
    path.join(OUT_DIR, `${part.slug}.json`),
    `${JSON.stringify(file, null, 2)}\n`,
  );
  console.log(summary);
}
if (failed) process.exit(1);
