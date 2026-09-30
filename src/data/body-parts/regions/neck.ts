import type { BodyPart } from '../types.ts';
import { category, REHAB, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'neck',
  name: 'Neck',
  group: 'upper-body',
  status: 'published',
  tagline: 'Seven vertebrae holding up your head.',
  whatItDoes:
    'The neck, or cervical spine, supports the head and lets it nod, turn, and tilt. It protects the spinal cord and the nerves that run to the shoulders and arms. Deep neck muscles steady the vertebrae, while larger muscles such as the upper trapezius connect the neck to the shoulder blades. Together, they help stabilize the head and upper body during lifts that load the shoulders and arms.',
  keyParts: [
    'Seven cervical vertebrae (C1–C7) and their discs',
    'Deep neck flexors and extensors',
    'Upper trapezius and levator scapulae',
    'Cervical nerve roots supplying the arms',
  ],
  commonInjuries: [
    {
      name: 'Non-specific neck pain',
      summary: 'Pain or stiffness without one clear structural cause.',
    },
    {
      name: 'Pinched neck nerve (cervical radiculopathy)',
      summary:
        'Pressure or irritation at a neck nerve root can cause pain, tingling, numbness, or weakness that travels into the arm.',
    },
    {
      name: 'Whiplash (whiplash-associated disorder)',
      summary:
        'A quick back-and-forth or sideways movement of the head can strain neck tissues and lead to pain and stiffness.',
    },
    {
      name: 'Muscle strain',
      summary:
        'An overstretched neck muscle can cause sudden pain and tenderness after a quick movement or heavy effort.',
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
      '("neck muscle"[ti] OR "cervical muscle"[ti] OR "neck strength"[ti] OR "neck strengthening"[ti] OR "upper trapezius"[ti]) AND (training[ti] OR exercise[ti] OR strengthening[ti] OR strength[ti]) NOT femor*[ti] NOT radiotherap*[ti] NOT cancer*[ti] NOT oncol*[ti]',
      /neck|cervical|whiplash|trapezius|radiculopathy/i,
    ),
    category(
      'mechanics',
      'How the cervical spine is built and how it moves.',
      `("cervical spine"[ti] OR "cervical vertebrae"[ti] OR "cervical kinematics"[ti]) AND ${MECH}`,
      /neck|cervical|whiplash|trapezius|radiculopathy/i,
    ),
  ],
};

export default region;
