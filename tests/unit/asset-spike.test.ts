import { describe, expect, it } from 'vitest';

import {
  LICENSE_CLARITY_FLOOR,
  REQUIRED_LICENSE_FIELDS,
  SPIKE_CRITERIA,
  evaluateCandidate,
  validateLicenseFields,
} from '../../scripts/assets/scorecard.mjs';

function fullyScored() {
  return Object.fromEntries(SPIKE_CRITERIA.map((c) => [c.key, 4])) as Record<
    string,
    number | null
  >;
}

function licensedCandidate(license = {}) {
  return {
    id: 'test',
    name: 'Test candidate',
    license: {
      name: 'CC BY-SA 4.0',
      version: '4.0',
      source: 'https://example.invalid/license',
      accessedOn: '2026-08-30',
      commercialUse: 'permitted',
      shareAlike: 'required',
      modification: 'permitted',
      attributionRequired: true,
      webDistribution: 'permitted',
      ...license,
    },
    scores: fullyScored(),
  };
}

describe('asset spike scorecard', () => {
  it('uses the master plan section 8.3 criteria and weights summing to 100', () => {
    const total = SPIKE_CRITERIA.reduce((sum, c) => sum + c.weight, 0);
    expect(total).toBe(100);
    expect(SPIKE_CRITERIA.map((c) => c.key)).toEqual([
      'coverage_naming',
      'mesh_separability',
      'visual_quality',
      'browser_performance',
      'license_clarity',
      'pipeline_ease',
      'presentation_options',
    ]);
  });

  it('reports every missing licence field rather than the first', () => {
    const issues = validateLicenseFields({ id: 'x', license: {} });
    for (const field of REQUIRED_LICENSE_FIELDS) {
      expect(issues).toContain(`x: missing licence field: ${field}`);
    }
  });

  it('accepts a complete licence record', () => {
    expect(validateLicenseFields(licensedCandidate())).toEqual([]);
  });

  it('rejects a candidate whose licence clarity is below the floor, whatever its total', () => {
    const candidate = licensedCandidate();
    candidate.scores = {
      ...fullyScored(),
      license_clarity: LICENSE_CLARITY_FLOOR - 1,
    };
    for (const key of [
      'coverage_naming',
      'mesh_separability',
      'visual_quality',
    ]) {
      candidate.scores[key] = 5;
    }

    const result = evaluateCandidate(candidate);
    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toContain('licence clarity');
  });

  it('refuses to total a candidate with unmeasured criteria instead of guessing', () => {
    const candidate = licensedCandidate();
    candidate.scores = { ...fullyScored(), browser_performance: null };

    const result = evaluateCandidate(candidate);
    expect(result.complete).toBe(false);
    expect(result.weightedTotal).toBeNull();
    expect(result.unmeasured).toContain('browser_performance');
  });

  it('computes a weighted total only when every criterion is measured', () => {
    const candidate = licensedCandidate();
    candidate.scores = Object.fromEntries(
      SPIKE_CRITERIA.map((c) => [c.key, 5]),
    );

    const result = evaluateCandidate(candidate);
    expect(result.complete).toBe(true);
    expect(result.weightedTotal).toBe(100);
  });

  it('is deterministic: identical input yields identical output', () => {
    const a = evaluateCandidate(licensedCandidate());
    const b = evaluateCandidate(licensedCandidate());
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('rejects an out-of-range score rather than clamping it', () => {
    const candidate = licensedCandidate();
    candidate.scores = { ...fullyScored(), visual_quality: 9 };
    expect(() => evaluateCandidate(candidate)).toThrow(/visual_quality/);
  });
});
