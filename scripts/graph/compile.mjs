import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { partitionRecords } from '../../src/lib/content/registry.ts';
import {
  canonicalJson,
  compilePublicEvidenceGraph,
  GraphCompilationError,
} from '../../src/lib/graph/compiler.ts';
import { validateAsOfDate } from '../../src/lib/content/validation.ts';
import { loadAndValidateRecords, printIssues } from '../content/validate.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const outputPath = path.join(
  repositoryRoot,
  'public/data/evidence-graph.v1.json',
);
const asOf = process.env.SBLA_AS_OF ?? new Date().toISOString().slice(0, 10);
const asOfIssues = validateAsOfDate(asOf);

if (asOfIssues.length > 0) {
  printIssues('Graph compilation', asOfIssues);
  process.exitCode = 1;
} else {
  const loaded = await loadAndValidateRecords(repositoryRoot);
  if (loaded.issues.length > 0) {
    printIssues('Graph compilation', loaded.issues);
    process.exitCode = 1;
  } else {
    try {
      const graph = compilePublicEvidenceGraph(
        partitionRecords(loaded.records),
        {
          asOf,
        },
      );
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, canonicalJson(graph), 'utf8');
      console.log(
        `Evidence graph compiled: ${graph.nodes.length} nodes and ${graph.edges.length} edges.`,
      );
    } catch (error) {
      if (error instanceof GraphCompilationError) {
        printIssues('Graph compilation', error.issues);
        process.exitCode = 1;
      } else {
        throw error;
      }
    }
  }
}
