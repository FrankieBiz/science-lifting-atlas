import { describe, expect, it } from 'vitest';

import { FOUNDATION_PAGE_CONTRACT } from '../../src/lib/foundation/gates';

describe('foundation accessibility contract', () => {
  it('declares the document language and WCAG target', () => {
    expect(FOUNDATION_PAGE_CONTRACT).toMatchObject({
      documentLanguage: 'en',
      wcagTarget: '2.2 AA',
      supportsNoJavaScript: true,
    });
  });
});
