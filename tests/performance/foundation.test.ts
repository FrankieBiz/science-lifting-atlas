import { describe, expect, it } from 'vitest';

import { FOUNDATION_PERFORMANCE_BUDGETS } from '../../src/lib/foundation/gates';

describe('foundation performance contract', () => {
  it('represents the initial transfer budgets with unique IDs', () => {
    const ids = FOUNDATION_PERFORMANCE_BUDGETS.map((budget) => budget.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(FOUNDATION_PERFORMANCE_BUDGETS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'static-non-3d-javascript',
          unit: 'gzip-kb',
          target: 100,
          hardLimit: 160,
        }),
        expect.objectContaining({
          id: 'desktop-initial-3d',
          unit: 'mb',
          target: 6,
          hardLimit: 10,
        }),
      ]),
    );
  });
});
