import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it } from 'vitest';

import {
  BUNDLE_VALIDATION_CODES,
  validateResearchBundle,
} from '../../scripts/evidence/research-integrity.mjs';

const execFileAsync = promisify(execFile);
const fixtureRoot = new URL('../fixtures/research-integrity/', import.meta.url);
const checkerPath = path.resolve(
  import.meta.dirname,
  '../../scripts/evidence/research-integrity.mjs',
);
const temporaryRoots: string[] = [];

type JsonObject = Record<string, unknown>;
type Mutation = {
  name: string;
  expectedCode: string;
  artifact: string;
  expectedPath: string;
  operation: 'set' | 'delete';
  path: Array<string | number>;
  value?: unknown;
};

async function readJson<T>(name: string): Promise<T> {
  return JSON.parse(await readFile(new URL(name, fixtureRoot), 'utf8')) as T;
}

function mutate(target: JsonObject, change: Mutation) {
  let cursor: unknown = target;
  for (const segment of change.path.slice(0, -1)) {
    cursor = (cursor as Record<string | number, unknown>)[segment];
  }
  const parent = cursor as Record<string | number, unknown>;
  const finalSegment = change.path.at(-1)!;
  if (change.operation === 'delete') delete parent[finalSegment];
  else parent[finalSegment] = change.value;
}

async function makeRoot() {
  const root = await mkdtemp(path.join(tmpdir(), 'sbla-research-integrity-'));
  temporaryRoots.push(root);
  return root;
}

async function materializeBundle(
  root: string,
  bundle: Record<'search' | 'screening' | 'extraction' | 'packet', unknown>,
) {
  const files = {
    search: 'research/searches/SBLA-TEST-search-receipts.json',
    screening: 'research/screening/SBLA-TEST-screening-flow.json',
    extraction: 'research/extractions/SBLA-TEST-source-extractions.json',
    packet: 'research/packets/sbla-test-evidence-packet.json',
  } as const;

  await Promise.all(
    Object.entries(files).map(async ([kind, relativePath]) => {
      const absolutePath = path.join(root, relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(
        absolutePath,
        `${JSON.stringify(bundle[kind as keyof typeof files], null, 2)}\n`,
      );
    }),
  );
  return files;
}

async function runCli(root: string, ...extraArguments: string[]) {
  return execFileAsync(
    process.execPath,
    [checkerPath, '--root', root, ...extraArguments],
    { encoding: 'utf8' },
  );
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('research companion bundle validation', () => {
  it('accepts the minimal valid fixture without mutating it', async () => {
    const bundle = await readJson<JsonObject>('valid-bundle.json');
    const before = JSON.stringify(bundle);

    expect(validateResearchBundle(bundle)).toEqual([]);
    expect(JSON.stringify(bundle)).toBe(before);
  });

  it('keeps issue ordering deterministic regardless of object insertion order', async () => {
    const bundle = await readJson<JsonObject>('valid-bundle.json');
    const invalid = structuredClone(bundle);
    mutate(invalid, {
      name: 'date',
      expectedCode: 'DATE_INVALID',
      artifact: 'search',
      expectedPath: '$.receipts[0].executedAt',
      operation: 'set',
      path: ['search', 'receipts', 0, 'executedAt'],
      value: '2026-02-30',
    });
    mutate(invalid, {
      name: 'language',
      expectedCode: 'LANGUAGE_REQUIRED',
      artifact: 'extraction',
      expectedPath: '$.extractions[0].extraction.language',
      operation: 'set',
      path: ['extraction', 'extractions', 0, 'extraction', 'language'],
      value: null,
    });

    const first = validateResearchBundle(invalid);
    const second = validateResearchBundle(
      Object.fromEntries(Object.entries(invalid).reverse()),
    );
    expect(second).toEqual(first);
  });

  it('independently exercises every bundle validation code with exact paths', async () => {
    const valid = await readJson<JsonObject>('valid-bundle.json');
    const invalid = await readJson<{ cases: Mutation[] }>(
      'invalid-bundle.json',
    );

    expect(new Set(invalid.cases.map((entry) => entry.expectedCode))).toEqual(
      new Set(BUNDLE_VALIDATION_CODES),
    );

    for (const testCase of invalid.cases) {
      const bundle = structuredClone(valid);
      mutate(bundle, testCase);
      expect(validateResearchBundle(bundle), `case: ${testCase.name}`).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: testCase.expectedCode,
            artifact: testCase.artifact,
            path: testCase.expectedPath,
          }),
        ]),
      );
    }
  });
});

describe('research companion CLI', () => {
  it('accepts a complete selected bundle', async () => {
    const root = await makeRoot();
    const bundle =
      await readJson<
        Record<'search' | 'screening' | 'extraction' | 'packet', unknown>
      >('valid-bundle.json');
    await materializeBundle(root, bundle);

    await expect(runCli(root, '--bundle', 'SBLA-TEST')).resolves.toMatchObject({
      stdout: expect.stringContaining(
        'Research integrity passed: 1 complete bundle checked (SBLA-TEST).',
      ),
    });
  });

  it('rejects a partial companion bundle and names every missing component', async () => {
    const root = await makeRoot();
    const bundle =
      await readJson<
        Record<'search' | 'screening' | 'extraction' | 'packet', unknown>
      >('valid-bundle.json');
    const files = await materializeBundle(root, bundle);
    await Promise.all(
      (['screening', 'extraction', 'packet'] as const).map((kind) =>
        rm(path.join(root, files[kind])),
      ),
    );

    await expect(runCli(root)).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(
        /\[BUNDLE_PARTIAL\].*extraction, packet, screening/s,
      ),
    });
  });

  it('rejects an explicitly selected missing bundle', async () => {
    const root = await makeRoot();

    await expect(runCli(root, '--bundle', 'SBLA-TEST')).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining('[BUNDLE_MISSING]'),
    });
  });

  it('rejects malformed JSON with the exact artifact path', async () => {
    const root = await makeRoot();
    const bundle =
      await readJson<
        Record<'search' | 'screening' | 'extraction' | 'packet', unknown>
      >('valid-bundle.json');
    const files = await materializeBundle(root, bundle);
    await writeFile(path.join(root, files.screening), '{\n');

    await expect(runCli(root, '--bundle', 'SBLA-TEST')).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(
        /\[JSON_PARSE_FAILED\].*research\/screening\/SBLA-TEST-screening-flow\.json/s,
      ),
    });
  });
});
