import type { BodyPart } from '../types.ts';
import { category, REHAB, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'neck',
  name: 'Neck',
  group: 'upper-body',
  status: 'published',
  tagline: 'Seven vertebrae holding up your head.',
  whatItDoes:
    'The neck, or cervical spine, supports the head and lets it nod, turn, and tilt. It also protects the spinal cord and the nerves that run to the shoulders and arms. Deep neck muscles hold the vertebrae steady, while larger muscles such as the upper trapezius link the neck to the shoulder blade.',
  keyParts: [
    'Seven cervical vertebrae (C1–C7) and their discs',
    'Deep neck flexors and extensors',
    'Upper trapezius and levator scapulae',
    'Cervical nerve roots supplying the arms',
  ],
  commonInjuries: [
    {
      name: 'Non-specific neck pain',
      summary:
        'The most common type: pain and stiffness without a single identifiable structural cause.',
    },
    {
      name: 'Cervical radiculopathy',
      summary:
        'A pinched nerve root causing pain, tingling, or weakness down the arm.',
    },
    {
      name: 'Whiplash-associated disorders',
      summary:
        'Neck pain after a sudden acceleration-deceleration injury, such as a car collision.',
    },
    {
      name: 'Muscle strain',
      summary: 'Acute pain after an awkward movement or sudden load.',
    },
  ],
  safetyNote:
    'Get urgent care for neck pain after a fall or impact, or when it comes with numbness, weakness, loss of coordination, or a severe headache.',
  plate: { view: 'front', x: 50, y: 17.5, zoom: 2.4 },
  hotspots: [{ view: 'front', x: 50, y: 17.5 }],
  categories: [
    category(
      'injuries',
      'Neck pain, radiculopathy, and whiplash.',
      '"neck pain"[ti] OR "cervical radiculopathy"[ti] OR whiplash[ti] OR (neck[ti] AND strain[ti])',
      /neck|cervical|whiplash|trapezius|radiculopathy/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("neck pain"[ti] OR "cervical radiculopathy"[ti] OR whiplash[ti]) AND ${REHAB}`,
      /neck|cervical|whiplash|trapezius|radiculopathy/i,
    ),
    category(
      'training',
      'Neck and upper-trapezius strength training.',
      '(neck[ti] OR cervical[ti] OR "upper trapezius"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR strengthening[tiab])',
      /neck|cervical|whiplash|trapezius|radiculopathy/i,
    ),
    category(
      'mechanics',
      'How the cervical spine is built and how it moves.',
      `("cervical spine"[ti] OR neck[ti]) AND ${MECH}`,
      /neck|cervical|whiplash|trapezius|radiculopathy/i,
    ),
  ],
};

export default region;
