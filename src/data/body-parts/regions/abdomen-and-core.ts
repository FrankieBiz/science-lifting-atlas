import type { BodyPart } from '../types.ts';
import { category, MECH, TRAIN } from '../shared.ts';

const region: BodyPart = {
  slug: 'abdomen-and-core',
  name: 'Abdomen and core',
  group: 'trunk',
  status: 'published',
  tagline: 'The brace behind every big lift.',
  whatItDoes:
    'The abdominal muscles bend and twist the trunk. Together with the diaphragm, pelvic floor, and back muscles, they also stiffen it so force can pass between the legs and arms. The rectus abdominis runs down the front, the obliques wrap the sides, and the transversus abdominis acts like a deep belt. In lifting, this bracing helps keep the spine steady under load.',
  keyParts: [
    'Rectus abdominis',
    'External and internal obliques',
    'Transversus abdominis',
    'Linea alba (the midline seam)',
    'Diaphragm and pelvic floor',
    'Inguinal canal',
  ],
  commonInjuries: [
    {
      name: 'Abdominal or oblique strain (side strain)',
      summary:
        'A pulled muscle in the wall of the abdomen, felt as sharp pain with twisting, coughing, or sudden effort.',
    },
    {
      name: 'Inguinal hernia',
      summary:
        'A bulge in the groin where tissue pushes through the abdominal wall, often noticed when straining, lifting, or coughing.',
    },
    {
      name: 'Umbilical hernia',
      summary:
        'A bulge at or near the belly button where tissue pushes through a weak spot in the abdominal wall.',
    },
    {
      name: 'Diastasis recti',
      summary:
        'A widening of the gap between the two sides of the rectus abdominis, common during and after pregnancy. It may show as a ridge down the middle of the belly.',
    },
  ],
  safetyNote:
    'Get urgent care for sudden severe abdominal pain, a hernia bulge that becomes painful, firm, or cannot be pushed back, or abdominal pain with fever or vomiting.',
  plate: { view: 'front', x: 50, y: 37, zoom: 2.1 },
  hotspots: [{ view: 'front', x: 50, y: 37 }],
  categories: [
    category(
      'injuries',
      'Muscle strains, hernias, and abdominal-wall separation.',
      '("abdominal muscle"[ti] AND (strain*[ti] OR injur*[ti])) OR "oblique strain"[ti] OR "side strain"[ti] OR (("inguinal hernia"[ti] OR "umbilical hernia"[ti]) AND (athlet*[tiab] OR sport*[tiab] OR exercise[tiab] OR lifting[tiab] OR weightlift*[tiab] OR strenuous[tiab])) OR "diastasis recti"[ti] OR "rectus diastasis"[ti] OR "abdominal wall injur*"[ti] NOT mesh[ti] NOT laparoscop*[ti] NOT robot*[ti] NOT "learning curve"[ti] NOT repair[ti] NOT carcinoma[ti]',
      /abdom|\bcore\b|trunk|oblique|rectus|hernia|diastasis|plank|\bbrac(e|ing)\b|intra-abdominal|valsalva/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      '("diastasis recti"[ti] OR "rectus diastasis"[ti] OR ("inguinal hernia"[ti] AND (athlet*[tiab] OR sport*[tiab] OR "return to"[tiab])) OR "abdominal muscle"[ti] OR "core stability"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "return to"[tiab]) NOT stroke[ti] NOT ataxia[ti] NOT temporomandibular[ti] NOT "intensive care"[ti] NOT parkinson*[ti] NOT "cerebral palsy"[ti] NOT youtube[ti] NOT veteran*[ti] NOT mesh[ti] NOT laparoscop*[ti] NOT robot*[ti] NOT "learning curve"[ti] NOT repair[ti] NOT carcinoma[ti]',
      /abdom|\bcore\b|trunk|oblique|rectus|hernia|diastasis|plank|\bbrac(e|ing)\b|intra-abdominal|valsalva/i,
    ),
    category(
      'training',
      'Core stability, plank, and abdominal training research.',
      `("core stability"[ti] OR "core strength"[ti] OR "core training"[ti] OR "core muscle*"[ti] OR "abdominal muscle*"[ti] OR "abdominal exercise*"[ti] OR "abdominal training"[ti] OR "abdominal strength*"[ti] OR "trunk muscle*"[ti] OR plank*[ti] OR "rectus abdominis"[ti] OR oblique*[ti]) AND ${TRAIN} NOT stroke[ti] NOT ataxia[ti] NOT aort*[ti] NOT obes*[ti] NOT endometriosis[ti] NOT "older adults"[ti] NOT laparoscop*[ti] NOT fall*[ti] NOT scoliosis[ti] NOT "timed up"[ti] NOT "timed-up-and-go"[ti] NOT amput*[ti] NOT spondylolysis[ti] NOT cervical[ti] NOT anticipatory[ti]`,
      /abdom|\bcore\b|trunk|oblique|rectus|hernia|diastasis|plank|\bbrac(e|ing)\b|intra-abdominal|valsalva/i,
    ),
    category(
      'mechanics',
      'How the trunk braces and transfers force.',
      `("intra-abdominal pressure"[ti] OR "abdominal muscle*"[ti] OR "trunk muscle*"[ti] OR "abdominal bracing"[ti] OR valsalva[ti] OR "trunk stiffness"[ti]) AND (${MECH} OR electromyograph*[tiab]) NOT stroke[ti] NOT scoliosis[ti] NOT "older adults"[ti] NOT fall*[ti] NOT "sit-to-stand"[ti] NOT "genital hiatus"[ti] NOT amput*[ti] NOT "timed up"[ti] NOT "timed-up-and-go"[ti] NOT epidural[ti] NOT stimulation[ti] NOT anticipatory[ti] NOT urinary[ti] NOT proprioceptive[ti] NOT "spinal cord"[ti]`,
      /abdom|\bcore\b|trunk|oblique|rectus|hernia|diastasis|plank|\bbrac(e|ing)\b|intra-abdominal|valsalva/i,
    ),
  ],
};

export default region;
