import { createHash } from 'node:crypto';
import {
  copyFile,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

const conversionPath = resolve(
  'docs/licenses/bodyparts3d-conversion-manifest.json',
);
const scriptPath = resolve('scripts/assets/blender/convert.py');
const receiptPath = resolve(
  'docs/licenses/bodyparts3d-conversion-baseline-receipt.json',
);
const receiptCommit = '0f118314ae602777752370ec6d0a5bd69bfa5a54';
type ArtifactFinals = { glb: string; poster: string; manifest: string };
type MutableGlbDocument = {
  nodes: Array<{ translation?: number[] }>;
  materials: Array<{
    pbrMetallicRoughness: { baseColorFactor: number[] };
  }>;
  meshes: Array<{
    primitives: Array<{ attributes: { POSITION: number }; indices: number }>;
  }>;
  accessors: Array<{
    max: number[];
    count: number;
    normalized?: boolean;
    sparse?: object;
    type?: string;
    componentType?: number;
  }>;
};

async function conversionManifest() {
  return JSON.parse(await readFile(conversionPath, 'utf8'));
}

async function transactionFixture() {
  const root = await mkdtemp(resolve(tmpdir(), 'sbla005-transaction-'));
  const outputDir = resolve(root, 'assets', 'derived', 'bodyparts3d');
  const manifestPath = resolve(
    root,
    'docs',
    'licenses',
    'bodyparts3d-conversion-manifest.json',
  );
  await mkdir(outputDir, { recursive: true });
  await mkdir(resolve(root, 'docs', 'licenses'), { recursive: true });
  const finals = {
    glb: resolve(outputDir, 'sbla005-representative.glb'),
    poster: resolve(outputDir, 'sbla005-poster.webp'),
    manifest: manifestPath,
  };
  await Promise.all([
    writeFile(finals.glb, 'old-glb'),
    writeFile(finals.poster, 'old-poster'),
    writeFile(finals.manifest, 'old-manifest'),
  ]);
  return { root, outputDir, manifestPath, finals };
}

function runTransactionProbe(
  outputDir: string,
  manifestPath: string,
  failure: string,
) {
  return spawnSync(
    'python3',
    [
      scriptPath,
      '--transaction-probe',
      '--output-dir',
      outputDir,
      '--manifest',
      manifestPath,
      '--failure',
      failure,
    ],
    { encoding: 'utf8' },
  );
}

function runPolicyProbe(args: string[]) {
  return spawnSync(
    'python3',
    [scriptPath, '--publication-policy-probe', ...args],
    {
      encoding: 'utf8',
    },
  );
}

function sha256(bytes: Buffer | string) {
  return createHash('sha256').update(bytes).digest('hex');
}

function runBaselineAuthProbe(args: string[]) {
  return spawnSync('python3', [scriptPath, '--baseline-auth-probe', ...args], {
    encoding: 'utf8',
  });
}

function runRawGlbProbe(glb: string) {
  return spawnSync(
    'python3',
    [scriptPath, '--raw-glb-probe', '--glb', glb, '--manifest', conversionPath],
    { encoding: 'utf8' },
  );
}

function runReceiptProbe(commit: string, workingBytes?: string) {
  const args = [
    scriptPath,
    '--receipt-probe',
    '--baseline-receipt',
    receiptPath,
    '--baseline-receipt-commit',
    commit,
  ];
  if (workingBytes) args.push('--working-bytes-override', workingBytes);
  return spawnSync('python3', args, { encoding: 'utf8' });
}

async function mutateGlb(
  source: string,
  destination: string,
  mutate: (document: MutableGlbDocument) => void,
) {
  const original = await readFile(source);
  const jsonLength = original.readUInt32LE(12);
  const document = JSON.parse(
    original
      .subarray(20, 20 + jsonLength)
      .toString('utf8')
      .trimEnd(),
  ) as MutableGlbDocument;
  mutate(document);
  const encoded = Buffer.from(JSON.stringify(document), 'utf8');
  const paddedLength = Math.ceil(encoded.length / 4) * 4;
  const jsonChunk = Buffer.alloc(paddedLength, 0x20);
  encoded.copy(jsonChunk);
  const remainder = original.subarray(20 + jsonLength);
  const rebuilt = Buffer.alloc(20 + paddedLength + remainder.length);
  original.copy(rebuilt, 0, 0, 12);
  rebuilt.writeUInt32LE(rebuilt.length, 8);
  rebuilt.writeUInt32LE(paddedLength, 12);
  rebuilt.writeUInt32LE(0x4e4f534a, 16);
  jsonChunk.copy(rebuilt, 20);
  remainder.copy(rebuilt, 20 + paddedLength);
  await writeFile(destination, rebuilt);
}

async function baselineFixture() {
  const fixture = await transactionFixture();
  await copyFile(
    resolve('assets/derived/bodyparts3d/sbla005-representative.glb'),
    fixture.finals.glb,
  );
  await copyFile(
    resolve('assets/derived/bodyparts3d/sbla005-poster.webp'),
    fixture.finals.poster,
  );
  const glb = await readFile(fixture.finals.glb);
  const poster = await readFile(fixture.finals.poster);
  const manifest = {
    publication: { status: 'baseline-unpublished', commitMarker: null },
    runIdentity: {
      runId: '4c6426ea-7971-4c6d-9042-cac0483bcf9e',
      createdAt: '2026-09-07T12:00:00Z',
      mode: 'baseline-unpublished',
      tool: {
        versionString: '4.5.13 LTS',
        distributionSha256:
          '663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53',
      },
      source: {
        mappingSha256:
          'b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196',
      },
    },
    tool: {
      officialDistribution: {
        sha256:
          '663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53',
      },
      runtime: { version: [4, 5, 13], versionString: '4.5.13 LTS' },
    },
    source: {
      mappingManifest: {
        sha256:
          'b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196',
      },
    },
    artifacts: {
      glb: {
        path: fixture.finals.glb,
        bytes: glb.length,
        sha256: sha256(glb),
      },
      poster: {
        path: fixture.finals.poster,
        bytes: poster.length,
        sha256: sha256(poster),
      },
    },
  };
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  await writeFile(fixture.finals.manifest, serialized);
  return { ...fixture, expectedHash: sha256(serialized) };
}

async function expectOldFinals(finals: ArtifactFinals) {
  await expect(readFile(finals.glb, 'utf8')).resolves.toBe('old-glb');
  await expect(readFile(finals.poster, 'utf8')).resolves.toBe('old-poster');
  await expect(readFile(finals.manifest, 'utf8')).resolves.toBe('old-manifest');
}

async function expectNoTransactionDebris(root: string, outputDir: string) {
  expect(
    (await readdir(resolve(outputDir, '..'))).filter((entry) =>
      entry.startsWith('.sbla005-conversion-stage-'),
    ),
  ).toEqual([]);
  expect(
    (await readdir(resolve(root, 'docs', 'licenses'))).filter((entry) =>
      entry.startsWith('.bodyparts3d-conversion.lock'),
    ),
  ).toEqual([]);
}

describe('BodyParts3D deterministic conversion contract', () => {
  it('pins the Blender tool and source mapping before conversion', async () => {
    const manifest = await conversionManifest();
    expect(manifest.tool.officialDistribution).toEqual({
      format: 'official macOS DMG',
      sha256:
        '663ce944257c61ff1d6aa09e15c8f57bbd8d59023adb2fa7edde33a9ed960b53',
    });
    expect(manifest.tool.runtime).toEqual({
      version: [4, 5, 13],
      versionString: '4.5.13 LTS',
    });
    expect(manifest.source.mappingManifest).toMatchObject({
      path: 'docs/licenses/bodyparts3d-mesh-mapping.json',
      sha256:
        'b10761d2315b15b3f95ade7343df33d63e55f0d313d219fc39056567c3151196',
    });
    expect(manifest.source.archiveInputsStoredInGit).toBe(false);
  });

  it('records deterministic transforms, materials, LODs, camera, light, and object mapping', async () => {
    const manifest = await conversionManifest();
    expect(manifest.normalization).toEqual({
      sourceUnits: 'millimetres',
      outputUnits: 'metres',
      origin: 'world-origin-preserved',
      sourceToBlender: {
        scale: 0.001,
        axisTransform: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        space: 'Blender [x, y, z]',
      },
      blenderToBrowserGltf: {
        transform: '[x, z, -y]',
        space: 'glTF browser Y-up',
      },
    });
    expect(manifest.material).toMatchObject({ name: 'SBLA_Neutral_Review' });
    expect(manifest.lod).toMatchObject({ method: 'fixed-ratio-decimation' });
    expect(manifest.poster.camera).toMatchObject({ type: 'ORTHO' });
    expect(manifest.poster.light).toEqual([
      expect.objectContaining({
        name: 'SBLA005_Key',
        type: 'AREA',
        location: [3, -4, 5],
        energy: 1100,
        shape: 'DISK',
        size: 5,
        color: [1, 1, 1],
        useShadow: true,
      }),
      expect.objectContaining({
        name: 'SBLA005_Fill',
        type: 'AREA',
        location: [-3, -2, 2],
        energy: 550,
        shape: 'DISK',
        size: 5,
        color: [1, 1, 1],
        useShadow: true,
      }),
    ]);
    expect(manifest.objects).toHaveLength(139);
    const manifestNames = manifest.objects.map(
      (entry: { name: string }) => entry.name,
    );
    const decoded = manifest.rawGltfEvidence.objectsEvidence;
    const decodedNames = decoded.map((entry: { name: string }) => entry.name);
    expect(new Set(manifestNames).size).toBe(139);
    expect(new Set(decodedNames).size).toBe(139);
    expect(manifestNames.sort()).toEqual(decodedNames.sort());
    const decodedByName = new Map(
      decoded.map((entry: { name: string; browserBoundsMetres: unknown }) => [
        entry.name,
        entry.browserBoundsMetres,
      ]),
    );
    for (const entry of manifest.objects) {
      expect(entry).toMatchObject({
        name: expect.stringMatching(/^BP3D_/),
        source: {
          fileId: expect.stringMatching(/^FJ\d+M?$/),
          sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
        },
        normalized: {
          entityId: expect.stringMatching(/^FMA\d+$/),
          material: 'SBLA_Neutral_Review',
          boundsMetres: { min: expect.any(Array), max: expect.any(Array) },
        },
        lod: expect.objectContaining({ ratio: expect.any(Number) }),
      });
      expect(entry.normalized.boundsMetres).toEqual(
        decodedByName.get(entry.name),
      );
    }
  });

  it('has reproducible conversion evidence and product—not host—budgets', async () => {
    const manifest = await conversionManifest();
    expect(manifest.determinism).toMatchObject({
      cleanRuns: 2,
      sceneStructureEqual: true,
      decodedGeometryEqual: true,
      boundsEqual: true,
      glbBytesEqual: true,
      posterBytesEqual: true,
      priorArtifactAuthenticated: true,
    });
    expect(manifest.artifacts.glb).toMatchObject({
      path: 'assets/derived/bodyparts3d/sbla005-representative.glb',
      desktopTargetBytes: 6_000_000,
      hardCeilingBytes: 10_000_000,
      mobileInteractiveBytes: 3_000_000,
    });
    expect(manifest.artifacts.poster).toMatchObject({
      path: 'assets/derived/bodyparts3d/sbla005-poster.webp',
      ceilingBytes: 200_000,
    });
    expect(manifest.artifacts.hostPerFileCeilingBytes).toBe(25 * 1024 * 1024);
    expect(manifest.visualInspection).toMatchObject({
      holes: expect.any(String),
      invertedNormals: expect.any(String),
      lostComponents: expect.any(String),
      material: expect.any(String),
      occlusion: expect.any(String),
      proportions: expect.any(String),
    });
    expect(manifest.visualInspection.normalWinding).toMatchObject({
      method: 'decoded-glb-local-winding-plus-closed-signed-volume',
      zeroAreaFaces: 0,
      sameDirectionSharedEdges: 0,
    });
    expect(manifest.visualInspection.normalWinding.openInconclusive).toBe(139);
    expect(manifest.visualInspection.normalWinding.closedInward).toBe(0);
    expect(manifest.publication).toEqual({
      status: 'published-release',
      semantics:
        'Transaction-style manifest-last promotion with rollback; not kernel-atomic across directories.',
      commitMarker: 'docs/licenses/bodyparts3d-conversion-manifest.json',
      consumerAcceptance:
        'Consumers accept the GLB and poster only when their bytes match the SHA-256 identities in the committed manifest.',
    });
    expect(manifest.authenticatedBaseline).toMatchObject({
      manifestSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      runId: expect.stringMatching(/^[a-f0-9-]{36}$/),
      createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      receipt: {
        commit: receiptCommit,
        blob: expect.stringMatching(/^[a-f0-9]{40}$/),
        sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      },
      snapshotFlow:
        'Manifest, GLB, and poster were each read once; authentication and comparison used those same private snapshot bytes.',
    });
    expect(manifest.rawGltfEvidence.boundsComparison).toMatchObject({
      semantics: 'triangle-referenced POSITION vertices only',
      toleranceMetres: expect.any(Number),
      maximumObservedDeltaMetres: expect.any(Number),
    });
    expect(
      manifest.rawGltfEvidence.boundsComparison.toleranceMetres,
    ).toBeLessThan(0.00001);
    expect(manifest.tool.runtimeProvenance).toEqual({
      platform: 'macOS arm64',
      executableSha256:
        '49fa4d4694f55b37b58b18d99a71bdc8228d30545caa2e16c9f99952f4c76f55',
      codeSignature: {
        identifier: 'org.blenderfoundation.blender',
        teamIdentifier: '68UA947AUU',
        authority:
          'Developer ID Application: Stichting Blender Foundation (68UA947AUU)',
        cdHashFullSha256:
          'e1603c3bd5b6af74898ea9f53fc668eb02a3979c3f1ceb5b708687c42e7fd8fd',
      },
      limitation:
        'Pinned and publisher-authenticated only for the verified macOS arm64 pipeline.',
    });
  });

  it('keeps the conversion command fully scripted with no manual steps', async () => {
    const script = await readFile(scriptPath, 'utf8');
    expect(script).toContain('BLENDER_VERSION = "4.5.13"');
    expect(script).toContain('bpy.app.version');
    expect(script).toContain('bpy.app.version_string');
    expect(script).toContain('--compare-glb');
    expect(script).toContain('--compare-poster');
    expect(script).toContain('--compare-manifest-sha256');
    expect(script).toContain('--baseline-receipt');
    expect(script).toContain('--baseline-receipt-commit');
    expect(script).toContain('strict ancestor');
    expect(script).toContain('same private snapshot bytes');
    expect(script).toContain('decoded_glb_structure');
    expect(script).toContain('closed-signed-volume');
    expect(script).toContain('deterministic conversion comparison failed');
    expect(script).toContain('sys.exit(1)');
    expect(script).toContain('bodyparts3d-mesh-mapping.json');
    expect(script).toContain('export_scene.gltf');
    expect(script).toContain("file_format='WEBP'");
    expect(script).not.toMatch(/manual step|required manual/i);
  });

  it('binds the checked-in artifacts to their recorded SHA-256 identities', async () => {
    const manifest = await conversionManifest();
    for (const artifact of [
      manifest.artifacts.glb,
      manifest.artifacts.poster,
    ]) {
      const bytes = await readFile(resolve(artifact.path));
      expect(bytes.byteLength).toBe(artifact.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(
        artifact.sha256,
      );
      expect(bytes.byteLength).toBeLessThanOrEqual(
        artifact.ceilingBytes ?? artifact.hardCeilingBytes,
      );
    }
  });

  it('leaves all existing finals byte-identical when staged validation fails', async () => {
    const fixture = await transactionFixture();
    const result = runTransactionProbe(
      fixture.outputDir,
      fixture.manifestPath,
      'validation',
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('forced staged validation failure');
    await expectOldFinals(fixture.finals);
    await expectNoTransactionDebris(fixture.root, fixture.outputDir);
    await rm(fixture.root, { recursive: true });
  });

  it('rolls back every final and removes debris after a mid-promotion failure', async () => {
    const fixture = await transactionFixture();
    const result = runTransactionProbe(
      fixture.outputDir,
      fixture.manifestPath,
      'after-glb',
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('forced promotion failure after GLB');
    await expectOldFinals(fixture.finals);
    await expectNoTransactionDebris(fixture.root, fixture.outputDir);
    await rm(fixture.root, { recursive: true });
  });

  it('rejects lock contention without altering accepted finals', async () => {
    const fixture = await transactionFixture();
    await mkdir(
      resolve(fixture.root, 'docs', 'licenses', '.bodyparts3d-conversion.lock'),
    );
    const result = runTransactionProbe(
      fixture.outputDir,
      fixture.manifestPath,
      'none',
    );
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'conversion promotion lock is already held',
    );
    await expectOldFinals(fixture.finals);
    await rm(fixture.root, { recursive: true });
  });

  it('refuses a normal publication without all authenticated comparison inputs', async () => {
    const fixture = await transactionFixture();
    const result = runPolicyProbe([
      '--output-dir',
      fixture.outputDir,
      '--manifest',
      fixture.manifestPath,
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'release publication requires prior manifest, GLB, and poster',
    );
    await expectOldFinals(fixture.finals);
    await rm(fixture.root, { recursive: true });
  });

  it('permits an external baseline but rejects accepted release locations', async () => {
    const fixture = await transactionFixture();
    const external = runPolicyProbe([
      '--baseline-only',
      '--output-dir',
      fixture.outputDir,
      '--manifest',
      fixture.manifestPath,
    ]);
    expect(external.status).toBe(0);
    expect(external.stdout).toContain('baseline-unpublished');

    const accepted = runPolicyProbe([
      '--baseline-only',
      '--output-dir',
      resolve('assets/derived/bodyparts3d'),
      '--manifest',
      conversionPath,
    ]);
    expect(accepted.status).toBe(1);
    expect(accepted.stderr).toContain(
      'baseline-only outputs must remain outside the repository',
    );
    await rm(fixture.root, { recursive: true });
  });

  it('rejects copied artifacts paired with a freshly forged baseline manifest', async () => {
    const fixture = await baselineFixture();
    const result = runBaselineAuthProbe([
      '--compare-manifest',
      fixture.finals.manifest,
      '--compare-manifest-sha256',
      '0'.repeat(64),
      '--compare-glb',
      fixture.finals.glb,
      '--compare-poster',
      fixture.finals.poster,
      '--current-output-dir',
      resolve('assets/derived/bodyparts3d'),
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'baseline manifest does not match the caller-supplied SHA-256 trust anchor',
    );
    await rm(fixture.root, { recursive: true });
  });

  it('rejects a baseline manifest changed after its trust anchor was recorded', async () => {
    const fixture = await baselineFixture();
    await writeFile(fixture.finals.manifest, '{"tampered":true}\n');
    const result = runBaselineAuthProbe([
      '--compare-manifest',
      fixture.finals.manifest,
      '--compare-manifest-sha256',
      fixture.expectedHash,
      '--compare-glb',
      fixture.finals.glb,
      '--compare-poster',
      fixture.finals.poster,
      '--current-output-dir',
      resolve('assets/derived/bodyparts3d'),
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'baseline manifest does not match the caller-supplied SHA-256 trust anchor',
    );
    await rm(fixture.root, { recursive: true });
  });

  it('authenticates an intact independently identified baseline', async () => {
    const fixture = await baselineFixture();
    const result = runBaselineAuthProbe([
      '--compare-manifest',
      fixture.finals.manifest,
      '--compare-manifest-sha256',
      fixture.expectedHash,
      '--compare-glb',
      fixture.finals.glb,
      '--compare-poster',
      fixture.finals.poster,
      '--current-output-dir',
      resolve('assets/derived/bodyparts3d'),
    ]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('4c6426ea-7971-4c6d-9042-cac0483bcf9e');
    await rm(fixture.root, { recursive: true });
  });

  it('rejects non-identity selectable-node transforms in raw GLB metadata', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'sbla005-glb-'));
    const mutated = resolve(root, 'translated.glb');
    await mutateGlb(
      resolve('assets/derived/bodyparts3d/sbla005-representative.glb'),
      mutated,
      (document) => {
        document.nodes[0]!.translation = [0.005, 0, 0];
      },
    );
    const result = runRawGlbProbe(mutated);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'selectable node transform must be identity',
    );
    await rm(root, { recursive: true });
  });

  it('rejects a raw GLB material color that differs from the declared material', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'sbla005-glb-'));
    const mutated = resolve(root, 'material.glb');
    await mutateGlb(
      resolve('assets/derived/bodyparts3d/sbla005-representative.glb'),
      mutated,
      (document) => {
        document.materials[0]!.pbrMetallicRoughness.baseColorFactor[0] = 0.42;
      },
    );
    const result = runRawGlbProbe(mutated);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('raw GLB material does not match');
    await rm(root, { recursive: true });
  });

  it('rejects five-millimetre accessor-bound drift', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'sbla005-glb-'));
    const mutated = resolve(root, 'bounds.glb');
    await mutateGlb(
      resolve('assets/derived/bodyparts3d/sbla005-representative.glb'),
      mutated,
      (document) => {
        const position = document.meshes[0]!.primitives[0]!.attributes.POSITION;
        const accessor = document.accessors[position]!;
        accessor.max[0] = accessor.max[0]! + 0.005;
      },
    );
    const result = runRawGlbProbe(mutated);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'raw GLB POSITION bounds differ from triangle-referenced geometry',
    );
    await rm(root, { recursive: true });
  });

  it('rejects a triangle index count that is not divisible by three', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'sbla005-glb-'));
    const mutated = resolve(root, 'index-count.glb');
    await mutateGlb(
      resolve('assets/derived/bodyparts3d/sbla005-representative.glb'),
      mutated,
      (document) => {
        const primitive = document.meshes[0]!.primitives[0]!;
        document.accessors[primitive.indices]!.count = 1370;
      },
    );
    const result = runRawGlbProbe(mutated);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      'triangle index accessor count must be positive and divisible by three',
    );
    await rm(root, { recursive: true });
  });

  it('rejects malformed triangle index accessor declarations', async () => {
    const root = await mkdtemp(resolve(tmpdir(), 'sbla005-glb-'));
    const source = resolve(
      'assets/derived/bodyparts3d/sbla005-representative.glb',
    );
    const cases: Array<{
      name: string;
      mutate: (accessor: MutableGlbDocument['accessors'][number]) => void;
      message: string;
    }> = [
      {
        name: 'normalized',
        mutate: (accessor) => {
          accessor.normalized = true;
        },
        message: 'triangle index accessor must be non-normalized SCALAR',
      },
      {
        name: 'vector',
        mutate: (accessor) => {
          accessor.type = 'VEC3';
        },
        message: 'triangle index accessor must be non-normalized SCALAR',
      },
      {
        name: 'signed',
        mutate: (accessor) => {
          accessor.componentType = 5122;
        },
        message:
          'triangle index accessor component type must be unsigned integer',
      },
      {
        name: 'sparse',
        mutate: (accessor) => {
          accessor.sparse = {};
        },
        message: 'triangle index accessor must not be sparse',
      },
    ];
    for (const malformed of cases) {
      const mutated = resolve(root, `${malformed.name}.glb`);
      await mutateGlb(source, mutated, (document) => {
        const primitive = document.meshes[0]!.primitives[0]!;
        malformed.mutate(document.accessors[primitive.indices]!);
      });
      const result = runRawGlbProbe(mutated);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(malformed.message);
    }
    await rm(root, { recursive: true });
  });

  it('requires a genuine strict-ancestor baseline receipt', async () => {
    expect(runReceiptProbe('0'.repeat(40)).status).toBe(1);
    const currentHead = spawnSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).stdout.trim();
    const nonAncestor = runReceiptProbe(currentHead);
    expect(nonAncestor.status).toBe(1);
    expect(nonAncestor.stderr).toContain('strict ancestor');

    const root = await mkdtemp(resolve(tmpdir(), 'sbla005-receipt-'));
    const tampered = resolve(root, 'tampered.json');
    await writeFile(tampered, '{"tampered":true}\n');
    const changed = runReceiptProbe(receiptCommit, tampered);
    expect(changed.status).toBe(1);
    expect(changed.stderr).toContain(
      'receipt bytes differ from the committed Git blob',
    );
    await rm(root, { recursive: true });

    const genuine = runReceiptProbe(receiptCommit);
    expect(genuine.status).toBe(0);
    expect(genuine.stdout).toContain('pre-release-commitment');
  });
});
