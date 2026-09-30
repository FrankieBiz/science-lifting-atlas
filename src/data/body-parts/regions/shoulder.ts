import type { BodyPart } from '../types.ts';
import { category, REHAB, TRAIN, MECH } from '../shared.ts';

const region: BodyPart = {
  slug: 'shoulder',
  name: 'Shoulder',
  group: 'upper-body',
  status: 'published',
  tagline: 'The most mobile joint in the body, and the one that pays for it.',
  whatItDoes:
    'The shoulder lets the arm move in almost every direction: raising it forward and to the side, reaching behind you, and rotating it in and out. The ball of the upper-arm bone sits in a shallow socket on the shoulder blade, so the joint depends on the rotator cuff muscles and the surrounding ligaments to keep it centred. That trade of mobility for stability is why it shows up so often in pressing and overhead-lifting complaints.',
  keyParts: [
    'Glenohumeral joint (ball and socket)',
    'Scapula (shoulder blade) and clavicle (collarbone)',
    'Rotator cuff: supraspinatus, infraspinatus, teres minor, subscapularis',
    'Deltoid',
    'Labrum, the ring of cartilage that deepens the socket',
  ],
  commonInjuries: [
    {
      name: 'Rotator cuff tendinopathy and tears',
      summary:
        'Pain on lifting the arm, often from overload or age-related wear of the cuff tendons.',
    },
    {
      name: 'Subacromial pain (impingement)',
      summary:
        'Pain at the top and side of the shoulder with overhead movement.',
    },
    {
      name: 'Labral tears (including SLAP)',
      summary:
        'Damage to the cartilage rim, often with clicking, catching, or instability.',
    },
    {
      name: 'Dislocation and instability',
      summary:
        'The ball slips partly or fully out of the socket, usually forwards.',
    },
    {
      name: 'AC joint sprain',
      summary:
        'Injury where the collarbone meets the top of the shoulder blade.',
    },
  ],
  plate: { view: 'front', x: 42, y: 23.5, zoom: 2.3 },
  hotspots: [{ view: 'front', x: 42, y: 23.5 }],
  categories: [
    category(
      'injuries',
      'Rotator cuff, impingement, labrum, and instability.',
      '"rotator cuff"[ti] OR (impingement[ti] AND shoulder[ti]) OR "SLAP lesion*"[ti] OR "superior labr*"[ti] OR (shoulder[ti] AND (dislocation[ti] OR instability[ti])) OR "subacromial pain"[ti]',
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press/i,
    ),
    category(
      'rehab',
      'Exercise therapy, rehabilitation, and treatment trials.',
      `(shoulder pain[ti] OR "rotator cuff"[ti] OR "subacromial"[ti] OR "shoulder instability"[ti]) AND ${REHAB}`,
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press/i,
    ),
    category(
      'training',
      'Resistance training, muscle activation, and performance.',
      `(shoulder[ti] OR deltoid[ti] OR "rotator cuff"[ti] OR "overhead press"[ti] OR "lateral raise"[ti]) AND ${TRAIN}`,
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press/i,
    ),
    category(
      'mechanics',
      'How the joint is built and how it moves.',
      `(shoulder[ti] OR glenohumeral[ti] OR scapula*[ti]) AND ${MECH}`,
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press/i,
    ),
  ],
};

export default region;
