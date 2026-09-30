import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'knee',
  name: 'Knee',
  group: 'lower-body',
  status: 'published',
  tagline: 'The hinge that takes the load in every squat and landing.',
  whatItDoes:
    'The knee bends and straightens the leg and allows a small amount of rotation when bent. The thigh bone rests on the shin bone, with the kneecap gliding in a groove at the front. Ligaments and two cartilage menisci keep it stable and spread the load, while the quadriceps and hamstrings move and protect it. In lifting, it carries the load through squats, lunges, and leg presses.',
  keyParts: [
    'Femur, tibia, and patella (kneecap)',
    'ACL, PCL, MCL, and LCL ligaments',
    'Medial and lateral menisci',
    'Quadriceps and patellar tendon',
    'Hamstrings',
  ],
  commonInjuries: [
    {
      name: 'Kneecap pain (patellofemoral pain)',
      summary:
        'Pain around or behind the kneecap, often worse with squatting, stairs, or sitting for a long time.',
    },
    {
      name: 'Jumper’s knee (patellar tendinopathy)',
      summary:
        'Pain just below the kneecap with jumping and heavy knee loading.',
    },
    {
      name: 'ACL tear',
      summary:
        'Usually from a pivot or awkward landing, often with a pop and fast swelling.',
    },
    {
      name: 'Meniscus tear',
      summary:
        'Pain and swelling, sometimes with locking or catching of the joint.',
    },
    {
      name: 'Outer knee pain (iliotibial band syndrome)',
      summary:
        'Pain on the outside of the knee, often felt in running or cycling as the knee bends and straightens.',
    },
    {
      name: 'Knee arthritis (osteoarthritis)',
      summary:
        'Gradual wear of the joint cartilage, causing pain and stiffness.',
    },
  ],
  plate: { view: 'front', x: 47.6, y: 69.9, zoom: 2.3 },
  hotspots: [{ view: 'front', x: 47.6, y: 69.9 }],
  categories: [
    category(
      'injuries',
      'Ligament, meniscus, tendon, and kneecap problems.',
      '"anterior cruciate ligament"[ti] OR ACL[ti] OR meniscus[ti] OR meniscal[ti] OR "patellofemoral pain"[ti] OR "patellar tendinopathy"[ti] OR "iliotibial band syndrome"[ti] NOT "deep learning"[ti] NOT chatbot*[ti] NOT "artificial intelligence"[ti] NOT "large language"[ti]',
      /knee|ACL|cruciate|menisc|patell|squat|leg[ -]press|tibiofemoral|iliotibial/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("anterior cruciate ligament"[ti] OR ACL[ti] OR "knee osteoarthritis"[ti] OR "patellofemoral pain"[ti] OR "patellar tendinopathy"[ti] OR meniscal[ti]) AND ${REHAB} NOT "deep learning"[ti] NOT chatbot*[ti] NOT "artificial intelligence"[ti] NOT "large language"[ti] NOT perception*[ti] NOT qualitative[ti]`,
      /knee|ACL|cruciate|menisc|patell|squat|leg[ -]press|tibiofemoral|iliotibial/i,
    ),
    category(
      'training',
      'Squat, leg press, and knee-loading research.',
      `(squat*[ti] OR "knee extens*"[ti] OR "leg press"[ti] OR "patellar tendon"[ti] OR knee[ti]) AND ${TRAIN} NOT "deep learning"[ti] NOT chatbot*[ti] NOT "artificial intelligence"[ti] NOT "large language"[ti] NOT exoskeleton*[ti] NOT implantation[ti] NOT surrogate[ti]`,
      /knee|ACL|cruciate|menisc|patell|squat|leg[ -]press|tibiofemoral|iliotibial/i,
    ),
    category(
      'mechanics',
      'How the knee is built and how it moves.',
      `knee[ti] AND ${MECH} NOT "deep learning"[ti] NOT chatbot*[ti] NOT "artificial intelligence"[ti] NOT "large language"[ti] NOT arthroplasty[ti] NOT replacement[ti] NOT fractur*[ti] NOT popliteal[ti] NOT pin[ti]`,
      /knee|ACL|cruciate|menisc|patell|squat|leg[ -]press|tibiofemoral|iliotibial/i,
    ),
  ],
};

export default region;
