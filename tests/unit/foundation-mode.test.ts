import { describe, expect, it } from 'vitest';

import { findUnexpectedRecordFiles } from '../../scripts/foundation/foundation-mode.mjs';

describe('foundation-mode record guard', () => {
  it('ignores tracked markers and reports real record files', () => {
    expect(
      findUnexpectedRecordFiles([
        'content/claims/.gitkeep',
        'content/claims/README.md',
        'content/claims/claim-test.yaml',
        'content/sources/source-test.yml',
      ]),
    ).toEqual([
      'content/claims/claim-test.yaml',
      'content/sources/source-test.yml',
    ]);
  });
});
