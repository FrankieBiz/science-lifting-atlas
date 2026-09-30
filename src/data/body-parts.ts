// Body-part directory: one entry per region, each with a plain-language
// overview and the PubMed searches that fill its study categories.
// To add a region: add an entry here, run `pnpm studies:fetch`, commit both.

export interface StudyCategory {
  id: string;
  label: string;
  blurb: string;
  /** PubMed search term, run sorted newest first. */
  query: string;
}

export interface Injury {
  name: string;
  summary: string;
}

export interface BodyPart {
  slug: string;
  name: string;
  tagline: string;
  /** Where the region sits on the anatomy poster, in percent, and how far to zoom. */
  focus: { x: number; y: number; zoom: number };
  /** Anatomy-explorer muscle ids whose research lives on this page. */
  muscles: string[];
  whatItDoes: string;
  keyParts: string[];
  commonInjuries: Injury[];
  categories: StudyCategory[];
}

const HUMAN_ENGLISH = 'AND humans[mh] AND english[la] AND hasabstract';

function category(
  id: string,
  label: string,
  blurb: string,
  topic: string,
): StudyCategory {
  return { id, label, blurb, query: `(${topic}) ${HUMAN_ENGLISH}` };
}

export const BODY_PARTS: BodyPart[] = [
  {
    slug: 'shoulder',
    name: 'Shoulder',
    tagline: 'The most mobile joint in the body, and the one that pays for it.',
    focus: { x: 42, y: 23.5, zoom: 2.3 },
    muscles: [
      'deltoid-regions',
      'rotator-cuff',
      'pectoralis-major',
      'teres-major',
      'rhomboids',
    ],
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
    categories: [
      category(
        'injuries',
        'Injuries',
        'Rotator cuff, impingement, labrum, and instability.',
        '"rotator cuff"[ti] OR (impingement[ti] AND shoulder[ti]) OR "SLAP lesion*"[ti] OR "superior labr*"[ti] OR (shoulder[ti] AND (dislocation[ti] OR instability[ti])) OR "subacromial pain"[ti]',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy, rehabilitation, and treatment trials.',
        '(shoulder pain[ti] OR "rotator cuff"[ti] OR "subacromial"[ti] OR "shoulder instability"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Resistance training, muscle activation, and performance.',
        '(shoulder[ti] OR deltoid[ti] OR "rotator cuff"[ti] OR "overhead press"[ti] OR "lateral raise"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the joint is built and how it moves.',
        '(shoulder[ti] OR glenohumeral[ti] OR scapula*[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
  {
    slug: 'elbow',
    name: 'Elbow',
    tagline: 'The hinge between upper arm and forearm.',
    focus: { x: 40.8, y: 37.2, zoom: 2.6 },
    muscles: [
      'biceps-brachii',
      'brachialis',
      'brachioradialis',
      'triceps-brachii',
    ],
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
    categories: [
      category(
        'injuries',
        'Injuries',
        'Tennis and golfer’s elbow, tendon ruptures, and ligament injuries.',
        '"tennis elbow"[ti] OR "lateral epicondyl*"[ti] OR "medial epicondyl*"[ti] OR "golfer\'s elbow"[ti] OR "lateral elbow tendinopathy"[ti] OR ("distal biceps"[ti] NOT femoris[ti]) OR ("ulnar collateral ligament"[ti] AND elbow[tiab]) OR "triceps tendon"[ti] OR "cubital tunnel"[ti]',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy, injections, and other treatment trials.',
        '("tennis elbow"[ti] OR "lateral epicondyl*"[ti] OR "medial epicondyl*"[ti] OR "elbow tendinopathy"[ti] OR ("distal biceps"[ti] NOT femoris[ti])) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Biceps, triceps, and elbow-flexor training research.',
        '("elbow flexor*"[ti] OR "elbow extensor*"[ti] OR "elbow flexion"[ti] OR "biceps brachii"[ti] OR "triceps brachii"[ti] OR brachialis[ti] OR "arm curl*"[ti] OR "biceps curl*"[ti] OR "upper arm"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the joint is built and how it moves.',
        'elbow[ti] AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
  {
    slug: 'wrist-and-hand',
    name: 'Wrist and hand',
    tagline: 'Grip strength starts here.',
    focus: { x: 39.3, y: 49.6, zoom: 2.6 },
    muscles: ['forearm-flexors-extensors'],
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
        summary:
          'Painful thumb-side tendons, worse with gripping and pinching.',
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
    categories: [
      category(
        'injuries',
        'Injuries',
        'Nerve compression, tendon, and ligament injuries.',
        '"carpal tunnel"[ti] OR "de quervain"[ti] OR "triangular fibrocartilage"[ti] OR TFCC[ti] OR (wrist[ti] AND (sprain[ti] OR injur*[ti] OR pain[ti])) OR "scaphoid fracture"[ti]',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy and treatment trials.',
        '("carpal tunnel"[ti] OR "de quervain"[ti] OR wrist[ti] OR "hand pain"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Grip strength and forearm training.',
        '("grip strength"[ti] OR "handgrip"[ti] OR forearm[ti] OR wrist[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "grip training"[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the wrist and hand are built and how they move.',
        '(wrist[ti] OR hand[ti] OR finger*[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
  {
    slug: 'neck',
    name: 'Neck',
    tagline: 'Seven vertebrae holding up your head.',
    focus: { x: 50, y: 17.5, zoom: 2.4 },
    muscles: ['trapezius-regions'],
    whatItDoes:
      'The neck, or cervical spine, supports the head and lets it nod, turn, and tilt. It also protects the spinal cord and the nerves that run to the shoulders and arms. Deep neck muscles hold the vertebrae steady, while larger muscles such as the upper trapezius link the neck to the shoulder blade.',
    keyParts: [
      'Seven cervical vertebrae (C1–C7) and their discs',
      'Deep neck flexors and extensors',
      'Upper trapezius and levator scapulae',
      'Cervical nerve roots supplying the arms',
    ],
    commonInjuries: [
      {
        name: 'Non-specific neck pain',
        summary:
          'The most common type: pain and stiffness without a single identifiable structural cause.',
      },
      {
        name: 'Cervical radiculopathy',
        summary:
          'A pinched nerve root causing pain, tingling, or weakness down the arm.',
      },
      {
        name: 'Whiplash-associated disorders',
        summary: 'Neck pain after a sudden acceleration-deceleration injury.',
      },
      {
        name: 'Muscle strain',
        summary: 'Acute pain after an awkward movement or sudden load.',
      },
    ],
    categories: [
      category(
        'injuries',
        'Injuries',
        'Neck pain, radiculopathy, and whiplash.',
        '"neck pain"[ti] OR "cervical radiculopathy"[ti] OR whiplash[ti] OR (neck[ti] AND strain[ti])',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy and treatment trials.',
        '("neck pain"[ti] OR "cervical radiculopathy"[ti] OR whiplash[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Neck and upper-trapezius strength training.',
        '(neck[ti] OR cervical[ti] OR "upper trapezius"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR strengthening[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the cervical spine is built and how it moves.',
        '("cervical spine"[ti] OR neck[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
  {
    slug: 'lower-back',
    name: 'Lower back',
    tagline: 'Where most lifting worries end up.',
    focus: { x: 50, y: 43, zoom: 2 },
    muscles: ['spinal-erectors', 'external-oblique'],
    whatItDoes:
      'The lower back, or lumbar spine, carries the weight of the upper body and transfers force between the trunk and the legs. It bends forward and back, side to side, and rotates a little. The spinal erectors, multifidus, and the abdominal wall work together to keep it stiff when you squat, deadlift, or carry heavy loads.',
    keyParts: [
      'Five lumbar vertebrae (L1–L5) and their discs',
      'Sacrum and sacroiliac joints',
      'Erector spinae and multifidus',
      'Abdominal wall and quadratus lumborum',
      'Lumbar nerve roots, including those forming the sciatic nerve',
    ],
    commonInjuries: [
      {
        name: 'Non-specific low back pain',
        summary:
          'By far the most common type: pain without a single identifiable structural cause. Most episodes settle within weeks.',
      },
      {
        name: 'Disc herniation and sciatica',
        summary:
          'Disc material irritates a nerve root, causing leg pain, sometimes with numbness or weakness.',
      },
      {
        name: 'Muscle strain',
        summary: 'Acute pain after lifting or an awkward movement.',
      },
      {
        name: 'Spondylolysis',
        summary:
          'A stress fracture of part of a vertebra, seen more often in young athletes who repeatedly extend the spine.',
      },
    ],
    categories: [
      category(
        'injuries',
        'Injuries',
        'Low back pain, disc problems, and sciatica.',
        '"low back pain"[ti] OR "lumbar disc herniation"[ti] OR sciatica[ti] OR spondylolysis[ti] OR (lumbar[ti] AND strain[ti])',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy and treatment trials.',
        '("low back pain"[ti] OR sciatica[ti] OR "lumbar disc"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Lifting, trunk training, and resistance exercise.',
        '("low back"[ti] OR lumbar[ti] OR deadlift*[ti] OR "trunk muscle*"[ti] OR "back extensor*"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "weight lifting"[tiab] OR weightlifting[tiab] OR powerlifting[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'Spinal loading and movement.',
        '("lumbar spine"[ti] OR lumbar[ti] OR spine[ti] OR spinal[ti]) AND (lifting[ti] OR deadlift*[ti] OR squat*[ti] OR (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti]))',
      ),
    ],
  },
  {
    slug: 'hip',
    name: 'Hip',
    tagline: 'The ball-and-socket that drives squats and deadlifts.',
    focus: { x: 45.5, y: 46.9, zoom: 2.1 },
    muscles: [
      'gluteus-maximus',
      'gluteus-medius',
      'gluteus-minimus',
      'major-hip-flexors',
      'hip-adductors',
    ],
    whatItDoes:
      'The hip connects the leg to the pelvis. It bends and extends the thigh, moves it in and out, and rotates it. Unlike the shoulder, it sits in a deep socket, so it is very stable and carries large loads. The glutes, hamstrings, and hip flexors that cross it are among the strongest muscles in the body.',
    keyParts: [
      'Femoral head (ball) and acetabulum (socket)',
      'Labrum, the cartilage ring around the socket',
      'Gluteus maximus, medius, and minimus',
      'Hip flexors, including iliopsoas and rectus femoris',
      'Adductors on the inner thigh',
    ],
    commonInjuries: [
      {
        name: 'Femoroacetabular impingement (FAI)',
        summary:
          'Extra bone on the ball or socket that pinches in deep flexion, often felt in the groin.',
      },
      {
        name: 'Labral tear',
        summary:
          'Damage to the socket rim, sometimes with clicking or catching.',
      },
      {
        name: 'Gluteal tendinopathy',
        summary:
          'Pain on the outside of the hip, often worse lying on that side.',
      },
      {
        name: 'Adductor and hip-flexor strains',
        summary:
          'Groin injuries common in kicking, sprinting, and change-of-direction sports.',
      },
      {
        name: 'Hip osteoarthritis',
        summary:
          'Gradual wear of the joint cartilage, causing pain and stiffness.',
      },
    ],
    categories: [
      category(
        'injuries',
        'Injuries',
        'Impingement, labrum, tendon, and groin injuries.',
        '"femoroacetabular impingement"[ti] OR "hip labral"[ti] OR "gluteal tendinopathy"[ti] OR "greater trochanteric pain"[ti] OR "groin pain"[ti] OR "adductor strain"[ti] OR (hip[ti] AND injur*[ti])',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy and treatment trials.',
        '("hip pain"[ti] OR "hip osteoarthritis"[ti] OR "femoroacetabular impingement"[ti] OR "gluteal tendinopathy"[ti] OR "groin pain"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Glute and hip-muscle training research.',
        '(glute*[ti] OR "hip extens*"[ti] OR "hip abduct*"[ti] OR "hip thrust"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the hip is built and how it moves.',
        'hip[ti] AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
  {
    slug: 'knee',
    name: 'Knee',
    tagline: 'The hinge that takes the load in every squat and landing.',
    focus: { x: 47.6, y: 69.9, zoom: 2.3 },
    muscles: ['quadriceps', 'hamstrings'],
    whatItDoes:
      'The knee bends and straightens the leg and allows a small amount of rotation when bent. The thigh bone rests on the shin bone, with the kneecap gliding in a groove at the front. Ligaments and two cartilage menisci keep it stable and spread the load, while the quadriceps and hamstrings move and protect it.',
    keyParts: [
      'Femur, tibia, and patella (kneecap)',
      'ACL, PCL, MCL, and LCL ligaments',
      'Medial and lateral menisci',
      'Quadriceps and patellar tendon',
      'Hamstrings',
    ],
    commonInjuries: [
      {
        name: 'Patellofemoral pain',
        summary:
          'Pain around or behind the kneecap, often worse with squatting, stairs, or sitting for a long time.',
      },
      {
        name: 'Patellar tendinopathy (jumper’s knee)',
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
        summary: 'Pain, swelling, and sometimes locking or catching.',
      },
      {
        name: 'Knee osteoarthritis',
        summary:
          'Gradual wear of the joint cartilage, causing pain and stiffness.',
      },
    ],
    categories: [
      category(
        'injuries',
        'Injuries',
        'Ligament, meniscus, tendon, and kneecap problems.',
        '"anterior cruciate ligament"[ti] OR ACL[ti] OR meniscus[ti] OR meniscal[ti] OR "patellofemoral pain"[ti] OR "patellar tendinopathy"[ti]',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy and treatment trials.',
        '("anterior cruciate ligament"[ti] OR ACL[ti] OR "knee osteoarthritis"[ti] OR "patellofemoral pain"[ti] OR "patellar tendinopathy"[ti] OR meniscal[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Quadriceps, hamstring, and squat research.',
        '(quadriceps[ti] OR hamstring*[ti] OR squat*[ti] OR "knee extens*"[ti] OR "leg press"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the knee is built and how it moves.',
        'knee[ti] AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
  {
    slug: 'ankle-and-foot',
    name: 'Ankle and foot',
    tagline: 'Your contact with the ground.',
    focus: { x: 46.6, y: 87.5, zoom: 2.4 },
    muscles: ['gastrocnemius-heads', 'soleus', 'tibialis-anterior'],
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
    categories: [
      category(
        'injuries',
        'Injuries',
        'Sprains, Achilles problems, and heel pain.',
        '"ankle sprain"[ti] OR "achilles tendinopathy"[ti] OR "achilles tendon rupture"[ti] OR "plantar fasciitis"[ti] OR "plantar heel pain"[ti] OR "ankle instability"[ti]',
      ),
      category(
        'rehab',
        'Rehab and treatment',
        'Exercise therapy and treatment trials.',
        '("ankle sprain"[ti] OR achilles[ti] OR "plantar fasciitis"[ti] OR "plantar heel pain"[ti] OR "ankle instability"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])',
      ),
      category(
        'training',
        'Training and strength',
        'Calf and ankle strength training.',
        '(calf[ti] OR "triceps surae"[ti] OR "plantar flexor*"[ti] OR gastrocnemius[ti] OR soleus[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])',
      ),
      category(
        'mechanics',
        'Anatomy and biomechanics',
        'How the ankle and foot are built and how they move.',
        '(ankle[ti] OR foot[ti] OR achilles[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])',
      ),
    ],
  },
];

export function findBodyPart(slug: string): BodyPart | undefined {
  return BODY_PARTS.find((part) => part.slug === slug);
}

/** The body-part page that holds research for an anatomy-explorer muscle. */
export function bodyPartForMuscle(muscleId: string): BodyPart | undefined {
  return BODY_PARTS.find((part) => part.muscles.includes(muscleId));
}
