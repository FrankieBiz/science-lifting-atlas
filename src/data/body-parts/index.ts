import type { BodyPart, RegionGroup } from './types.ts';
import { MUSCLE_REGIONS } from './muscle-map.ts';
import neck from './regions/neck.ts';
import shoulder from './regions/shoulder.ts';
import chest from './regions/chest.ts';
import upperBack from './regions/upper-back.ts';
import elbow from './regions/elbow.ts';
import wristAndHand from './regions/wrist-and-hand.ts';
import abdomenAndCore from './regions/abdomen-and-core.ts';
import lowerBack from './regions/lower-back.ts';
import hipAndGroin from './regions/hip-and-groin.ts';
import thigh from './regions/thigh.ts';
import knee from './regions/knee.ts';
import lowerLeg from './regions/lower-leg.ts';
import ankleAndFoot from './regions/ankle-and-foot.ts';

export const ALL_BODY_PARTS: BodyPart[] = [
  neck,
  shoulder,
  chest,
  upperBack,
  elbow,
  wristAndHand,
  abdomenAndCore,
  lowerBack,
  hipAndGroin,
  thigh,
  knee,
  lowerLeg,
  ankleAndFoot,
];

export const BODY_PARTS: BodyPart[] = ALL_BODY_PARTS.filter(
  (part) => part.status === 'published',
);

export { GROUPS, REGION_ORDER } from './shared.ts';
export type * from './types.ts';

export function findBodyPart(slug: string): BodyPart | undefined {
  return BODY_PARTS.find((part) => part.slug === slug);
}

export function bodyPartsInGroup(group: RegionGroup): BodyPart[] {
  return BODY_PARTS.filter((part) => part.group === group);
}

/** The published body-part page that holds research for an explorer muscle. */
export function bodyPartForMuscle(muscleId: string): BodyPart | undefined {
  for (const slug of MUSCLE_REGIONS[muscleId] ?? []) {
    const part = findBodyPart(slug);
    if (part) return part;
  }
  return undefined;
}
