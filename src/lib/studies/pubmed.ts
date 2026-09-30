// Minimal PubMed E-utilities client shared by the fetch and preview scripts.
// Node's `fetch` needs NODE_USE_ENV_PROXY=1 to use the sandbox proxy.

import {
  sortNewestFirst,
  toStudy,
  type Study,
  type SummaryRecord,
} from './studies.ts';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const TOOL = 'science-lifting-atlas';
// NCBI allows three requests a second without an API key, ten with one.
const GAP_WITHOUT_KEY_MS = 400;
const GAP_WITH_KEY_MS = 120;

export interface SearchResult {
  ids: string[];
  /** Total PubMed matches, not just the ids returned. */
  count: number;
}

export function requestGapMs(apiKey: string | undefined): number {
  return apiKey ? GAP_WITH_KEY_MS : GAP_WITHOUT_KEY_MS;
}

export function esearchUrl(
  term: string,
  retmax: number,
  apiKey?: string,
): string {
  const params = new URLSearchParams({
    db: 'pubmed',
    term,
    retmax: String(retmax),
    sort: 'pub_date',
    retmode: 'json',
    tool: TOOL,
  });
  if (apiKey) params.set('api_key', apiKey);
  return `${EUTILS}/esearch.fcgi?${params}`;
}

export function esummaryUrl(ids: readonly string[], apiKey?: string): string {
  const params = new URLSearchParams({
    db: 'pubmed',
    id: ids.join(','),
    retmode: 'json',
    tool: TOOL,
  });
  if (apiKey) params.set('api_key', apiKey);
  return `${EUTILS}/esummary.fcgi?${params}`;
}

interface EsearchResponse {
  esearchresult?: { idlist?: string[]; count?: string };
}

interface EsummaryResponse {
  result?: { uids?: string[] } & Record<string, unknown>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function createPubmedClient(apiKey = process.env['NCBI_API_KEY']) {
  const gap = requestGapMs(apiKey);

  async function getJson<T>(url: string): Promise<T> {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await sleep(gap);
      const response = await fetch(url);
      if (response.ok) return (await response.json()) as T;
      if (attempt === 3) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      await sleep(1000 * attempt);
    }
    throw new Error('unreachable');
  }

  return {
    async search(term: string, retmax: number): Promise<SearchResult> {
      const data = await getJson<EsearchResponse>(
        esearchUrl(term, retmax, apiKey),
      );
      return {
        ids: data.esearchresult?.idlist ?? [],
        count: Number(data.esearchresult?.count ?? 0),
      };
    },
    async summarize(ids: readonly string[]): Promise<Study[]> {
      if (ids.length === 0) return [];
      const data = await getJson<EsummaryResponse>(esummaryUrl(ids, apiKey));
      const result = data.result ?? {};
      const uids = result.uids ?? [];
      return sortNewestFirst(
        uids.flatMap((uid) => toStudy(result[uid] as SummaryRecord) ?? []),
      );
    },
  };
}
