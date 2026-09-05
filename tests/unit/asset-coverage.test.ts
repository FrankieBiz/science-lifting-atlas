import { describe, expect, it } from 'vitest';

import {
  COVERAGE_TARGETS,
  evaluateCoverage,
} from '../../scripts/assets/coverage.mjs';

describe('BodyParts3D coverage observation', () => {
  it('pins the explicit master-plan evaluation set to 28 unique targets', () => {
    expect(COVERAGE_TARGETS).toHaveLength(28);
    expect(new Set(COVERAGE_TARGETS.map((target) => target.id)).size).toBe(28);
    expect(COVERAGE_TARGETS.map((target) => target.id)).toEqual([
      'pectoralis-major',
      'deltoid-regions',
      'latissimus-dorsi',
      'teres-major',
      'trapezius-regions',
      'rhomboids',
      'rotator-cuff',
      'biceps-brachii',
      'brachialis',
      'brachioradialis',
      'triceps-brachii',
      'forearm-flexors-extensors',
      'rectus-abdominis',
      'external-oblique',
      'internal-oblique',
      'transversus-abdominis',
      'spinal-erectors',
      'multifidus',
      'gluteus-maximus',
      'gluteus-medius',
      'gluteus-minimus',
      'quadriceps',
      'hamstrings',
      'hip-adductors',
      'major-hip-flexors',
      'gastrocnemius-heads',
      'soleus',
      'tibialis-anterior',
    ]);
  });

  it('recognises spinal erectors from their three named component columns', () => {
    const result = evaluateCoverage(
      [
        'FMA1\tiliocostalis lumborum\tFJ1',
        'FMA2\tlongissimus thoracis\tFJ2',
        'FMA3\tspinalis thoracis\tFJ3',
      ].join('\n'),
    );
    expect(result.byId['spinal-erectors']).toMatchObject({ present: true });
  });

  it('requires every component group for compound targets', () => {
    const incomplete = evaluateCoverage(
      'biceps femoris\nsemitendinosus\nrectus femoris\nvastus lateralis',
    );
    expect(incomplete.byId.hamstrings!.present).toBe(false);
    expect(incomplete.byId.quadriceps!.present).toBe(false);

    const complete = evaluateCoverage(
      [
        'biceps femoris',
        'semitendinosus',
        'semimembranosus',
        'rectus femoris',
        'vastus lateralis',
        'vastus medialis',
        'vastus intermedius',
      ].join('\n'),
    );
    expect(complete.byId.hamstrings!.present).toBe(true);
    expect(complete.byId.quadriceps!.present).toBe(true);
  });

  it('does not confuse thoracic transversus with transversus abdominis', () => {
    const result = evaluateCoverage(
      'transversus thoracis\nexternal oblique\nsuperficial postvertebral muscle',
    );
    expect(result.byId['transversus-abdominis']!.present).toBe(false);
    expect(result.byId['external-oblique']!.present).toBe(true);
  });

  it('is deterministic and returns its absent target ids', () => {
    const text = 'pectoralis major\nexternal oblique';
    const first = evaluateCoverage(text);
    const second = evaluateCoverage(text);
    expect(first).toEqual(second);
    expect(first.present + first.absent).toBe(28);
    expect(first.absentIds).toContain('latissimus-dorsi');
  });
});
