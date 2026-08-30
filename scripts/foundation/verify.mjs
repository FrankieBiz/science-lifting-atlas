import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  REQUIRED_PATHS,
  REQUIRED_WORKFLOW_SNIPPETS,
  validateFoundation,
} from './contract.mjs';
import {
  REQUIRED_DOC_SNIPPETS,
  REQUIRED_OPERATING_PATHS,
  validateOperatingModel,
} from './operating-model.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const packageJson = JSON.parse(
  await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
);
const existingPaths = new Set();
const fileContents = new Map();
const operatingPaths = new Set();
const operatingContents = new Map();

/**
 * @param {readonly string[]} paths
 * @param {Set<string>} into
 */
async function collectExistingPaths(paths, into) {
  await Promise.all(
    paths.map(async (path) => {
      try {
        await access(new URL(`../../${path}`, import.meta.url));
        into.add(path);
      } catch {
        // The pure validators report every missing path together.
      }
    }),
  );
}

/**
 * @param {readonly string[]} paths
 * @param {Map<string, string>} into
 */
async function collectFileContents(paths, into) {
  await Promise.all(
    paths.map(async (path) => {
      try {
        into.set(
          path,
          await readFile(new URL(`../../${path}`, import.meta.url), 'utf8'),
        );
      } catch {
        // Missing paths and content are reported by the pure validators.
      }
    }),
  );
}

await collectExistingPaths(REQUIRED_PATHS, existingPaths);
await collectExistingPaths(REQUIRED_OPERATING_PATHS, operatingPaths);
await collectFileContents(
  Object.keys(REQUIRED_WORKFLOW_SNIPPETS),
  fileContents,
);
await collectFileContents(
  [
    ...new Set([
      ...REQUIRED_OPERATING_PATHS,
      ...Object.keys(REQUIRED_DOC_SNIPPETS),
    ]),
  ],
  operatingContents,
);

const issues = [
  ...validateFoundation({ packageJson, existingPaths, fileContents }),
  ...validateOperatingModel({
    existingPaths: operatingPaths,
    fileContents: operatingContents,
  }),
];

if (issues.length > 0) {
  console.error('Foundation contract failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`Foundation contract passed at ${repositoryRoot}`);
}
