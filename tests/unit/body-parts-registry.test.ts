import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import explorer from '../../docs/licenses/anatomy-explorer-manifest.json';
import {
  ALL_BODY_PARTS,
  BODY_PARTS,
  REGION_ORDER,
  bodyPartForMuscle,
} from '../../src/data/body-parts/index.ts';
import { MUSCLE_REGIONS } from '../../src/data/body-parts/muscle-map.ts';
import { plateImageStyle } from '../../src/lib/body-parts/plate.ts';
import { validateBodyPart } from '../../src/lib/body-parts/validate.ts';

/** PubMed terms as they were before the registry split (must never drift). */
// Regions are removed from this snapshot when their R task deliberately revises the queries.
const QUERY_SNAPSHOT: Record<string, Record<string, string>> = {
  shoulder: {
    injuries:
      '("rotator cuff"[ti] OR (impingement[ti] AND shoulder[ti]) OR "SLAP lesion*"[ti] OR "superior labr*"[ti] OR (shoulder[ti] AND (dislocation[ti] OR instability[ti])) OR "subacromial pain"[ti]) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '((shoulder pain[ti] OR "rotator cuff"[ti] OR "subacromial"[ti] OR "shoulder instability"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '((shoulder[ti] OR deltoid[ti] OR "rotator cuff"[ti] OR "overhead press"[ti] OR "lateral raise"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '((shoulder[ti] OR glenohumeral[ti] OR scapula*[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
  elbow: {
    injuries:
      '("tennis elbow"[ti] OR "lateral epicondyl*"[ti] OR "medial epicondyl*"[ti] OR "golfer\'s elbow"[ti] OR "lateral elbow tendinopathy"[ti] OR ("distal biceps"[ti] NOT femoris[ti]) OR ("ulnar collateral ligament"[ti] AND elbow[tiab]) OR "triceps tendon"[ti] OR "cubital tunnel"[ti]) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '(("tennis elbow"[ti] OR "lateral epicondyl*"[ti] OR "medial epicondyl*"[ti] OR "elbow tendinopathy"[ti] OR ("distal biceps"[ti] NOT femoris[ti])) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '(("elbow flexor*"[ti] OR "elbow extensor*"[ti] OR "elbow flexion"[ti] OR "biceps brachii"[ti] OR "triceps brachii"[ti] OR brachialis[ti] OR "arm curl*"[ti] OR "biceps curl*"[ti] OR "upper arm"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '(elbow[ti] AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
  'wrist-and-hand': {
    injuries:
      '("carpal tunnel"[ti] OR "de quervain"[ti] OR "triangular fibrocartilage"[ti] OR TFCC[ti] OR (wrist[ti] AND (sprain[ti] OR injur*[ti] OR pain[ti])) OR "scaphoid fracture"[ti]) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '(("carpal tunnel"[ti] OR "de quervain"[ti] OR wrist[ti] OR "hand pain"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '(("grip strength"[ti] OR "handgrip"[ti] OR forearm[ti] OR wrist[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "grip training"[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '((wrist[ti] OR hand[ti] OR finger*[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
  neck: {
    injuries:
      '("neck pain"[ti] OR "cervical radiculopathy"[ti] OR whiplash[ti] OR (neck[ti] AND strain[ti])) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '(("neck pain"[ti] OR "cervical radiculopathy"[ti] OR whiplash[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '((neck[ti] OR cervical[ti] OR "upper trapezius"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR strengthening[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '(("cervical spine"[ti] OR neck[ti]) AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
  'lower-back': {
    injuries:
      '("low back pain"[ti] OR "lumbar disc herniation"[ti] OR sciatica[ti] OR spondylolysis[ti] OR (lumbar[ti] AND strain[ti])) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '(("low back pain"[ti] OR sciatica[ti] OR "lumbar disc"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '(("low back"[ti] OR lumbar[ti] OR deadlift*[ti] OR "trunk muscle*"[ti] OR "back extensor*"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "weight lifting"[tiab] OR weightlifting[tiab] OR powerlifting[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '(("lumbar spine"[ti] OR lumbar[ti] OR spine[ti] OR spinal[ti]) AND (lifting[ti] OR deadlift*[ti] OR squat*[ti] OR (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti]))) AND humans[mh] AND english[la] AND hasabstract',
  },
  'hip-and-groin': {
    injuries:
      '("femoroacetabular impingement"[ti] OR "hip labral"[ti] OR "gluteal tendinopathy"[ti] OR "greater trochanteric pain"[ti] OR "groin pain"[ti] OR "adductor strain"[ti] OR (hip[ti] AND injur*[ti])) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '(("hip pain"[ti] OR "hip osteoarthritis"[ti] OR "femoroacetabular impingement"[ti] OR "gluteal tendinopathy"[ti] OR "groin pain"[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '((glute*[ti] OR "hip extens*"[ti] OR "hip abduct*"[ti] OR "hip thrust"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '(hip[ti] AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
  knee: {
    injuries:
      '("anterior cruciate ligament"[ti] OR ACL[ti] OR meniscus[ti] OR meniscal[ti] OR "patellofemoral pain"[ti] OR "patellar tendinopathy"[ti]) AND humans[mh] AND english[la] AND hasabstract',
    rehab:
      '(("anterior cruciate ligament"[ti] OR ACL[ti] OR "knee osteoarthritis"[ti] OR "patellofemoral pain"[ti] OR "patellar tendinopathy"[ti] OR meniscal[ti]) AND (exercise[tiab] OR rehabilitation[tiab] OR physiotherapy[tiab] OR "physical therapy"[tiab] OR treatment[ti] OR management[ti])) AND humans[mh] AND english[la] AND hasabstract',
    training:
      '((quadriceps[ti] OR hamstring*[ti] OR squat*[ti] OR "knee extens*"[ti] OR "leg press"[ti]) AND ("resistance training"[tiab] OR "strength training"[tiab] OR "resistance exercise"[tiab] OR hypertrophy[tiab] OR electromyography[tiab])) AND humans[mh] AND english[la] AND hasabstract',
    mechanics:
      '(knee[ti] AND (biomechanic*[ti] OR kinematic*[ti] OR kinetic*[ti] OR anatom*[ti] OR "range of motion"[ti] OR loading[ti])) AND humans[mh] AND english[la] AND hasabstract',
  },
};

describe('body-part registry', () => {
  it('has one file per region, in REGION_ORDER', () => {
    expect(ALL_BODY_PARTS.map((part) => part.slug)).toEqual([...REGION_ORDER]);
    for (const part of ALL_BODY_PARTS) {
      expect(
        existsSync(path.resolve(`src/data/body-parts/regions/${part.slug}.ts`)),
        part.slug,
      ).toBe(true);
    }
  });

  it('passes the validator for every published region', () => {
    const errors = BODY_PARTS.flatMap(validateBodyPart);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  it('maps every explorer muscle to a published region', () => {
    for (const entity of explorer.entities) {
      expect(MUSCLE_REGIONS[entity.id], entity.id).toBeDefined();
      expect(bodyPartForMuscle(entity.id)?.status, entity.id).toBe('published');
    }
    for (const slugs of Object.values(MUSCLE_REGIONS)) {
      for (const slug of slugs) {
        expect(REGION_ORDER as readonly string[]).toContain(slug);
      }
    }
  });

  it('has a study file for every published region', () => {
    for (const part of BODY_PARTS) {
      expect(
        existsSync(path.resolve(`src/data/studies/${part.slug}.json`)),
        part.slug,
      ).toBe(true);
      const file = JSON.parse(
        readFileSync(
          path.resolve(`src/data/studies/${part.slug}.json`),
          'utf8',
        ),
      ) as { slug: string };
      expect(file.slug).toBe(part.slug);
    }
  });

  it('keeps the original PubMed queries for the existing regions', () => {
    for (const [slug, queries] of Object.entries(QUERY_SNAPSHOT)) {
      const part = ALL_BODY_PARTS.find((p) => p.slug === slug);
      expect(part, slug).toBeDefined();
      expect(
        Object.fromEntries(part!.categories.map((c) => [c.id, c.query])),
      ).toEqual(queries);
    }
  });
});

describe('plateImageStyle', () => {
  it('matches the elbow hero plate from the current build', () => {
    const style = plateImageStyle({ x: 40.8, y: 37.2 }, 2.6, 1.25);
    expect(style.width).toBeCloseTo(260, 2);
    expect(style.left).toBeCloseTo(-56.08, 2);
    expect(style.top).toBeCloseTo(-10.32, 2);
  });
});
