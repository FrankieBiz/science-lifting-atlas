// Pure helpers for turning PubMed esummary records into study list entries.
// Used by the fetch script (scripts/studies/fetch.mjs) and the pages.

export interface Study {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  /** ISO date, YYYY-MM-DD; day or month default to 01 when PubMed omits them. */
  date: string;
  /** PubMed's display date, e.g. "2026 Sep 12". */
  displayDate: string;
  type: string | null;
  doi: string | null;
  url: string;
}

export interface StudyFile {
  slug: string;
  fetchedAt: string;
  categories: Record<string, Study[]>;
}

interface SummaryRecord {
  uid?: string;
  title?: string;
  source?: string;
  pubdate?: string;
  epubdate?: string;
  authors?: { name?: string }[];
  articleids?: { idtype?: string; value?: string }[];
  pubtype?: string[];
}

// Most specific first: a trial that is also a "Journal Article" shows as a trial.
const TYPE_LABELS: [string, string][] = [
  ['Clinical Trial Protocol', 'Trial protocol'],
  ['Meta-Analysis', 'Meta-analysis'],
  ['Systematic Review', 'Systematic review'],
  ['Randomized Controlled Trial', 'Randomized trial'],
  ['Clinical Trial', 'Clinical trial'],
  ['Practice Guideline', 'Guideline'],
  ['Guideline', 'Guideline'],
  ['Review', 'Review'],
  ['Case Reports', 'Case report'],
];

export function studyType(pubtypes: readonly string[] = []): string | null {
  for (const [pubtype, label] of TYPE_LABELS) {
    if (pubtypes.includes(pubtype)) return label;
  }
  return null;
}

export function formatAuthors(
  authors: readonly { name?: string }[] = [],
): string {
  const names = authors.map((a) => a.name?.trim() ?? '').filter(Boolean);
  if (names.length === 0) return 'Unknown authors';
  if (names.length <= 3) return names.join(', ');
  return `${names.slice(0, 3).join(', ')}, et al.`;
}

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

/**
 * Parse PubMed's display dates ("2026 Sep 12", "2026 Sep", "2026",
 * "2026 Jul-Aug", "2026 Spring") to ISO, defaulting missing parts to 01.
 */
export function parsePubmedDate(value: string | undefined): string | null {
  const match =
    /^(\d{4})(?:\s+([A-Za-z]{3})[A-Za-z]*)?(?:[-\s]+(\d{1,2})\b)?/.exec(
      value?.trim() ?? '',
    );
  if (!match) return null;
  const monthIndex = match[2] ? MONTHS.indexOf(match[2].toLowerCase()) : -1;
  const month = String(monthIndex + 1 || 1).padStart(2, '0');
  const day = monthIndex >= 0 && match[3] ? match[3].padStart(2, '0') : '01';
  return `${match[1]}-${month}-${day}`;
}

/**
 * When the paper first came out. Journals often assign an issue date months
 * after online publication, so the earlier of the two is used.
 */
export function publishedDate(record: {
  pubdate?: string;
  epubdate?: string;
}): { date: string; displayDate: string } {
  const issue = parsePubmedDate(record.pubdate);
  const online = parsePubmedDate(record.epubdate);
  if (online && (!issue || online < issue)) {
    return { date: online, displayDate: record.epubdate?.trim() ?? '' };
  }
  return {
    date: issue ?? '0000-01-01',
    displayDate: record.pubdate?.trim() ?? '',
  };
}

export function cleanTitle(title: string | undefined): string {
  return (title ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toStudy(record: SummaryRecord): Study | null {
  const pmid = record.uid;
  const title = cleanTitle(record.title);
  if (!pmid || !title) return null;
  const doi =
    record.articleids?.find((id) => id.idtype === 'doi')?.value ?? null;
  return {
    pmid,
    title,
    authors: formatAuthors(record.authors),
    journal: record.source ?? '',
    ...publishedDate(record),
    type: studyType(record.pubtype),
    doi,
    url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
  };
}

/** Newest first; ties broken by PMID descending so output is stable. */
export function sortNewestFirst(studies: readonly Study[]): Study[] {
  return [...studies].sort(
    (a, b) => b.date.localeCompare(a.date) || Number(b.pmid) - Number(a.pmid),
  );
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Split a study date for display, keeping only the precision PubMed gave. */
export function dateParts(study: Pick<Study, 'date' | 'displayDate'>): {
  month: string | null;
  day: string | null;
  year: string;
} {
  const [year = '', month = '01', day = '01'] = study.date.split('-');
  const precision = study.displayDate.trim().split(/\s+/).length;
  return {
    year,
    month: precision >= 2 ? (MONTH_LABELS[Number(month) - 1] ?? null) : null,
    day: precision >= 3 ? String(Number(day)) : null,
  };
}
