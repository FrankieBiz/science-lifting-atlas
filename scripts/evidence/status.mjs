import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findUnexpectedRecordFiles } from '../foundation/foundation-mode.mjs';
import { listRelativeFiles } from '../foundation/scan-records.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const filePaths = await listRelativeFiles(
  path.join(repositoryRoot, 'content/sources'),
  repositoryRoot,
);
const unexpectedFiles = findUnexpectedRecordFiles(filePaths);

if (unexpectedFiles.length > 0) {
  console.error(
    'Evidence status is in foundation mode and cannot verify source records:',
  );
  for (const filePath of unexpectedFiles) console.error(`- ${filePath}`);
  process.exitCode = 1;
} else {
  console.log('Evidence status: foundation mode; 0 sources checked.');
}
