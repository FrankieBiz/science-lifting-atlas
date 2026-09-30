import type { BodyPart } from '../types.ts';
import { category, REHAB } from '../shared.ts';

const region: BodyPart = {
  slug: 'lower-back',
  name: 'Lower back',
  group: 'trunk',
  status: 'published',
  tagline: 'Where most lifting worries end up.',
  whatItDoes:
    'The lower back, or lumbar spine, carries the weight of the upper body and transfers force between the trunk and the legs. It bends forward and back, side to side, and rotates a little. The spinal erectors, multifidus, and the abdominal wall work together to keep it stiff when you squat, deadlift, or carry heavy loads.',
  keyParts: [
    'Five lumbar vertebrae (L1–L5) and their discs',
    'Sacrum and sacroiliac joints',
    'Erector spinae and multifidus',
    'Abdominal wall and quadratus lumborum',
    'Lumbar nerve roots, including those forming the sciatic nerve',
  ],
  commonInjuries: [
    {
      name: 'Non-specific low back pain',
      summary:
        'By far the most common type: pain without a single identifiable structural cause. Most episodes settle within weeks.',
    },
    {
      name: 'Disc herniation and sciatica',
      summary:
        'Disc material irritates a nerve root, causing leg pain, sometimes with numbness or weakness.',
    },
    {
      name: 'Muscle strain',
      summary: 'Acute pain after lifting or an awkward movement.',
    },
    {
      name: 'Spondylolysis',
      summary:
        'A stress fracture of part of a vertebra, seen more often in young athletes who repeatedly extend the spine.',
    },
  ],
  safetyNote:
    'Get urgent care for back pain with numbness around the groin or buttocks, new bladder or bowel problems, leg weakness that is getting worse, fever, or after a significant fall or impact.',
  plate: { view: 'front', x: 50, y: 43, zoom: 2 },
  hotspots: [{ view: 'front', x: 50, y: 43 }],
  categories: [
    category(
      'injuries',
      'Low back pain, disc problems, and sciatica.',
      '"low back pain"[ti] OR "lumbar disc herniation"[ti] OR sciatica[ti] OR spondylolysis[ti] OR (lumbar[ti] AND strain[ti])',
      /low back|lumbar|sciatica|spondyl|disc|deadlift|back extensor|trunk|spine|spinal|lifting|back pain/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("low back pain"[ti] OR sciatica[ti] OR "lumbar disc"[ti]) AND ${REHAB}`,
      /low back|lumbar|sciatica|spondyl|disc|deadlift|back extensor|trunk|spine|spinal|lifting|back pain/i,
    ),
    category(
      'training',
      'Lifting, trunk training, and resistance exercise.',
      '("low back"[ti] OR lumbar[ti] OR deadlift*[ti] OR "trunk muscle*"[ti] OR "back extensor*"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "weight lifting"[tiab] OR weightlifting[tiab] OR powerlifting[tiab])',
      /low back|lumbar|sciatica|spondyl|disc|deadlift|back extensor|trunk|spine|spinal|lifting|back pain/i,
    ),
    category(
      'mechanics',
      'Spinal loading and movement.',
      '("lumbar spine"[ti] OR lumbar[ti] OR spine[ti] OR spinal[ti]) AND (lifting[ti] OR deadlift*[ti] OR squat*[ti] OR (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti]))',
      /low back|lumbar|sciatica|spondyl|disc|deadlift|back extensor|trunk|spine|spinal|lifting|back pain/i,
    ),
  ],
};

export default region;
