import type { CategoryId, RegionGroup, StudyCategory } from './types.ts';

export const HUMAN_ENGLISH = 'AND humans[mh] AND english[la] AND hasabstract';
export const REHAB =
  '(exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])';
export const TRAIN =
  '("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])';
export const MECH =
  '(biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])';
export const CATEGORY_LABELS: Record<CategoryId, string> = {
  injuries: 'Injuries',
  rehab: 'Rehab and treatment',
  training: 'Training and strength',
  mechanics: 'Anatomy and biomechanics',
};
export const GROUPS: { id: RegionGroup; label: string }[] = [
  { id: 'upper-body', label: 'Upper body' },
  { id: 'trunk', label: 'Trunk' },
  { id: 'lower-body', label: 'Lower body' },
];
export const REGION_ORDER = [
  'neck',
  'shoulder',
  'chest',
  'upper-back',
  'elbow',
  'wrist-and-hand',
  'abdomen-and-core',
  'lower-back',
  'hip-and-groin',
  'thigh',
  'knee',
  'lower-leg',
  'ankle-and-foot',
] as const;
/** Regions whose page must show a safetyNote. */
export const SAFETY_NOTE_REQUIRED = [
  'neck',
  'chest',
  'abdomen-and-core',
  'lower-back',
];

export function category(
  id: CategoryId,
  blurb: string,
  topic: string,
  mustMatch: RegExp,
): StudyCategory {
  return {
    id,
    label: CATEGORY_LABELS[id],
    blurb,
    query: `(${topic}) ${HUMAN_ENGLISH}`,
    mustMatch,
  };
}
