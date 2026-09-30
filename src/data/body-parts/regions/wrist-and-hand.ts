import type { BodyPart } from '../types.ts';
import { category, REHAB, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'wrist-and-hand',
  name: 'Wrist and hand',
  group: 'upper-body',
  status: 'published',
  tagline: 'Grip strength starts here.',
  whatItDoes:
    'The wrist bends, extends, and tilts the hand side to side, while the fingers and thumb produce grip. Most of the muscles that power your grip actually sit in the forearm and reach the fingers through long tendons, which pass through tight spaces such as the carpal tunnel. In lifting, the wrist has to stay stable under load in presses, holds, and pulls.',
  keyParts: [
    'Radius and ulna (forearm bones)',
    'Eight carpal bones, including the scaphoid',
    'Forearm flexor and extensor muscles',
    'Triangular fibrocartilage complex (TFCC) on the little-finger side',
    'Carpal tunnel and the median nerve',
  ],
  commonInjuries: [
    {
      name: 'Nerve squeeze at the wrist (carpal tunnel syndrome)',
      summary:
        'Compression of the median nerve, causing numbness and tingling in the thumb and first fingers.',
    },
    {
      name: 'Thumb-side wrist pain (De Quervain tenosynovitis)',
      summary: 'Painful thumb-side tendons, worse with gripping and pinching.',
    },
    {
      name: 'Little-finger-side wrist pain (TFCC injury)',
      summary:
        'Pain on the little-finger side of the wrist, often with rotation or weight bearing.',
    },
    {
      name: 'Wrist sprain and scaphoid fracture',
      summary:
        'Usually from falling on an outstretched hand. Scaphoid fractures are easily missed.',
    },
    {
      name: 'Catching finger (trigger finger)',
      summary:
        'A finger that catches or locks when bent, from irritation of the tendon where it passes under a band in the palm.',
    },
  ],
  plate: { view: 'front', x: 39.3, y: 49.6, zoom: 2.6 },
  hotspots: [{ view: 'front', x: 60.7, y: 49.6 }],
  categories: [
    category(
      'injuries',
      'Nerve compression, tendon, and ligament injuries.',
      '"carpal tunnel"[ti] OR "de quervain"[ti] OR "triangular fibrocartilage"[ti] OR TFCC[ti] OR (wrist[ti] AND (sprain[ti] OR injur*[ti] OR pain[ti])) OR "scaphoid fracture"[ti] OR "trigger finger"[ti] NOT "machine learning"[ti] NOT "deep learning"[ti] NOT "artificial intelligence"[ti] NOT amyloidosis[ti] NOT hemodialysis[ti] NOT prosthe*[ti] NOT periprosthetic[ti] NOT fusion[ti] NOT arthroplasty[ti] NOT "nerve transfer"[ti] NOT surgical[ti] NOT "wait times"[ti] NOT "regional variations"[ti] NOT stroke[ti]',
      /wrist|hand|carpal|finger(?!print)|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("carpal tunnel"[ti] OR "de quervain"[ti] OR wrist[ti] OR "hand pain"[ti]) AND ${REHAB} NOT "machine learning"[ti] NOT "deep learning"[ti] NOT "artificial intelligence"[ti] NOT amyloidosis[ti] NOT hemodialysis[ti] NOT prosthe*[ti] NOT periprosthetic[ti] NOT fusion[ti] NOT arthroplasty[ti] NOT "nerve transfer"[ti] NOT stroke[ti] NOT spasticity[ti] NOT "neural common drive"[ti] NOT "blood pressure"[ti] NOT "cardiac"[ti] NOT fracture*[ti] NOT smartwatch[ti] NOT walking[ti] NOT "Glucagon-Like"[ti] NOT "GLP-1"[ti] NOT "step counting"[ti]`,
      /wrist|hand|carpal|finger(?!print)|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
    category(
      'training',
      'Grip strength and forearm training.',
      '("grip strength"[ti] OR handgrip[ti] OR "hand grip"[ti] OR forearm[ti] OR "finger flexor*"[ti] OR "wrist extensor*"[ti] OR "wrist flexor*"[ti] OR "finger strength"[ti] OR "grip training"[ti] OR climber*[ti]) AND (training[ti] OR exercis*[ti] OR strengthening[ti] OR "blood flow restriction"[ti] OR "resistance"[ti] OR hypertrophy[ti]) NOT mortality[ti] NOT cognitive[ti] NOT osteopor*[ti] NOT "blood pressure"[ti] NOT hypertension[ti] NOT edema[ti] NOT stroke[ti] NOT "older adults"[ti] NOT "intraocular"[ti] NOT "methylation"[ti] NOT respiratory[ti] NOT atherosclerosis[ti] NOT fall*[ti] NOT hemodynamic*[ti] NOT ventricular[ti] NOT sleep[ti] NOT insulin[ti] NOT "body composition"[ti] NOT cardiac[ti] NOT congenital[ti] NOT rheumatoid[ti] NOT "red blood cell"[ti] NOT "virtual reality"[ti] NOT vein[ti] NOT cardiopulmonary[ti] NOT children[ti] NOT "blood flow responses"[ti] NOT "brachial blood flow"[ti] NOT phosphodiesterase*[ti] NOT sympathetic[ti] NOT arterial[ti] NOT vagus[ti] NOT muscarinic[ti] NOT adrenergic[ti] NOT myocardial[ti] NOT nitrate[ti] NOT cardiovascular[ti] NOT circulatory[ti] NOT "blood pressure"[ti] NOT "bone mineral"[ti] NOT "protein intake"[ti] NOT vasoconstrict*[ti] NOT "muscle sympathetic"[ti] NOT "total peripheral"[ti]',
      /wrist|hand|carpal|finger(?!print)|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
    category(
      'mechanics',
      'How the wrist and hand are built and how they move.',
      `(wrist[ti] OR hand[ti] OR finger*[ti]) AND ${MECH} NOT "machine learning"[ti] NOT "deep learning"[ti] NOT "artificial intelligence"[ti] NOT amyloidosis[ti] NOT hemodialysis[ti] NOT prosthe*[ti] NOT periprosthetic[ti] NOT fusion[ti] NOT arthroplasty[ti] NOT "nerve transfer"[ti] NOT surgical[ti] NOT "e-skin"[ti] NOT forensic[ti] NOT "kinetic fingerprint*"[ti] NOT "food matrix"[ti] NOT plate*[ti] NOT "external fixation"[ti] NOT transfer*[ti] NOT nerve*[ti] NOT shoulder[ti] NOT classification[ti] NOT "surgical skill"[ti] NOT imaging[ti] NOT implant*[ti] NOT EEG[ti] NOT autistic[ti] NOT toddler*[ti] NOT pediatric[ti] NOT dataset[ti] NOT decoding[ti] NOT tactile[ti] NOT Auslan[ti] NOT "hand-to-mouth"[ti] NOT AI-based[ti] NOT neurotization[ti] NOT brachialis[ti]`,
      /wrist|hand|carpal|finger(?!print)|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
  ],
};

export default region;
