import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'hip-and-groin',
  name: 'Hip and groin',
  group: 'lower-body',
  status: 'published',
  tagline: 'The ball-and-socket that drives squats and deadlifts.',
  whatItDoes:
    'The hip connects the leg to the pelvis. It bends and extends the thigh, moves it in and out, and rotates it. Unlike the shoulder, it sits in a deep socket, so it is very stable and carries large loads. The glutes, hamstrings, and hip flexors that cross it are among the strongest muscles in the body.',
  keyParts: [
    'Femoral head (ball) and acetabulum (socket)',
    'Labrum, the cartilage ring around the socket',
    'Gluteus maximus, medius, and minimus',
    'Hip flexors, including iliopsoas and rectus femoris',
    'Adductors on the inner thigh',
  ],
  commonInjuries: [
    {
      name: 'Femoroacetabular impingement (FAI)',
      summary:
        'Extra bone on the ball or socket that pinches in deep flexion, often felt in the groin.',
    },
    {
      name: 'Labral tear',
      summary: 'Damage to the socket rim, sometimes with clicking or catching.',
    },
    {
      name: 'Gluteal tendinopathy',
      summary:
        'Pain on the outside of the hip, often worse lying on that side.',
    },
    {
      name: 'Adductor and hip-flexor strains',
      summary:
        'Groin injuries common in kicking, sprinting, and change-of-direction sports.',
    },
    {
      name: 'Hip osteoarthritis',
      summary:
        'Gradual wear of the joint cartilage, causing pain and stiffness.',
    },
  ],
  plate: { view: 'front', x: 45.5, y: 46.9, zoom: 2.1 },
  hotspots: [{ view: 'front', x: 45.5, y: 46.9 }],
  categories: [
    category(
      'injuries',
      'Impingement, labrum, tendon, and groin injuries.',
      '"femoroacetabular impingement"[ti] OR "hip labral"[ti] OR "gluteal tendinopathy"[ti] OR "greater trochanteric pain"[ti] OR "groin pain"[ti] OR "adductor strain"[ti] OR (hip[ti] AND injur*[ti])',
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("hip pain"[ti] OR "hip osteoarthritis"[ti] OR "femoroacetabular impingement"[ti] OR "gluteal tendinopathy"[ti] OR "groin pain"[ti]) AND ${REHAB}`,
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
    category(
      'training',
      'Glute and hip-muscle training research.',
      `(glute*[ti] OR "hip extens*"[ti] OR "hip abduct*"[ti] OR "hip thrust"[ti]) AND ${TRAIN}`,
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
    category(
      'mechanics',
      'How the hip is built and how it moves.',
      `hip[ti] AND ${MECH}`,
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
  ],
};

export default region;
