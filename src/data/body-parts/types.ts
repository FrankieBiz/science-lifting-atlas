export type RegionGroup = 'upper-body' | 'trunk' | 'lower-body';
export type PosterView = 'front' | 'back';
export type CategoryId = 'injuries' | 'rehab' | 'training' | 'mechanics';

/** A point on a poster, in percent of the poster's width (x) and height (y). */
export interface PosterPoint {
  view: PosterView;
  x: number;
  y: number;
}

export interface StudyCategory {
  id: CategoryId;
  label: string;
  blurb: string;
  /** Full PubMed term, already including the human/English/abstract filters. */
  query: string;
  /** Titles of fetched studies should match this; used by the relevance test. */
  mustMatch: RegExp;
}

export interface Injury {
  name: string;
  summary: string;
}

export interface BodyPart {
  slug: string;
  name: string;
  group: RegionGroup;
  /** 'planned' regions are skipped everywhere: no page, no card, no hotspot. */
  status: 'published' | 'planned';
  tagline: string;
  whatItDoes: string;
  keyParts: string[];
  commonInjuries: Injury[];
  /** Red-flag guidance shown under the injury cards. Required for some regions. */
  safetyNote?: string;
  /** Hero/card plate: which poster, where to center, how far to zoom. */
  plate: PosterPoint & { zoom: number };
  /** Clickable points on the homepage body map. At least one. */
  hotspots: PosterPoint[];
  /** Exactly four, in order: injuries, rehab, training, mechanics. */
  categories: StudyCategory[];
}
