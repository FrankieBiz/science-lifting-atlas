import {
  REGION_ORDER,
  SAFETY_NOTE_REQUIRED,
} from '../../data/body-parts/shared.ts';
import type { BodyPart, PosterPoint } from '../../data/body-parts/types.ts';

export const BANNED =
  /\b(proven|prove[sn]?|best|guarantee[sd]?|cure[sd]?|studies (show|prove)|research (shows|proves)|you should|you must|always|never|miracle|optimal)\b|\d+\s?%|\bper ?cent\b/i;

const CATEGORY_ORDER = ['injuries', 'rehab', 'training', 'mechanics'];

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function inRange(point: Pick<PosterPoint, 'x' | 'y'>) {
  return point.x > 0 && point.x < 100 && point.y > 0 && point.y < 100;
}

/** Returns human-readable errors for a published region; empty means valid. */
export function validateBodyPart(part: BodyPart): string[] {
  const errors: string[] = [];
  const at = `${part.slug}:`;
  const fail = (message: string) => errors.push(`${at} ${message}`);

  if (!(REGION_ORDER as readonly string[]).includes(part.slug)) {
    fail('slug is not in REGION_ORDER');
  }
  if (!/^[a-z]+(-[a-z]+)*$/.test(part.slug)) fail('slug is not kebab-case');

  if (part.tagline.length < 10 || part.tagline.length > 70) {
    fail(`tagline must be 10–70 characters (is ${part.tagline.length})`);
  }
  if (!part.tagline.endsWith('.')) fail('tagline must end with a period');

  const doesWords = words(part.whatItDoes);
  if (doesWords < 50 || doesWords > 110) {
    fail(`whatItDoes must be 50–110 words (is ${doesWords})`);
  }

  if (part.keyParts.length < 4 || part.keyParts.length > 7) {
    fail(`keyParts must have 4–7 items (has ${part.keyParts.length})`);
  }
  for (const item of part.keyParts) {
    if (item.length < 3 || item.length > 80) {
      fail(`keyParts item must be 3–80 characters: "${item}"`);
    }
  }

  if (part.commonInjuries.length < 4 || part.commonInjuries.length > 6) {
    fail(
      `commonInjuries must have 4–6 items (has ${part.commonInjuries.length})`,
    );
  }
  for (const injury of part.commonInjuries) {
    if (injury.name.length < 3 || injury.name.length > 60) {
      fail(`injury name must be 3–60 characters: "${injury.name}"`);
    }
    const n = words(injury.summary);
    if (n < 8 || n > 40) {
      fail(`injury summary must be 8–40 words (is ${n}): "${injury.name}"`);
    }
    if (!injury.summary.endsWith('.')) {
      fail(`injury summary must end with a period: "${injury.name}"`);
    }
  }

  if (SAFETY_NOTE_REQUIRED.includes(part.slug) && !part.safetyNote) {
    fail('safetyNote is required for this region');
  }
  if (part.safetyNote !== undefined) {
    const n = words(part.safetyNote);
    if (n < 15 || n > 60) fail(`safetyNote must be 15–60 words (is ${n})`);
  }

  if (part.categories.length !== 4) {
    fail(`must have exactly 4 categories (has ${part.categories.length})`);
  } else {
    const ids = part.categories.map((c) => c.id);
    if (ids.join() !== CATEGORY_ORDER.join()) {
      fail(
        `category ids must be ${CATEGORY_ORDER.join(', ')} (are ${ids.join(', ')})`,
      );
    }
  }
  for (const c of part.categories) {
    if (c.blurb.length < 3 || c.blurb.length > 90) {
      fail(`${c.id} blurb must be 3–90 characters`);
    }
    if (c.mustMatch.source === '.') fail(`${c.id} mustMatch is a placeholder`);
  }

  const { x, y, zoom } = part.plate;
  if (!inRange({ x, y })) fail('plate point must be inside the poster');
  if (zoom < 1.5 || zoom > 3.2) fail(`plate zoom must be 1.5–3.2 (is ${zoom})`);

  if (part.hotspots.length < 1 || part.hotspots.length > 2) {
    fail(`hotspots must have 1–2 items (has ${part.hotspots.length})`);
  }
  for (const spot of part.hotspots) {
    if (!inRange(spot)) fail('hotspot must be inside the poster');
  }

  const prose: [string, string][] = [
    ['tagline', part.tagline],
    ['whatItDoes', part.whatItDoes],
    ...part.keyParts.map((t): [string, string] => ['keyParts', t]),
    ...part.commonInjuries.flatMap((i): [string, string][] => [
      ['injury name', i.name],
      ['injury summary', i.summary],
    ]),
    ...(part.safetyNote
      ? [['safetyNote', part.safetyNote] as [string, string]]
      : []),
  ];
  for (const [field, text] of prose) {
    const hit = BANNED.exec(text);
    if (hit)
      fail(`${field} uses banned wording "${hit[0]}": "${text.slice(0, 60)}"`);
  }

  return errors;
}
