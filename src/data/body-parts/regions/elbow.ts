import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'elbow',
  name: 'Elbow',
  group: 'upper-body',
  status: 'published',
  tagline: 'The hinge between upper arm and forearm.',
  whatItDoes:
    'The elbow bends and straightens the arm and, together with the forearm, turns the palm up and down. It is where three bones meet: the humerus of the upper arm and the ulna and radius of the forearm. Almost every pulling and pressing movement loads it, and the tendons that start at its bony bumps also control your grip and wrist, which is why heavy gripping so often shows up as elbow pain.',
  keyParts: [
    'Humerus, ulna, and radius',
    'Elbow flexors: biceps brachii, brachialis, brachioradialis',
    'Elbow extensor: triceps brachii',
    'Lateral epicondyle (outer bump), where wrist-extensor tendons attach',
    'Medial epicondyle (inner bump), where wrist-flexor tendons attach',
    'Ulnar collateral ligament on the inner side',
    'Ulnar nerve (the "funny bone")',
  ],
  commonInjuries: [
    {
      name: 'Tennis elbow (lateral epicondylopathy)',
      summary:
        'Pain on the outside of the elbow from overloaded wrist-extensor tendons. Gripping, carrying, and wrist extension often aggravate it.',
    },
    {
      name: "Golfer's elbow (medial epicondylopathy)",
      summary:
        'The same problem on the inside of the elbow, affecting the wrist-flexor tendons.',
    },
    {
      name: 'Distal biceps tendon rupture',
      summary:
        'A tear where the biceps attaches below the elbow, usually during a heavy eccentric load. It often needs surgical assessment.',
    },
    {
      name: 'Ulnar collateral ligament injury',
      summary:
        'Sprain or tear of the inner ligament, most often in throwing athletes.',
    },
    {
      name: 'Triceps tendinopathy',
      summary:
        'Pain at the back of the elbow, often from high-volume pressing and extension work.',
    },
    {
      name: 'Cubital tunnel syndrome',
      summary:
        'Irritation of the ulnar nerve, causing tingling in the ring and little fingers.',
    },
  ],
  plate: { view: 'front', x: 40.8, y: 37.2, zoom: 2.6 },
  hotspots: [{ view: 'front', x: 40.8, y: 37.2 }],
  categories: [
    category(
      'injuries',
      'Tennis and golfer’s elbow, tendon ruptures, and ligament injuries.',
      '"tennis elbow"[ti] OR "lateral epicondyl*"[ti] OR "medial epicondyl*"[ti] OR "golfer\'s elbow"[ti] OR "lateral elbow tendinopathy"[ti] OR ("distal biceps"[ti] NOT femoris[ti]) OR ("ulnar collateral ligament"[ti] AND elbow[tiab]) OR "triceps tendon"[ti] OR "cubital tunnel"[ti]',
      /elbow|epicondyl|biceps|triceps|brachialis|ulnar collateral|cubital|arm curl|upper arm/i,
    ),
    category(
      'rehab',
      'Exercise therapy, injections, and other treatment trials.',
      `("tennis elbow"[ti] OR "lateral epicondyl*"[ti] OR "medial epicondyl*"[ti] OR "elbow tendinopathy"[ti] OR ("distal biceps"[ti] NOT femoris[ti])) AND ${REHAB}`,
      /elbow|epicondyl|biceps|triceps|brachialis|ulnar collateral|cubital|arm curl|upper arm/i,
    ),
    category(
      'training',
      'Biceps, triceps, and elbow-flexor training research.',
      `("elbow flexor*"[ti] OR "elbow extensor*"[ti] OR "elbow flexion"[ti] OR "biceps brachii"[ti] OR "triceps brachii"[ti] OR brachialis[ti] OR "arm curl*"[ti] OR "biceps curl*"[ti] OR "upper arm"[ti]) AND ${TRAIN}`,
      /elbow|epicondyl|biceps|triceps|brachialis|ulnar collateral|cubital|arm curl|upper arm/i,
    ),
    category(
      'mechanics',
      'How the joint is built and how it moves.',
      `elbow[ti] AND ${MECH}`,
      /elbow|epicondyl|biceps|triceps|brachialis|ulnar collateral|cubital|arm curl|upper arm/i,
    ),
  ],
};

export default region;
