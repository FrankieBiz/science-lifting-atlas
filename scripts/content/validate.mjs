import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findUnexpectedRecordFiles } from '../foundation/foundation-mode.mjs';
import { listRelativeFiles } from '../foundation/scan-records.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const roots = ['content', 'content-drafts'];
const filePaths = (
  await Promise.all(
    roots.map((root) =>
      listRelativeFiles(path.join(repositoryRoot, root), repositoryRoot),
    ),
  )
).flat();
const unexpectedFiles = findUnexpectedRecordFiles(filePaths);

if (unexpectedFiles.length > 0) {
  console.error(
    'Content validation is in foundation mode and cannot validate records:',
  );
  for (const filePath of unexpectedFiles) console.error(`- ${filePath}`);
  process.exitCode = 1;
} else {
  console.log('Content validation: foundation mode; 0 records.');
}
