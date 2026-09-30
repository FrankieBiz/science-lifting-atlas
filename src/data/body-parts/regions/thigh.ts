import type { BodyPart } from '../types.ts';
import { category, MECH, REHAB, TRAIN } from '../shared.ts';

const region: BodyPart = {
  slug: 'thigh',
  name: 'Thigh',
  group: 'lower-body',
  status: 'published',
  tagline: 'The biggest muscles you own.',
  whatItDoes:
    "The thigh holds the body's longest bone, the femur, wrapped by the two largest muscle groups in the leg. The quadriceps at the front straighten the knee and help lift the thigh. The hamstrings at the back bend the knee and extend the hip. Together they power running, jumping, squatting, and deadlifting, sharing the load with the hips and glutes.",
  keyParts: [
    'Femur (thigh bone)',
    'Quadriceps: rectus femoris and the three vasti',
    'Hamstrings: biceps femoris, semitendinosus, semimembranosus',
    'Adductors on the inner thigh',
    'Iliotibial band',
  ],
  commonInjuries: [
    {
      name: 'Hamstring strain',
      summary:
        'A pulled muscle at the back of the thigh, common in sprinting and other fast running, causing sudden pain and tenderness.',
    },
    {
      name: 'Quadriceps strain',
      summary:
        'A pulled muscle at the front of the thigh, often the rectus femoris, seen in kicking and sprinting.',
    },
    {
      name: 'Thigh contusion (dead leg)',
      summary:
        'A deep bruise from a direct blow, causing pain, swelling, and stiffness in the muscle.',
    },
    {
      name: 'Proximal hamstring tendon avulsion',
      summary:
        'The tendon pulls off the sitting bone at the top of the hamstring, causing sudden pain and bruising. It needs prompt specialist assessment.',
    },
    {
      name: 'Femoral stress fracture',
      summary:
        'A small crack in the thigh bone from repeated loading, causing deep, persistent pain in the thigh or groin, often in runners.',
    },
  ],
  plate: { view: 'front', x: 46.4, y: 58.5, zoom: 2.0 },
  hotspots: [
    { view: 'front', x: 46.4, y: 58.5 },
    { view: 'back', x: 47, y: 60 },
  ],
  categories: [
    category(
      'injuries',
      'Hamstring and quadriceps strains, bruises, and stress fractures.',
      '(hamstring*[ti] AND (strain*[ti] OR injur*[ti] OR tear*[ti] OR avulsion*[ti])) OR ("quadriceps"[ti] AND (strain*[ti] OR injur*[ti] OR contusion*[ti])) OR "rectus femoris injur*"[ti] OR "thigh contusion"[ti] OR "femoral stress fracture"[ti]',
      /hamstring|quadricep|thigh|femor|vastus|rectus femoris|biceps femoris|nordic|leg (curl|extension)/i,
    ),
    category(
      'rehab',
      'Rehab, injury prevention, and return to sport.',
      `(hamstring*[ti] OR "quadriceps strain"[ti] OR "thigh muscle injur*"[ti]) AND (${REHAB} OR prevention[tiab] OR "return to sport"[tiab]) NOT graft*[ti] NOT "anterior cruciate"[ti] NOT ACL[ti] NOT reconstruction[ti]`,
      /hamstring|quadricep|thigh|femor|vastus|rectus femoris|biceps femoris|nordic|leg (curl|extension)/i,
    ),
    category(
      'training',
      'Hamstring, quadriceps, and thigh-muscle training research.',
      `(quadriceps[ti] OR hamstring*[ti] OR "leg extension"[ti] OR "leg curl"[ti] OR nordic[ti] OR vastus[ti] OR "rectus femoris"[ti] OR "biceps femoris"[ti] OR "thigh muscle*"[ti]) AND ${TRAIN} NOT stroke[ti] NOT gait[ti] NOT device[ti] NOT sensor*[ti] NOT textile[ti] NOT cycling[ti] NOT graft*[ti] NOT "muscle pump"[ti]`,
      /hamstring|quadricep|thigh|femor|vastus|rectus femoris|biceps femoris|nordic|leg (curl|extension)/i,
    ),
    category(
      'mechanics',
      'How the thigh muscles and femur are built and work.',
      `(hamstring*[ti] OR quadriceps[ti] OR "biceps femoris"[ti] OR vastus[ti] OR thigh[ti]) AND (${MECH} OR architecture[ti] OR fascicle*[ti]) NOT fractur*[ti] NOT nail*[ti] NOT plate[ti] NOT fixation[ti] NOT nerve*[ti] NOT block[ti] NOT reconstruction[ti] NOT patellofemoral[ti] NOT "muscle pump"[ti] NOT adipose[ti] NOT "anterior cruciate"[ti] NOT graft*[ti] NOT flap*[ti] NOT crouch[ti]`,
      /hamstring|quadricep|thigh|femor|vastus|rectus femoris|biceps femoris|nordic|leg (curl|extension)/i,
    ),
  ],
};

export default region;
