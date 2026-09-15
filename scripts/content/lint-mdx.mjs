import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { lintMdxClaims } from '../../src/lib/content/mdx-lint.ts';
import { listRelativeFiles } from '../foundation/scan-records.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const contentRoot = path.join(repositoryRoot, 'src/content');
const paths = (await listRelativeFiles(contentRoot, repositoryRoot)).filter(
  (relativePath) => path.extname(relativePath).toLowerCase() === '.mdx',
);
const issues = [];

for (const relativePath of paths.sort()) {
  const source = await readFile(
    path.join(repositoryRoot, relativePath),
    'utf8',
  );
  for (const lintIssue of lintMdxClaims(source)) {
    issues.push({ relativePath, ...lintIssue });
  }
}

if (issues.length > 0) {
  console.error('MDX claim lint failed:');
  for (const issue of issues) {
    console.error(
      `- [${issue.code}] ${issue.relativePath}:${issue.line}: ${issue.message}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(
    `MDX claim lint passed: ${paths.length} public MDX files checked.`,
  );
}
