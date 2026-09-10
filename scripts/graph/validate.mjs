import { fileURLToPath } from 'node:url';

import {
  validateAsOfDate,
  validateRecordGraph,
} from '../../src/lib/content/validation.ts';
import { loadAndValidateRecords, printIssues } from '../content/validate.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const asOf = process.env.SBLA_AS_OF ?? new Date().toISOString().slice(0, 10);
const asOfIssues = validateAsOfDate(asOf);

if (asOfIssues.length > 0) {
  printIssues('Graph validation', asOfIssues);
  process.exitCode = 1;
} else {
  const loaded = await loadAndValidateRecords(repositoryRoot);
  const claims = loaded.records
    .filter((record) => record.kind === 'claim')
    .map((record) => record.data);
  const sources = loaded.records
    .filter((record) => record.kind === 'source')
    .map((record) => record.data);
  const entityIds = loaded.records
    .filter((record) => record.kind === 'changeRecord')
    .map((record) => record.data.id);
  const issues = [
    ...loaded.issues,
    ...validateRecordGraph({ claims, sources, entityIds }, { asOf }),
  ];

  if (issues.length > 0) {
    printIssues('Graph validation', issues);
    process.exitCode = 1;
  } else {
    console.log(
      `Graph validation passed: ${claims.length + sources.length + entityIds.length} nodes checked; graph generation remains SBLA-011.`,
    );
  }
}
