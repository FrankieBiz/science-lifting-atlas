import type { BodyPart } from '../types.ts';
import { category, MECH, REHAB } from '../shared.ts';

const region: BodyPart = {
  slug: 'lower-leg',
  name: 'Lower leg',
  group: 'lower-body',
  status: 'published',
  tagline: 'Calf and shin, the springs you run on.',
  whatItDoes:
    'The calf muscles point the foot down and push you off the ground. The shin muscles lift the foot and control it as it lands. Between them, the tibia carries body weight to the ankle, with the thinner fibula alongside it. In lifting and running, this region absorbs landing forces and helps pass power from the legs into the floor.',
  keyParts: [
    'Tibia and fibula',
    'Gastrocnemius and soleus (calf)',
    'Tibialis anterior (shin)',
    'Fibular (peroneal) muscles',
    'Interosseous membrane',
  ],
  commonInjuries: [
    {
      name: 'Calf strain (tennis leg)',
      summary:
        'A pulled calf muscle, often the inner gastrocnemius, felt as sudden pain in the back of the lower leg during push-off.',
    },
    {
      name: 'Shin splints (medial tibial stress syndrome)',
      summary:
        'Aching pain along the inner edge of the shin that builds with running or jumping and eases with rest.',
    },
    {
      name: 'Tibial stress fracture',
      summary:
        'A small crack in the shin bone from repeated loading, causing focused pain that worsens with activity.',
    },
    {
      name: 'Chronic exertional compartment syndrome',
      summary:
        'Tight, aching pain in the lower leg during exercise that eases with rest.',
    },
  ],
  plate: { view: 'front', x: 47, y: 79.5, zoom: 2.3 },
  hotspots: [
    { view: 'front', x: 47, y: 79.5 },
    { view: 'back', x: 47, y: 75 },
  ],
  categories: [
    category(
      'injuries',
      'Calf strains, shin splints, stress fractures, and compartment syndrome.',
      '"calf strain"[ti] OR "calf muscle injur*"[ti] OR (gastrocnemius[ti] AND (strain*[ti] OR tear*[ti] OR injur*[ti])) OR "medial tibial stress"[ti] OR "shin splints"[ti] OR "tibial stress fracture"[ti] OR ("compartment syndrome"[ti] AND exertional[ti]) NOT supraspinatus[ti] NOT forearm[ti] NOT cruciate[ti] NOT recession[ti] NOT nerve[ti]',
      /calf|tibia|shin|gastrocnem|soleus|triceps surae|plantar flex|compartment|lower leg|fibul/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("calf strain"[ti] OR "calf muscle injur*"[ti] OR (calf[ti] AND (strain*[ti] OR injur*[ti] OR tear*[ti])) OR "medial tibial stress"[ti] OR "shin splints"[ti] OR "tibial stress fracture"[ti] OR "exertional compartment"[ti]) AND ${REHAB} NOT forearm[ti] NOT thrombosis[ti] NOT orthos*[ti] NOT supraspinatus[ti]`,
      /calf|tibia|shin|gastrocnem|soleus|triceps surae|plantar flex|compartment|lower leg|fibul/i,
    ),
    category(
      'training',
      'Calf and shin muscle training research.',
      '(calf[ti] OR "triceps surae"[ti] OR "plantar flexor*"[ti] OR gastrocnemius[ti] OR soleus[ti] OR "tibialis anterior"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR "calf raise*"[tiab] OR strengthening[tiab]) NOT stroke[ti] NOT hemipar*[ti] NOT gait[ti] NOT arterial[ti] NOT "machine learning"[ti] NOT thrombosis[ti] NOT sarcopeni*[ti] NOT hypothyroid*[ti] NOT "intellectual disabilit*"[ti] NOT botulinum*[ti] NOT nursing[ti] NOT avulsion[ti] NOT myopathy[ti] NOT "muscle mass"[ti]',
      /calf|tibia|shin|gastrocnem|soleus|triceps surae|plantar flex|compartment|lower leg|fibul/i,
    ),
    category(
      'mechanics',
      'How the calf, shin, and tibia are built and loaded.',
      `("lower leg"[ti] OR calf[ti] OR "triceps surae"[ti] OR gastrocnemius[ti] OR soleus[ti] OR "tibialis anterior"[ti] OR "tibial loading"[ti] OR "tibial stress"[ti] OR "tibial strain"[ti] OR "tibial bone"[ti]) AND (${MECH} OR stiffness[ti]) NOT fractur*[ti] NOT plate*[ti] NOT implant*[ti] NOT arthroplasty[ti] NOT nail*[ti] NOT screw*[ti] NOT orthos*[ti] NOT nerve*[ti] NOT flap*[ti]`,
      /calf|tibia|shin|gastrocnem|soleus|triceps surae|plantar flex|compartment|lower leg|fibul/i,
    ),
  ],
};

export default region;
