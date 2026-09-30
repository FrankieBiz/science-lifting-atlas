// Pull the newest PubMed studies for every body-part category and write them
// to src/data/studies/<slug>.json. Run with `pnpm studies:fetch`, then commit.
// Optional: `pnpm studies:fetch elbow knee` refreshes only those regions.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { BODY_PARTS } from '../../src/data/body-parts/index.ts';
import { sortNewestFirst, toStudy } from '../../src/lib/studies/studies.ts';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const PER_CATEGORY = 20;
// NCBI allows three requests a second without an API key.
const REQUEST_GAP_MS = 400;
const OUT_DIR = path.resolve('src/data/studies');

/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function getJson(url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await sleep(REQUEST_GAP_MS);
    const response = await fetch(url);
    if (response.ok) return response.json();
    if (attempt === 3) {
      throw new Error(`${response.status} ${response.statusText} for ${url}`);
    }
    await sleep(1000 * attempt);
  }
  throw new Error(`unreachable: ${url}`);
}

/**
 * @param {string} term
 * @param {number} retmax
 * @returns {Promise<string[]>}
 */
async function search(term, retmax) {
  const params = new URLSearchParams({
    db: 'pubmed',
    term,
    retmax: String(retmax),
    sort: 'pub_date',
    retmode: 'json',
  });
  const data = await getJson(`${EUTILS}/esearch.fcgi?${params}`);
  return data.esearchresult?.idlist ?? [];
}

/**
 * @param {string[]} ids
 * @returns {Promise<import('../../src/lib/studies/studies.ts').Study[]>}
 */
async function summarize(ids) {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({
    db: 'pubmed',
    id: ids.join(','),
    retmode: 'json',
  });
  const data = await getJson(`${EUTILS}/esummary.fcgi?${params}`);
  const result = data.result ?? {};
  /** @type {string[]} */
  const uids = result.uids ?? [];
  return uids.flatMap((uid) => toStudy(result[uid]) ?? []);
}

/**
 * @param {import('../../src/data/body-parts/index.ts').BodyPart} part
 * @returns {Promise<import('../../src/lib/studies/studies.ts').StudyFile>}
 */
async function fetchPart(part) {
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {Record<string, import('../../src/lib/studies/studies.ts').Study[]>} */
  const categories = {};
  for (const category of part.categories) {
    // Over-fetch so de-duplication against earlier categories still fills the list.
    const ids = await search(category.query, PER_CATEGORY * 2);
    const fresh = ids.filter((id) => !seen.has(id)).slice(0, PER_CATEGORY);
    fresh.forEach((id) => seen.add(id));
    const studies = sortNewestFirst(await summarize(fresh));
    categories[category.id] = studies;
    console.log(`  ${part.slug}/${category.id}: ${studies.length}`);
  }
  return {
    slug: part.slug,
    fetchedAt: new Date().toISOString().slice(0, 10),
    categories,
  };
}

const only = new Set(process.argv.slice(2));
const parts = BODY_PARTS.filter(
  (part) => only.size === 0 || only.has(part.slug),
);

await mkdir(OUT_DIR, { recursive: true });
for (const part of parts) {
  console.log(part.name);
  const file = await fetchPart(part);
  await writeFile(
    path.join(OUT_DIR, `${part.slug}.json`),
    `${JSON.stringify(file, null, 2)}\n`,
  );
}
