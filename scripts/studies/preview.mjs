// Try a PubMed query without writing any files.
//   pnpm studies:preview chest injuries          uses the query in the region file
//   pnpm studies:preview --query '<raw topic>'   ad hoc; wraps with HUMAN_ENGLISH
// Add `--match '<regex>'` to check an ad hoc query against a title pattern.
// Prints the total count, the 20 newest studies, and the mustMatch hit rate.

import { ALL_BODY_PARTS } from '../../src/data/body-parts/index.ts';
import { HUMAN_ENGLISH } from '../../src/data/body-parts/shared.ts';
import { createPubmedClient } from '../../src/lib/studies/pubmed.ts';

const SHOWN = 20;

/** @param {string} message */
function usage(message) {
  console.error(message);
  console.error(
    "Usage: pnpm studies:preview <slug> <category>\n       pnpm studies:preview --query '<raw topic>' [--match '<regex>']",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
/** @param {string} flag */
const flagValue = (flag) => {
  const at = args.indexOf(flag);
  if (at === -1) return undefined;
  const value = args[at + 1];
  if (value === undefined) usage(`${flag} needs a value`);
  return value;
};

/** @type {string} */
let term;
/** @type {RegExp | null} */
let mustMatch = null;
const raw = flagValue('--query');
if (raw !== undefined) {
  term = `(${raw}) ${HUMAN_ENGLISH}`;
  const pattern = flagValue('--match');
  if (pattern) mustMatch = new RegExp(pattern, 'i');
} else {
  const [slug, categoryId] = args;
  if (!slug || !categoryId) usage('Give a region slug and a category id.');
  const part = ALL_BODY_PARTS.find((p) => p.slug === slug);
  if (!part) usage(`Unknown region "${slug}".`);
  const category = part?.categories.find((c) => c.id === categoryId);
  if (!category) {
    usage(
      `Region "${slug}" has no category "${categoryId}" (has: ${part?.categories.map((c) => c.id).join(', ') || 'none'}).`,
    );
  }
  term = /** @type {NonNullable<typeof category>} */ (category).query;
  mustMatch = /** @type {NonNullable<typeof category>} */ (category).mustMatch;
}

const client = createPubmedClient();
const { ids, count } = await client.search(term, SHOWN);
const studies = await client.summarize(ids);

console.log(`Query: ${term}`);
console.log(`PubMed matches: ${count.toLocaleString('en-US')}\n`);
let hits = 0;
for (const study of studies) {
  const ok = mustMatch ? mustMatch.test(study.title) : null;
  if (ok) hits += 1;
  const mark = ok === null ? '·' : ok ? '✓' : '✗';
  console.log(
    `${study.date} | ${study.type ?? 'Article'} | ${mark} | ${study.title}`,
  );
}
if (mustMatch) {
  console.log(`\nmustMatch hit rate: ${hits}/${studies.length}`);
}
