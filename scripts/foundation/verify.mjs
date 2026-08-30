import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  REQUIRED_PATHS,
  REQUIRED_WORKFLOW_SNIPPETS,
  validateFoundation,
} from './contract.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const packageJson = JSON.parse(
  await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
);
const existingPaths = new Set();
const fileContents = new Map();

await Promise.all(
  REQUIRED_PATHS.map(async (path) => {
    try {
      await access(new URL(`../../${path}`, import.meta.url));
      existingPaths.add(path);
    } catch {
      // The pure validator reports every missing path together.
    }
  }),
);

await Promise.all(
  Object.keys(REQUIRED_WORKFLOW_SNIPPETS).map(async (path) => {
    try {
      const content = await readFile(
        new URL(`../../${path}`, import.meta.url),
        'utf8',
      );
      fileContents.set(path, content);
    } catch {
      // Missing workflow paths and content are reported by the pure validator.
    }
  }),
);

const issues = validateFoundation({
  packageJson,
  existingPaths,
  fileContents,
});

if (issues.length > 0) {
  console.error('Foundation contract failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`Foundation contract passed at ${repositoryRoot}`);
}
