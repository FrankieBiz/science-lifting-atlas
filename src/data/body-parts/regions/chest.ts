import type { BodyPart } from '../types.ts';
import { category, MECH, REHAB, TRAIN } from '../shared.ts';

const region: BodyPart = {
  slug: 'chest',
  name: 'Chest',
  group: 'upper-body',
  status: 'published',
  tagline: 'The pressing engine of the upper body.',
  whatItDoes:
    'The chest muscles bring the arm across the front of the body and help push. The main one, pectoralis major, fans out from the breastbone and collarbone to the upper arm. Behind it, the rib cage protects the heart and lungs and moves with every breath. In lifting, the chest drives pressing movements such as the bench press and the push-up, working with the shoulders and triceps.',
  keyParts: [
    'Pectoralis major (clavicular and sternocostal heads)',
    'Pectoralis minor',
    'Sternum (breastbone) and ribs',
    'Serratus anterior',
    'Sternoclavicular joint',
  ],
  commonInjuries: [
    {
      name: 'Pectoralis major tendon rupture',
      summary:
        'A tear where the muscle attaches to the upper arm bone, classically during a heavy bench press. It causes sudden pain, bruising, and weakness, and needs prompt assessment.',
    },
    {
      name: 'Pectoralis muscle strain',
      summary:
        'Pain and tenderness in the chest muscle after a sudden stretch or heavy load, usually milder than a full tendon tear.',
    },
    {
      name: 'Costochondritis (rib cartilage pain)',
      summary:
        'Tender chest-wall pain where the ribs meet the breastbone, often felt when pressing on the area or taking a deep breath.',
    },
    {
      name: 'Sternoclavicular joint sprain',
      summary:
        'Injury to the joint where the collarbone meets the breastbone, causing pain and sometimes swelling at the front of the chest.',
    },
    {
      name: 'Rib stress fracture',
      summary:
        'A small crack in a rib from repeated loading, seen in rowers, with pain that builds during activity.',
    },
  ],
  safetyNote:
    'Chest pain can come from the heart or lungs. Get emergency care for chest pain with breathlessness, sweating, nausea, or pain spreading to the arm, jaw, or back.',
  plate: { view: 'front', x: 50, y: 26, zoom: 2.1 },
  hotspots: [{ view: 'front', x: 50, y: 26 }],
  categories: [
    category(
      'injuries',
      'Pectoral tears, chest-wall pain, and joint injuries.',
      '("pectoralis major"[ti] AND (rupture*[ti] OR tear*[ti] OR injur*[ti] OR repair*[ti] OR avulsion*[ti])) OR costochondritis[ti] OR (sternoclavicular[ti] AND (dislocat*[ti] OR sprain*[ti] OR injur*[ti] OR instabilit*[ti])) OR ("stress fracture*"[ti] AND rib*[ti]) NOT tubercul*[ti] NOT infect*[ti] NOT "chest tube"[ti]',
      /pectoral|bench|chest|push-?up|sternoclav|costochond|rib/i,
    ),
    category(
      'rehab',
      'Exercise therapy, repair, and treatment trials.',
      `(("pectoralis major"[ti] AND (rupture*[ti] OR tear*[ti] OR tendon[ti] OR injur*[ti])) OR costochondritis[ti] OR (sternoclavicular[ti] AND (dislocat*[ti] OR instabilit*[ti] OR injur*[ti]))) AND ${REHAB} NOT flap*[ti] NOT infect*[ti] NOT tubercul*[ti] NOT "chest tube"[ti]`,
      /pectoral|bench|chest|push-?up|sternoclav|costochond|rib/i,
    ),
    category(
      'training',
      'Bench press, push-up, and chest-muscle training research.',
      `(pectoral*[ti] OR "bench press"[ti] OR "chest press"[ti] OR "push-up"[ti] OR "push up"[ti] OR "chest fly"[ti]) AND ${TRAIN} NOT scapular[ti] NOT arthroscopic[ti]`,
      /pectoral|bench|chest|push-?up|sternoclav|costochond|rib/i,
    ),
    category(
      'mechanics',
      'How the chest wall and pressing movements work.',
      `(pectoral*[ti] OR "bench press"[ti] OR sternoclavicular[ti]) AND ${MECH} NOT breast*[ti] NOT arthroplasty[ti] NOT flap*[ti]`,
      /pectoral|bench|chest|push-?up|sternoclav|costochond|rib/i,
    ),
  ],
};

export default region;
