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

  it('requires all named deltoid, trapezius, and triceps components', () => {
    const bareParents = evaluateCoverage('deltoid\ntrapezius\ntriceps brachii');
    expect(bareParents.byId['deltoid-regions']!.present).toBe(false);
    expect(bareParents.byId['trapezius-regions']!.present).toBe(false);
    expect(bareParents.byId['triceps-brachii']!.present).toBe(false);

    const compoundTargets = [
      {
        id: 'deltoid-regions',
        components: ['anterior deltoid', 'middle deltoid', 'posterior deltoid'],
      },
      {
        id: 'trapezius-regions',
        components: [
          'ascending trapezius',
          'descending trapezius',
          'transverse trapezius',
        ],
      },
      {
        id: 'triceps-brachii',
        components: [
          'long head of triceps brachii',
          'lateral head of triceps brachii',
          'medial head of triceps brachii',
        ],
      },
    ] as const;

    for (const { id, components } of compoundTargets) {
      expect(evaluateCoverage(components.join('\n')).byId[id]!.present).toBe(
        true,
      );
      components.forEach((_, omittedIndex) => {
        const incomplete = components.filter(
          (__, componentIndex) => componentIndex !== omittedIndex,
        );
        expect(evaluateCoverage(incomplete.join('\n')).byId[id]!.present).toBe(
          false,
        );
      });
    }
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
