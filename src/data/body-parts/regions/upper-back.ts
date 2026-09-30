import type { BodyPart } from '../types.ts';
import { category, MECH, REHAB, TRAIN } from '../shared.ts';

const region: BodyPart = {
  slug: 'upper-back',
  name: 'Upper back',
  group: 'upper-body',
  status: 'published',
  tagline: 'Where the shoulder blades do their work.',
  whatItDoes:
    'The upper back, or thoracic spine, supports the rib cage and lets the trunk rotate. Muscles here, including the trapezius, rhomboids, and latissimus dorsi, move the shoulder blades and steady them during rows, pull-ups, and overhead work. Because the ribs attach along the spine, this region is stiffer than the neck or lower back and moves with breathing. In lifting, its main job is to give the arms a stable base.',
  keyParts: [
    'Thoracic spine (T1–T12) and ribs',
    'Scapula (shoulder blade)',
    'Trapezius (upper, middle, and lower)',
    'Rhomboids',
    'Latissimus dorsi',
    'Thoracic erector spinae',
  ],
  commonInjuries: [
    {
      name: 'Mid-back pain (thoracic pain)',
      summary:
        'Aching or stiffness between the shoulder blades, often without one clear structural cause.',
    },
    {
      name: 'Trapezius or rhomboid strain',
      summary:
        'Pain in the muscles beside the spine and shoulder blades after a heavy pull, an awkward reach, or repeated load.',
    },
    {
      name: 'Altered shoulder-blade movement (scapular dyskinesis)',
      summary:
        'A change in how the shoulder blade moves, often noticed alongside shoulder symptoms. It describes a movement pattern rather than an injury by itself.',
    },
    {
      name: 'Latissimus dorsi strain',
      summary:
        'A pull or tear of the large back muscle. It is uncommon and seen in throwing and pulling sports, with pain along the side of the back.',
    },
    {
      name: 'Thoracic disc herniation',
      summary:
        'Disc material pressing on nearby structures in the mid-back. It is uncommon compared with the neck and lower back.',
    },
  ],
  plate: { view: 'back', x: 50, y: 30, zoom: 2.1 },
  hotspots: [{ view: 'back', x: 50, y: 30 }],
  categories: [
    category(
      'injuries',
      'Mid-back pain, muscle strains, and shoulder-blade problems.',
      '"thoracic pain"[ti] OR "thoracic spine pain"[ti] OR "mid-back pain"[ti] OR "upper back pain"[ti] OR "scapular dyskinesis"[ti] OR (latissimus[ti] AND (injur*[ti] OR strain*[ti] OR rupture*[ti] OR avulsion*[ti])) OR "thoracic disc herniation"[ti] NOT transfer*[ti] NOT tenotomy[ti] NOT plication[ti] NOT endoscop*[ti] NOT surgical[ti] NOT intraoperative[ti]',
      /thoracic (spine|spinal|pain|disc|kyphosis|vertebra)|scapul|trapezius|rhomboid|latissimus|pull-?up|chin-?up|pulldown|\brow(s|ing)?\b|upper back|mid-back/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("thoracic pain"[ti] OR "thoracic spine pain"[ti] OR "mid-back pain"[ti] OR "upper back pain"[ti] OR "scapular dyskinesis"[ti] OR ("thoracic spine"[ti] AND (mobili*[ti] OR manipulat*[ti] OR exercis*[ti] OR "manual therapy"[ti]))) AND ${REHAB} NOT tumor*[ti] NOT neoplasm*[ti] NOT fistula*[ti] NOT fusion[ti] NOT endoscop*[ti] NOT resection[ti] NOT tenotomy[ti] NOT plication[ti] NOT transfer*[ti] NOT Latarjet[ti] NOT "rotator cuff"[ti] NOT instability[ti] NOT "machine learning"[ti]`,
      /thoracic (spine|spinal|pain|disc|kyphosis|vertebra)|scapul|trapezius|rhomboid|latissimus|pull-?up|chin-?up|pulldown|\brow(s|ing)?\b|upper back|mid-back/i,
    ),
    category(
      'training',
      'Rows, pull-ups, and upper-back muscle training research.',
      `("lat pulldown"[ti] OR "pull-up"[ti] OR "pull up"[ti] OR "chin-up"[ti] OR "bent-over row"[ti] OR "seated row"[ti] OR "inverted row"[ti] OR "barbell row"[ti] OR "scapular retraction"[ti] OR "scapular strengthening"[ti] OR "scapular stabilization"[ti] OR "scapular exercise*"[ti] OR (latissimus[ti] AND (activ*[ti] OR training[ti] OR exercise*[ti])) OR (scapular[ti] AND (exercis*[ti] OR strengthen*[ti] OR training[ti] OR stabiliz*[ti])) OR (trapezius[ti] AND (exercis*[ti] OR strengthen*[ti] OR training[ti] OR activ*[ti])) OR "middle trapezius"[ti] OR "lower trapezius"[ti] OR rhomboid*[ti]) AND ${TRAIN} NOT botulinum*[ti] NOT "trigger point*"[ti] NOT transfer*[ti] NOT winging[ti] NOT arthroscop*[ti] NOT plication[ti] NOT tenotomy[ti]`,
      /thoracic (spine|spinal|pain|disc|kyphosis|vertebra)|scapul|trapezius|rhomboid|latissimus|pull-?up|chin-?up|pulldown|\brow(s|ing)?\b|upper back|mid-back/i,
    ),
    category(
      'mechanics',
      'How the thoracic spine and shoulder blades are built and move.',
      `("thoracic spine"[ti] OR "thoracic kyphosis"[ti] OR "thoracic vertebra*"[ti] OR scapul*[ti] OR "rib cage"[ti]) AND ${MECH} NOT aort*[ti] NOT fractur*[ti] NOT arthroplasty[ti] NOT scoliosis[ti] NOT plate[ti] NOT screw*[ti] NOT pedicle[ti] NOT transfer*[ti] NOT nerve*[ti] NOT intercostal[ti]`,
      /thoracic (spine|spinal|pain|disc|kyphosis|vertebra)|scapul|trapezius|rhomboid|latissimus|pull-?up|chin-?up|pulldown|\brow(s|ing)?\b|upper back|mid-back/i,
    ),
  ],
};

export default region;
