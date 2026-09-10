import { fileURLToPath } from 'node:url';

import { validateSourceStatus } from '../../src/lib/content/validation.ts';
import { loadAndValidateRecords, printIssues } from '../content/validate.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const asOf = process.env.SBLA_AS_OF ?? new Date().toISOString().slice(0, 10);
const loaded = await loadAndValidateRecords(repositoryRoot);
const sources = loaded.records
  .filter((record) => record.kind === 'source')
  .map((record) => record.data);
const issues = [
  ...loaded.issues,
  ...sources.flatMap((source) => validateSourceStatus(source, { asOf })),
];

if (issues.length > 0) {
  printIssues('Evidence status', issues);
  process.exitCode = 1;
} else {
  console.log(
    `Evidence status passed: ${sources.length} sources checked as of ${asOf}; live network acquisition remains a later task.`,
  );
}
