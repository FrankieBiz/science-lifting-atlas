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
      name: 'Top-of-shoulder pain (subacromial pain, or impingement)',
      summary:
        'Pain at the top and side of the shoulder with overhead movement.',
    },
    {
      name: 'Shoulder labral tears (including SLAP)',
      summary:
        'Damage to the cartilage rim, often with clicking, catching, or instability.',
    },
    {
      name: 'Shoulder dislocation and instability',
      summary:
        'The ball slips partly or fully out of the socket, usually forwards.',
    },
    {
      name: 'Collarbone-end sprain (AC joint sprain)',
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
      '"rotator cuff"[ti] OR (impingement[ti] AND shoulder[ti]) OR "SLAP lesion*"[ti] OR "superior labr*"[ti] OR (shoulder[ti] AND (dislocation[ti] OR instability[ti])) OR "subacromial pain"[ti] NOT arthroplasty[ti] NOT "Editorial Commentary"[ti] NOT hemiplegic[ti] NOT stroke[ti] NOT "brain injury"[ti] NOT spastic[ti] NOT "Glucagon-Like"[ti] NOT "GLP-1"[ti] NOT opioid[ti] NOT cannabis[ti] NOT tumor*[ti] NOT tumour*[ti] NOT arthrodesis[ti] NOT "artificial intelligence"[ti] NOT "AI-based"[ti] NOT insurance[ti] NOT spin[ti] NOT bioinductive[ti] NOT "tendon-to-bone"[ti]',
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press|scapul|supraspinatus/i,
    ),
    category(
      'rehab',
      'Exercise therapy, rehabilitation, and treatment trials.',
      `("shoulder pain"[ti] OR "rotator cuff"[ti] OR "subacromial"[ti] OR "shoulder instability"[ti]) AND ${REHAB} NOT arthroplasty[ti] NOT "Editorial Commentary"[ti] NOT hemiplegic[ti] NOT stroke[ti] NOT "brain injury"[ti] NOT spastic[ti] NOT "Glucagon-Like"[ti] NOT "GLP-1"[ti] NOT opioid[ti] NOT cannabis[ti] NOT tumor*[ti] NOT tumour*[ti] NOT arthrodesis[ti] NOT "artificial intelligence"[ti] NOT "AI-based"[ti] NOT "Rehabilitation Experiences"[ti] NOT "Support Needs"[ti] NOT regeneration[ti] NOT laser[ti] NOT "physical agent"[ti]`,
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press|scapul|supraspinatus/i,
    ),
    category(
      'training',
      'Resistance training, muscle activation, and performance.',
      `(shoulder[ti] OR deltoid[ti] OR "rotator cuff"[ti] OR "overhead press"[ti] OR "lateral raise"[ti]) AND ${TRAIN} NOT arthroplasty[ti] NOT "Editorial Commentary"[ti] NOT hemiplegic[ti] NOT stroke[ti] NOT "brain injury"[ti] NOT spastic[ti] NOT "Glucagon-Like"[ti] NOT "GLP-1"[ti] NOT opioid[ti] NOT cannabis[ti] NOT tumor*[ti] NOT tumour*[ti] NOT arthrodesis[ti] NOT "artificial intelligence"[ti] NOT "AI-based"[ti] NOT exoskeleton*[ti] NOT decoding[ti] NOT "Feature-Level"[ti] NOT "sEMG-IMU"[ti] NOT graft[ti] NOT "vagus"[ti] NOT ergonomic*[ti] NOT implant*[ti] NOT "neural control"[ti] NOT methodological[ti] NOT "pain-related fear"[ti]`,
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press|scapul|supraspinatus/i,
    ),
    category(
      'mechanics',
      'How the joint is built and how it moves.',
      `(shoulder[ti] OR glenohumeral[ti] OR scapula*[ti]) AND ${MECH} NOT arthroplasty[ti] NOT "Editorial Commentary"[ti] NOT hemiplegic[ti] NOT stroke[ti] NOT "brain injury"[ti] NOT spastic[ti] NOT "Glucagon-Like"[ti] NOT "GLP-1"[ti] NOT opioid[ti] NOT cannabis[ti] NOT tumor*[ti] NOT tumour*[ti] NOT arthrodesis[ti] NOT "artificial intelligence"[ti] NOT "AI-based"[ti] NOT "artificial intelligence"[ti] NOT nerve*[ti] NOT injection[ti] NOT golf[ti] NOT obesity[ti] NOT "muscle energy"[ti] NOT mobilization[ti] NOT "Dynamic Anterior"[ti] NOT "new normal"[ti] NOT "interscalene"[ti] NOT fractur*[ti] NOT plate[ti]`,
      /shoulder|rotator cuff|glenohumeral|subacromial|labr|SLAP|deltoid|acromioclavicular|impingement|lateral raise|overhead press|scapul|supraspinatus/i,
    ),
  ],
};

export default region;
