import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'hip-and-groin',
  name: 'Hip and groin',
  group: 'lower-body',
  status: 'published',
  tagline: 'The ball-and-socket and groin muscles behind every squat.',
  whatItDoes:
    'The hip connects the leg to the pelvis. It bends and extends the thigh, moves it in and out, and rotates it. Unlike the shoulder, it sits in a deep socket, so it is very stable and carries large loads. The groin is the crease where the thigh meets the trunk, home to the adductor and hip-flexor muscles. Together with the glutes, they help drive squats, deadlifts, and sprints.',
  keyParts: [
    'Femoral head (ball) and acetabulum (socket)',
    'Labrum, the cartilage ring around the socket',
    'Gluteus maximus, medius, and minimus',
    'Hip flexors, including iliopsoas and rectus femoris',
    'Adductors on the inner thigh',
    'Pubic symphysis, where the two pelvic bones meet at the front',
  ],
  commonInjuries: [
    {
      name: 'Hip pinching (femoroacetabular impingement)',
      summary:
        'Extra bone on the ball or socket that pinches in deep flexion, often felt in the groin.',
    },
    {
      name: 'Hip labral tear',
      summary: 'Damage to the socket rim, sometimes with clicking or catching.',
    },
    {
      name: 'Outer hip pain (gluteal tendinopathy)',
      summary:
        'Pain on the outside of the hip, often worse lying on that side.',
    },
    {
      name: 'Groin pain (adductor-related groin pain)',
      summary:
        'Pain in the groin or inner thigh from the adductor muscles and their tendons, common in kicking and change-of-direction sports.',
    },
    {
      name: 'Front-of-hip strain (hip flexor strain)',
      summary:
        'A pulled muscle at the front of the hip, often felt when lifting the knee or sprinting.',
    },
    {
      name: 'Hip arthritis (osteoarthritis)',
      summary:
        'Gradual wear of the joint cartilage, causing pain and stiffness.',
    },
  ],
  plate: { view: 'front', x: 45.5, y: 46.9, zoom: 2.1 },
  hotspots: [
    { view: 'front', x: 45.5, y: 46.9 },
    { view: 'back', x: 47, y: 47.5 },
  ],
  categories: [
    category(
      'injuries',
      'Impingement, labrum, tendon, and groin injuries.',
      '"femoroacetabular impingement"[ti] OR "hip labral"[ti] OR "gluteal tendinopathy"[ti] OR "greater trochanteric pain"[ti] OR "groin pain"[ti] OR "adductor strain"[ti] OR (hip[ti] AND injur*[ti]) OR "athletic pubalgia"[ti] OR "adductor-related"[ti] OR "hip flexor strain"[ti] NOT kidney[ti] NOT "pressure injur*"[ti] NOT fractur*[ti] NOT arthroplasty[ti] NOT hernia[ti]',
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("hip pain"[ti] OR "hip osteoarthritis"[ti] OR "femoroacetabular impingement"[ti] OR "gluteal tendinopathy"[ti] OR "groin pain"[ti]) AND ${REHAB} NOT qualitative[ti] NOT "lived experience*"[ti] NOT perception*[ti] NOT registry[ti] NOT expectations[ti] NOT neurolysis[ti] NOT embolization[ti] NOT hernia[ti] NOT arthroplasty[ti]`,
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
    category(
      'training',
      'Glute and hip-muscle training research.',
      `(gluteus[ti] OR gluteal[ti] OR glutes[ti] OR "hip extens*"[ti] OR "hip abduct*"[ti] OR "hip thrust"[ti]) AND ${TRAIN} NOT robot*[ti] NOT paralysis[ti] NOT "older adults"[ti]`,
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
    category(
      'mechanics',
      'How the hip is built and how it moves.',
      `hip[ti] AND ${MECH} NOT arthroplasty[ti] NOT fractur*[ti] NOT fixation[ti] NOT screw*[ti] NOT plate*[ti] NOT reconstruction[ti] NOT nerve*[ti] NOT stroke[ti] NOT inpatient[ti] NOT "total hip"[ti]`,
      /hip|groin|glute|femoroacetabular|labr|adductor|pubalgia|trochanter|iliopsoas|hip flexor/i,
    ),
  ],
};

export default region;
