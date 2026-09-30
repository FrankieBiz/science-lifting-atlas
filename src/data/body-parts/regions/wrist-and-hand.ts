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
      name: 'Carpal tunnel syndrome',
      summary:
        'Compression of the median nerve, causing numbness and tingling in the thumb and first fingers.',
    },
    {
      name: 'De Quervain tenosynovitis',
      summary: 'Painful thumb-side tendons, worse with gripping and pinching.',
    },
    {
      name: 'TFCC injury',
      summary:
        'Pain on the little-finger side of the wrist, often with rotation or weight bearing.',
    },
    {
      name: 'Wrist sprain and scaphoid fracture',
      summary:
        'Usually from falling on an outstretched hand. Scaphoid fractures are easily missed.',
    },
  ],
  plate: { view: 'front', x: 39.3, y: 49.6, zoom: 2.6 },
  hotspots: [{ view: 'front', x: 60.7, y: 49.6 }],
  categories: [
    category(
      'injuries',
      'Nerve compression, tendon, and ligament injuries.',
      '"carpal tunnel"[ti] OR "de quervain"[ti] OR "triangular fibrocartilage"[ti] OR TFCC[ti] OR (wrist[ti] AND (sprain[ti] OR injur*[ti] OR pain[ti])) OR "scaphoid fracture"[ti]',
      /wrist|hand|carpal|finger|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
    category(
      'rehab',
      'Exercise therapy and treatment trials.',
      `("carpal tunnel"[ti] OR "de quervain"[ti] OR wrist[ti] OR "hand pain"[ti]) AND ${REHAB}`,
      /wrist|hand|carpal|finger|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
    category(
      'training',
      'Grip strength and forearm training.',
      '("grip strength"[ti] OR "handgrip"[ti] OR forearm[ti] OR wrist[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "grip training"[tiab])',
      /wrist|hand|carpal|finger|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
    category(
      'mechanics',
      'How the wrist and hand are built and how they move.',
      `(wrist[ti] OR hand[ti] OR finger*[ti]) AND ${MECH}`,
      /wrist|hand|carpal|finger|thumb|grip|forearm|de quervain|TFCC|triangular fibrocartilage|scaphoid/i,
    ),
  ],
};

export default region;
