import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findUnexpectedRecordFiles } from '../foundation/foundation-mode.mjs';
import { listRelativeFiles } from '../foundation/scan-records.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const filePaths = await listRelativeFiles(
  path.join(repositoryRoot, 'content'),
  repositoryRoot,
);
const unexpectedFiles = findUnexpectedRecordFiles(filePaths);

if (unexpectedFiles.length > 0) {
  console.error(
    'Graph validation is in foundation mode and cannot compile records:',
  );
  for (const filePath of unexpectedFiles) console.error(`- ${filePath}`);
  process.exitCode = 1;
} else {
  console.log('Graph validation: foundation mode; 0 nodes and 0 edges.');
}
