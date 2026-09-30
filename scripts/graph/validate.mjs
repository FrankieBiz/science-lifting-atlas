import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  canonicalJson,
  compilePublicEvidenceGraph,
  GraphCompilationError,
} from '../../src/lib/graph/compiler.ts';
import { partitionRecords } from '../../src/lib/content/registry.ts';
import { validateAsOfDate } from '../../src/lib/content/validation.ts';
import { loadAndValidateRecords, printIssues } from '../content/validate.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const asOf = process.env.SBLA_AS_OF ?? new Date().toISOString().slice(0, 10);
const asOfIssues = validateAsOfDate(asOf);

if (asOfIssues.length > 0) {
  printIssues('Graph validation', asOfIssues);
  process.exitCode = 1;
} else {
  const loaded = await loadAndValidateRecords(repositoryRoot);
  if (loaded.issues.length > 0) {
    printIssues('Graph validation', loaded.issues);
    process.exitCode = 1;
  } else {
    try {
      const graph = compilePublicEvidenceGraph(
        partitionRecords(loaded.records),
        {
          asOf,
        },
      );
      const expected = canonicalJson(graph);
      const outputPath = path.join(
        repositoryRoot,
        'public/data/evidence-graph.v1.json',
      );
      let actual;
      try {
        actual = await readFile(outputPath, 'utf8');
      } catch {
        actual = null;
      }
      if (actual === null && graph.nodes.length === 0) {
        console.log(
          'Graph validation passed: 0 nodes checked; deterministic output is optional for the truthful empty state.',
        );
      } else if (actual !== expected) {
        printIssues('Graph validation', [
          {
            code: 'GRAPH_OUTPUT_STALE',
            path: 'public/data/evidence-graph.v1.json',
            message:
              'The committed graph is missing or differs from validated records.',
            remediation:
              'Run pnpm graph:compile and commit the deterministic output.',
          },
        ]);
        process.exitCode = 1;
      } else {
        console.log(
          `Graph validation passed: ${graph.nodes.length} nodes and ${graph.edges.length} edges match deterministic output.`,
        );
      }
    } catch (error) {
      if (error instanceof GraphCompilationError) {
        printIssues('Graph validation', error.issues);
        process.exitCode = 1;
      } else {
        throw error;
      }
    }
  }
}
