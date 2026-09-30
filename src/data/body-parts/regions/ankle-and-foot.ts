import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'ankle-and-foot',
  name: 'Ankle and foot',
  group: 'lower-body',
  status: 'published',
  tagline: 'Your contact with the ground.',
  whatItDoes:
    'The ankle points the foot up and down, and the joints just below it roll the foot in and out. The foot absorbs landing forces and then acts as a stiff lever to push off. The calf muscles attach to the heel through the Achilles tendon, one of the largest tendons in the body. In lifting, the feet are the contact point for squats, deadlifts, and jumps, so this region shapes how force reaches the floor.',
  keyParts: [
    'Tibia, fibula, and talus (the ankle joint)',
    'Calcaneus (heel bone) and the subtalar joint',
    'Achilles tendon and calf muscles (gastrocnemius and soleus)',
    'Lateral ankle ligaments',
    'Plantar fascia along the sole',
  ],
  commonInjuries: [
    {
      name: 'Rolled ankle (lateral ankle sprain)',
      summary:
        'Stretching or tearing of the ligaments on the outer ankle after the foot turns inward. It is very common and can leave the ankle feeling unstable.',
    },
    {
      name: 'Achilles tendon pain (Achilles tendinopathy)',
      summary:
        'Pain and stiffness in the tendon above the heel, often worst in the morning or at the start of activity.',
    },
    {
      name: 'Achilles tendon rupture',
      summary:
        'A sudden tear, often felt as a kick to the back of the leg during a push-off.',
    },
    {
      name: 'Heel pain (plantar fasciitis)',
      summary:
        'Pain under the heel, typically with the first steps of the day.',
    },
    {
      name: 'Forefoot stress fracture (metatarsal stress fracture)',
      summary:
        'A small crack in one of the long bones of the forefoot from repeated loading, causing pain that builds with activity.',
    },
  ],
  plate: { view: 'front', x: 46.6, y: 87.5, zoom: 2.4 },
  hotspots: [{ view: 'front', x: 46.6, y: 87.5 }],
  categories: [
    category(
      'injuries',
      'Sprains, Achilles problems, and heel pain.',
      '"ankle sprain"[ti] OR "achilles tendinopathy"[ti] OR "achilles tendon rupture"[ti] OR "plantar fasciitis"[ti] OR "plantar heel pain"[ti] OR "ankle instability"[ti] OR ("stress fracture*"[ti] AND (metatarsal[ti] OR foot[ti]))',
      /ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("ankle sprain"[ti] OR achilles[ti] OR "plantar fasciitis"[ti] OR "plantar heel pain"[ti] OR "ankle instability"[ti]) AND ${REHAB}`,
      /ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar/i,
    ),
    category(
      'training',
      'Ankle, foot, and balance training research.',
      `(ankle[ti] OR foot[ti] OR "intrinsic foot"[ti] OR toe[ti]) AND (${TRAIN} OR "balance training"[tiab] OR "proprioceptive training"[tiab]) NOT stroke[ti] NOT acupuncture[ti] NOT ultrasound[ti] NOT arthroplasty[ti] NOT "foot drop"[ti] NOT amput*[ti] NOT prosthe*[ti] NOT diabet*[ti]`,
      /ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar/i,
    ),
    category(
      'mechanics',
      'How the ankle and foot are built and how they move.',
      `(ankle[ti] OR foot[ti] OR achilles[ti]) AND ${MECH} NOT arthroplasty[ti] NOT amput*[ti] NOT prosthe*[ti] NOT nerve*[ti] NOT surgical[ti] NOT knee[ti] NOT patellofemoral[ti] NOT tibiofemoral[ti] NOT children[ti]`,
      /ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar/i,
    ),
  ],
};

export default region;
