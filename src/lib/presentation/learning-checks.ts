/** Local-review teaching prompts. Scientific feedback comes only from canonical records. */
export interface LearningCheck {
  question: string;
  options: readonly string[];
  answer: number;
  /** Exact qualifier index, or the claim's plainLanguage when omitted. */
  qualifier?: number;
}
export const learningChecks: Readonly<Record<string, LearningCheck>> = {
  'claim-pectoralis-major-attachments': {
    question:
      'According to this record, which bone receives the narrow attachment?',
    options: ['Upper arm bone', 'Forearm bone'],
    answer: 0,
  },
  'claim-pectoralis-major-adduction': {
    question: 'What does the moment arm describe in this evidence?',
    options: ['Muscle activation', 'Mechanical leverage', 'Muscle force'],
    answer: 1,
    qualifier: 0,
  },
  'claim-pectoralis-major-surface-emg-limitation': {
    question:
      'Does a measurement from skin electrodes represent the whole chest muscle here?',
    options: ['Yes', 'No'],
    answer: 1,
  },
  'claim-bench-press-pectoralis-rupture': {
    question: 'Can these case reports establish an injury rate?',
    options: ['Yes', 'No'],
    answer: 1,
    qualifier: 0,
  },
};
