import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { learningChecks } from '../../src/lib/presentation/learning-checks';

describe('learning check evidence integrity', () => {
  it('uses existing reviewable claims and exact feedback rather than invented explanations', () => {
    expect(Object.keys(learningChecks)).toHaveLength(4);
    for (const [id, check] of Object.entries(learningChecks)) {
      const claim = JSON.parse(
        readFileSync(`content/claims/${id}.json`, 'utf8'),
      );
      expect(claim.reviewState).toBe('approved');
      expect(check.answer).toBeGreaterThanOrEqual(0);
      expect(check.answer).toBeLessThan(check.options.length);
      expect(new Set(check.options).size).toBe(check.options.length);
      const feedback =
        check.qualifier === undefined
          ? claim.plainLanguage
          : claim.qualifiers[check.qualifier];
      expect(typeof feedback).toBe('string');
      expect(feedback.length).toBeGreaterThan(20);
      expect(claim.sourceLinks.length).toBeGreaterThan(0);
    }
  });
});
