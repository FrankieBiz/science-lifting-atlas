import { execFile } from 'node:child_process';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(import.meta.dirname, '../..');
let fixtureRoot = '';

async function copyScript(relativePath: string, root = fixtureRoot) {
  const destination = path.join(root, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(repositoryRoot, relativePath), destination);
}

async function createAdapterFixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'sbla-adapter-subprocess-'));
  await Promise.all([
    copyScript('scripts/content/validate.mjs', root),
    copyScript('scripts/evidence/status.mjs', root),
    copyScript('scripts/foundation/foundation-mode.mjs', root),
    copyScript('scripts/foundation/scan-records.mjs', root),
    copyScript('scripts/graph/validate.mjs', root),
    copyScript('src/lib/content/registry.ts', root),
    copyScript('src/lib/content/schemas.ts', root),
    copyScript('src/lib/content/validation.ts', root),
    copyScript('src/lib/graph/compiler.ts', root),
  ]);
  await Promise.all([
    mkdir(path.join(root, 'content/claims'), { recursive: true }),
    mkdir(path.join(root, 'content/sources'), { recursive: true }),
    mkdir(path.join(root, 'content/changes'), { recursive: true }),
    mkdir(path.join(root, 'content-drafts'), { recursive: true }),
    mkdir(path.join(root, 'research/packets'), { recursive: true }),
    mkdir(path.join(root, 'reviews/evidence'), { recursive: true }),
    writeFile(path.join(root, 'package.json'), '{"type":"module"}\n'),
    symlink(
      path.join(repositoryRoot, 'node_modules'),
      path.join(root, 'node_modules'),
    ),
  ]);
  return root;
}

async function expectAdapterToRejectSymlink(
  relativeScriptPath: string,
  expectedRecordPath: string,
) {
  await expect(
    execFileAsync(
      process.execPath,
      [path.join(fixtureRoot, relativeScriptPath)],
      {
        cwd: fixtureRoot,
        encoding: 'utf8',
      },
    ),
  ).rejects.toMatchObject({
    code: 1,
    stderr: expect.stringContaining(expectedRecordPath),
  });
}

async function runAdapter(relativeScriptPath: string, env = process.env) {
  return runAdapterAt(fixtureRoot, relativeScriptPath, env);
}

async function runAdapterAt(
  root: string,
  relativeScriptPath: string,
  env = process.env,
) {
  return execFileAsync(
    process.execPath,
    [path.join(root, relativeScriptPath)],
    {
      cwd: root,
      encoding: 'utf8',
      env,
    },
  );
}

beforeAll(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), 'sbla-foundation-adapters-'));

  await Promise.all([
    copyScript('scripts/content/validate.mjs'),
    copyScript('scripts/evidence/status.mjs'),
    copyScript('scripts/foundation/foundation-mode.mjs'),
    copyScript('scripts/foundation/scan-records.mjs'),
    copyScript('scripts/graph/validate.mjs'),
    copyScript('src/lib/content/registry.ts'),
    copyScript('src/lib/content/schemas.ts'),
    copyScript('src/lib/content/validation.ts'),
    copyScript('src/lib/graph/compiler.ts'),
  ]);

  await Promise.all([
    mkdir(path.join(fixtureRoot, 'content/claims'), { recursive: true }),
    mkdir(path.join(fixtureRoot, 'content/sources'), { recursive: true }),
    mkdir(path.join(fixtureRoot, 'content-drafts/exercises'), {
      recursive: true,
    }),
    mkdir(path.join(fixtureRoot, 'research/packets'), { recursive: true }),
    mkdir(path.join(fixtureRoot, 'reviews/evidence'), { recursive: true }),
    writeFile(path.join(fixtureRoot, 'README.md'), 'fixture target\n'),
    symlink(
      path.join(repositoryRoot, 'node_modules'),
      path.join(fixtureRoot, 'node_modules'),
    ),
  ]);

  await Promise.all([
    symlink(
      '../../README.md',
      path.join(fixtureRoot, 'content/claims/claim.yml'),
    ),
    symlink(
      '../../README.md',
      path.join(fixtureRoot, 'content/sources/source.yml'),
    ),
    symlink(
      '../../README.md',
      path.join(fixtureRoot, 'content-drafts/exercises/draft.yml'),
    ),
  ]);
});

afterAll(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

describe('foundation adapters', () => {
  it('makes content validation fail closed on record symlinks', async () => {
    await expectAdapterToRejectSymlink(
      'scripts/content/validate.mjs',
      'content/claims/claim.yml',
    );
  });

  it('makes graph validation fail closed on record symlinks', async () => {
    await expectAdapterToRejectSymlink(
      'scripts/graph/validate.mjs',
      'content/claims/claim.yml',
    );
  });

  it('makes evidence status fail closed on source symlinks', async () => {
    await expectAdapterToRejectSymlink(
      'scripts/evidence/status.mjs',
      'content/sources/source.yml',
    );
  });

  it('reports a stable actionable error for an invalid deterministic date', async () => {
    await expect(
      runAdapter('scripts/graph/validate.mjs', {
        ...process.env,
        SBLA_AS_OF: '2026-02-30',
      }),
    ).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining('[AS_OF_INVALID]'),
    });
  });

  it('accepts the truthful empty state through every real command', async () => {
    const root = await createAdapterFixture();
    try {
      const [content, graph, evidence] = await Promise.all([
        runAdapterAt(root, 'scripts/content/validate.mjs'),
        runAdapterAt(root, 'scripts/graph/validate.mjs', {
          ...process.env,
          SBLA_AS_OF: '2026-09-09',
        }),
        runAdapterAt(root, 'scripts/evidence/status.mjs', {
          ...process.env,
          SBLA_AS_OF: '2026-09-09',
        }),
      ]);
      expect(content.stdout).toContain('Content validation passed: 0 records.');
      expect(graph.stdout).toContain(
        'Graph validation passed: 0 nodes checked',
      );
      expect(evidence.stdout).toContain(
        'Evidence status passed: 0 sources checked',
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('allows append-only Markdown evidence reviews beside structured review records', async () => {
    const root = await createAdapterFixture();
    try {
      await writeFile(
        path.join(root, 'reviews/evidence/SBLA-008-r1.md'),
        '# Evidence review\n\nVerdict: FAIL.\n',
      );

      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).resolves.toMatchObject({
        stdout: expect.stringContaining(
          'Content validation passed: 0 records.',
        ),
      });

      await writeFile(
        path.join(root, 'reviews/evidence/notes.md'),
        '# Unstructured note\n',
      );
      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining(
          '[RECORD_EXTENSION_UNSUPPORTED] reviews/evidence/notes.md',
        ),
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('keeps unpublished content drafts outside published-record validation', async () => {
    const root = await createAdapterFixture();
    try {
      await Promise.all([
        mkdir(path.join(root, 'content-drafts/exercises'), { recursive: true }),
        mkdir(path.join(root, 'content-drafts/syntheses'), { recursive: true }),
      ]);
      await Promise.all([
        writeFile(
          path.join(root, 'content-drafts/exercises/bench-press.md'),
          '# Unpublished exercise draft\n',
        ),
        writeFile(
          path.join(root, 'content-drafts/syntheses/atomic-claims.json'),
          '{"status":"draft-for-independent-review","claims":[]}\n',
        ),
      ]);

      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).resolves.toMatchObject({
        stdout: expect.stringContaining(
          'Content validation passed: 0 records.',
        ),
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('resolves structured cross-links with exact repository path casing', async () => {
    const root = await createAdapterFixture();
    try {
      await Promise.all([
        mkdir(path.join(root, 'content-drafts/syntheses'), { recursive: true }),
        mkdir(path.join(root, 'research/searches'), { recursive: true }),
      ]);
      await Promise.all([
        writeFile(
          path.join(root, 'research/searches/search-receipts.json'),
          '{}\n',
        ),
        writeFile(
          path.join(root, 'content-drafts/syntheses/atomic-claims.json'),
          `${JSON.stringify(
            {
              crossLinks: {
                searchReceipts: 'research/searches/SEARCH-receipts.json@1.0.0',
              },
            },
            null,
            2,
          )}\n`,
        ),
      ]);

      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('[CROSS_LINK_CASE_MISMATCH]'),
      });

      await writeFile(
        path.join(root, 'content-drafts/syntheses/atomic-claims.json'),
        `${JSON.stringify(
          {
            crossLinks: {
              searchReceipts: 'research/searches/search-receipts.json@1.0.0',
            },
          },
          null,
          2,
        )}\n`,
      );

      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).resolves.toMatchObject({
        stdout: expect.stringContaining(
          'Content validation passed: 0 records.',
        ),
      });

      await writeFile(
        path.join(root, 'content-drafts/syntheses/atomic-claims.json'),
        `${JSON.stringify(
          {
            nested: {
              crossLinks: {
                searchReceipts: 'research/searches/missing.json@1.0.0',
              },
            },
          },
          null,
          2,
        )}\n`,
      );
      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('[CROSS_LINK_TARGET_MISSING]'),
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('reports malformed syntax and unsupported extensions with remediation', async () => {
    const root = await createAdapterFixture();
    try {
      await Promise.all([
        writeFile(path.join(root, 'content/claims/broken.json'), '{'),
        writeFile(
          path.join(root, 'content/sources/source.txt'),
          'not a record\n',
        ),
      ]);
      await expect(
        runAdapterAt(root, 'scripts/content/validate.mjs'),
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringMatching(
          /\[RECORD_PARSE_FAILED\][\s\S]*\[RECORD_EXTENSION_UNSUPPORTED\][\s\S]*Remediation:/,
        ),
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('rejects missing graph references through the graph subprocess', async () => {
    const root = await createAdapterFixture();
    try {
      const fixtures = JSON.parse(
        await readFile(
          path.join(
            repositoryRoot,
            'tests/fixtures/evidence-schemas/records.valid.json',
          ),
          'utf8',
        ),
      ) as { claim: { id: string }; source: { id: string } };
      await Promise.all([
        writeFile(
          path.join(root, `content/claims/${fixtures.claim.id}.json`),
          `${JSON.stringify(fixtures.claim, null, 2)}\n`,
        ),
        writeFile(
          path.join(root, `content/sources/${fixtures.source.id}.json`),
          `${JSON.stringify(fixtures.source, null, 2)}\n`,
        ),
      ]);
      await expect(
        runAdapterAt(root, 'scripts/graph/validate.mjs', {
          ...process.env,
          SBLA_AS_OF: '2026-09-09',
        }),
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('[REFERENCE_MISSING]'),
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('rejects a retracted source through the evidence-status subprocess', async () => {
    const root = await createAdapterFixture();
    try {
      const fixtures = JSON.parse(
        await readFile(
          path.join(
            repositoryRoot,
            'tests/fixtures/evidence-schemas/records.valid.json',
          ),
          'utf8',
        ),
      ) as { source: { id: string; publication: { status: string } } };
      fixtures.source.publication.status = 'retracted';
      await writeFile(
        path.join(root, `content/sources/${fixtures.source.id}.json`),
        `${JSON.stringify(fixtures.source, null, 2)}\n`,
      );
      await expect(
        runAdapterAt(root, 'scripts/evidence/status.mjs', {
          ...process.env,
          SBLA_AS_OF: '2026-09-09',
        }),
      ).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining('[SOURCE_RETRACTED]'),
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
