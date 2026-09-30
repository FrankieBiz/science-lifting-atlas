import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'ankle-and-foot',
  name: 'Ankle and foot',
  group: 'lower-body',
  status: 'published',
  tagline: 'Your contact with the ground.',
  whatItDoes:
    'The ankle points the foot up and down, and the joints just below it roll the foot in and out. The foot absorbs landing forces and then becomes a stiff lever to push off. The calf muscles attach to the heel through the Achilles tendon, the strongest tendon in the body.',
  keyParts: [
    'Tibia, fibula, and talus (the ankle joint)',
    'Calcaneus (heel bone) and the subtalar joint',
    'Achilles tendon and calf muscles (gastrocnemius and soleus)',
    'Lateral ankle ligaments',
    'Plantar fascia along the sole',
  ],
  commonInjuries: [
    {
      name: 'Lateral ankle sprain',
      summary:
        'The classic rolled ankle. Very common, and prone to recurring if not rehabilitated.',
    },
    {
      name: 'Achilles tendinopathy',
      summary:
        'Pain and stiffness in the Achilles, often worst in the morning.',
    },
    {
      name: 'Achilles tendon rupture',
      summary:
        'A sudden tear, often felt as a kick to the back of the leg during a push-off.',
    },
    {
      name: 'Plantar heel pain (plantar fasciitis)',
      summary:
        'Pain under the heel, typically with the first steps of the day.',
    },
  ],
  plate: { view: 'front', x: 46.6, y: 87.5, zoom: 2.4 },
  hotspots: [{ view: 'front', x: 46.6, y: 87.5 }],
  categories: [
    category(
      'injuries',
      'Sprains, Achilles problems, and heel pain.',
      '"ankle sprain"[ti] OR "achilles tendinopathy"[ti] OR "achilles tendon rupture"[ti] OR "plantar fasciitis"[ti] OR "plantar heel pain"[ti] OR "ankle instability"[ti]',
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
      'Calf and ankle strength training.',
      `(calf[ti] OR "triceps surae"[ti] OR "plantar flexor*"[ti] OR gastrocnemius[ti] OR soleus[ti]) AND ${TRAIN}`,
      /ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar|calf|gastrocnem|soleus|triceps surae/i,
    ),
    category(
      'mechanics',
      'How the ankle and foot are built and how they move.',
      `(ankle[ti] OR foot[ti] OR achilles[ti]) AND ${MECH}`,
      /ankle|foot|feet|achilles|plantar|heel|toe|talus|calcane|subtalar/i,
    ),
  ],
};

export default region;
