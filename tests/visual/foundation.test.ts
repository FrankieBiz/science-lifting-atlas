import { describe, expect, it } from 'vitest';

import { FOUNDATION_VIEWPORTS } from '../../src/lib/foundation/gates';

describe('foundation visual contract', () => {
  it('defines deterministic desktop and mobile viewports with unique IDs', () => {
    const ids = FOUNDATION_VIEWPORTS.map((viewport) => viewport.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(FOUNDATION_VIEWPORTS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'desktop', width: 1440, height: 1000 }),
        expect.objectContaining({ id: 'mobile', width: 390, height: 844 }),
      ]),
    );
  });
});
