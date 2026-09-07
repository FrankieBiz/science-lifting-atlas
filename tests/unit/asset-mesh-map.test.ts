import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

import {
  buildMeshMapping,
  MESH_TARGETS,
  parseElementParts,
  parseInclusionRelations,
  parseObj,
  parsePartsList,
  stableJson,
  validateBytes,
  validateUniqueIds,
} from '../../scripts/assets/mesh-map.mjs';

describe('BodyParts3D mesh mapping', () => {
  it('defines all 28 master-plan targets with unique explicit components', () => {
    expect(MESH_TARGETS).toHaveLength(28);
    expect(new Set(MESH_TARGETS.map((entry) => entry.id)).size).toBe(28);
    for (const target of MESH_TARGETS) {
      expect(new Set(target.components.map((entry) => entry.id)).size).toBe(
        target.components.length,
      );
      for (const entry of target.components) {
        expect(entry.conceptId).toMatch(/^FMA\d+$/);
      }
    }
  });

  it('parses the three official metadata schemas', () => {
    expect(
      parsePartsList(
        'concept id\trepresentation id\ten\nFMA1\tBP1\tMuscle one\n',
        'fixture',
      ),
    ).toEqual([
      { conceptId: 'FMA1', representationId: 'BP1', name: 'Muscle one' },
    ]);
    expect(
      parseElementParts(
        'concept id\tname\telement file id\nFMA1\tMuscle one\tFJ1\n',
        'fixture',
      ),
    ).toEqual([{ conceptId: 'FMA1', name: 'Muscle one', fileId: 'FJ1' }]);
    expect(
      parseInclusionRelations(
        'parent id\tparent name\tchild id\tchild name\nFMA1\tMuscle one\tFMA2\tRight muscle one\n',
        'fixture',
      ),
    ).toEqual([
      {
        parentId: 'FMA1',
        parentName: 'Muscle one',
        childId: 'FMA2',
        childName: 'Right muscle one',
      },
    ]);
  });

  it('rejects malformed schemas and duplicate concept or representation IDs', () => {
    expect(() => parsePartsList('wrong\theader\n', 'fixture')).toThrow(
      /schema/i,
    );
    expect(() =>
      validateUniqueIds([
        { conceptId: 'FMA1', representationId: 'BP1', name: 'one' },
        { conceptId: 'FMA1', representationId: 'BP2', name: 'two' },
      ]),
    ).toThrow(/duplicate concept/i);
    expect(() =>
      validateUniqueIds([
        { conceptId: 'FMA1', representationId: 'BP1', name: 'one' },
        { conceptId: 'FMA2', representationId: 'BP1', name: 'two' },
      ]),
    ).toThrow(/duplicate representation/i);
  });

  it('rejects bytes whose pinned size or SHA-256 identity changed', () => {
    const bytes = Buffer.from('official');
    expect(() =>
      validateBytes(
        bytes,
        'fixture',
        8,
        '6896191a14f6c66534bac457f50996b9330cd702cb6dbaae4c08d1d213e93d98',
      ),
    ).not.toThrow();
    expect(() => validateBytes(bytes, 'fixture', 9, 'unused')).toThrow(/bytes/);
    expect(() => validateBytes(bytes, 'fixture', 8, 'wrong')).toThrow(
      /SHA-256/,
    );
  });

  it('computes exact vertex bounds separately from rounded source header bounds', () => {
    const text = [
      '# File ID : FJ1',
      '# Representation ID : BP2',
      '# Build-up logic : FMA 3.0 is_a',
      '# Concept ID : FMA2',
      '# English name : Right muscle one',
      '# Bounds(mm): (-1.500000,-2.500000,-3.500000)-(10.000000,11.000000,12.000000)',
      'v -1 -2 -3',
      'v 4 5 6',
      'v 0 0 0',
      'v 1 1 1',
      'f 1//1 2//2 3//3 4//4',
      '',
    ].join('\n');
    const parsed = parseObj(Buffer.from(text));
    expect(parsed).toMatchObject({
      fileId: 'FJ1',
      representationId: 'BP2',
      conceptId: 'FMA2',
      name: 'Right muscle one',
      buildLogic: 'FMA 3.0 is_a',
      vertices: 4,
      faces: 1,
      triangles: 2,
      geometryBounds: { min: [-1, -2, -3], max: [4, 5, 6] },
      sourceHeaderBounds: {
        min: [-1.5, -2.5, -3.5],
        max: [10, 11, 12],
      },
      boundsMaxAbsoluteDeltaMm: 6,
      bytes: Buffer.byteLength(text),
    });
    expect(parsed.sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('makes the CLI reject an extracted OBJ changed after ZIP verification', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sbla-zip-binding-'));
    const meshDir = join(root, 'extracted');
    await import('node:fs/promises').then(({ mkdir }) => mkdir(meshDir));
    const original = Buffer.from('v 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3\n');
    const archive = storedZip('fixture/FJ1.obj', original);
    const archivePath = join(root, 'fixture.zip');
    await writeFile(archivePath, archive);
    await writeFile(join(meshDir, 'FJ1.obj'), original);
    const args = [
      resolve('scripts/assets/mesh-map.mjs'),
      '--verify-extraction-only',
      '--archive',
      archivePath,
      '--expected-bytes',
      String(archive.byteLength),
      '--expected-sha256',
      createHash('sha256').update(archive).digest('hex'),
      '--mesh-dir',
      meshDir,
      '--entry-prefix',
      'fixture/',
      '--expected-obj-files',
      '1',
    ];
    const execute = promisify(execFile);
    await expect(execute(process.execPath, args)).resolves.toMatchObject({
      stdout: expect.stringContaining('"verifiedObjFiles":1'),
    });

    const tampered = Buffer.from(original);
    tampered[tampered.indexOf('1 0 0')] = '2'.charCodeAt(0);
    await writeFile(join(meshDir, 'FJ1.obj'), tampered);
    await expect(execute(process.execPath, args)).rejects.toMatchObject({
      stderr: expect.stringMatching(/FJ1.*do not match.*ZIP/i),
    });
  });

  it('maps a target through descendants to exact mesh identities', async () => {
    const meshDir = await mkdtemp(join(tmpdir(), 'sbla-mesh-map-'));
    await writeFile(
      join(meshDir, 'FJ1.obj'),
      [
        '# File ID : FJ1',
        '# Representation ID : BP2',
        '# Build-up logic : FMA 3.0 is_a',
        '# Concept ID : FMA2',
        '# English name : Right muscle one',
        '# Bounds(mm): (0,0,0)-(1,1,1)',
        'v 0 0 0',
        'v 1 0 0',
        'v 0 1 0',
        'f 1 2 3',
        '',
      ].join('\n'),
    );
    const result = await buildMeshMapping({
      targetDefinitions: [
        {
          id: 'muscle-one',
          label: 'muscle one',
          components: [
            { id: 'muscle-one', conceptId: 'FMA1', name: 'Muscle one' },
          ],
        },
      ],
      parts: [
        { conceptId: 'FMA1', representationId: 'BP1', name: 'Muscle one' },
        {
          conceptId: 'FMA2',
          representationId: 'BP2',
          name: 'Right muscle one',
        },
      ],
      elements: [
        { conceptId: 'FMA1', name: 'Muscle one', fileId: 'FJ1' },
        { conceptId: 'FMA2', name: 'Right muscle one', fileId: 'FJ1' },
      ],
      relations: [
        {
          parentId: 'FMA1',
          parentName: 'Muscle one',
          childId: 'FMA2',
          childName: 'Right muscle one',
        },
      ],
      meshDir,
      buildLogic: 'FMA 3.0 is_a',
    });
    expect(result.present).toBe(1);
    expect(result.targets.at(0)!.components.at(0)!.meshes.at(0)).toMatchObject({
      conceptId: 'FMA2',
      representationId: 'BP2',
      fileId: 'FJ1',
    });
  });

  it('rejects missing OBJ files and tampered header identities', async () => {
    const meshDir = await mkdtemp(join(tmpdir(), 'sbla-mesh-map-'));
    const input = {
      targetDefinitions: [
        {
          id: 'one',
          label: 'one',
          components: [{ id: 'one', conceptId: 'FMA1', name: 'One' }],
        },
      ],
      parts: [{ conceptId: 'FMA1', representationId: 'BP1', name: 'One' }],
      elements: [{ conceptId: 'FMA1', name: 'One', fileId: 'FJ1' }],
      relations: [],
      meshDir,
      buildLogic: 'FMA 3.0 is_a',
    };
    await expect(buildMeshMapping(input)).rejects.toThrow(/missing.*FJ1/i);

    await writeFile(
      join(meshDir, 'FJ1.obj'),
      '# File ID : FJ1\n# Representation ID : WRONG\n# Build-up logic : FMA 3.0 is_a\n# Concept ID : FMA1\n# English name : One\n# Bounds(mm): (0,0,0)-(1,1,1)\nv 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3\n',
    );
    await expect(buildMeshMapping(input)).rejects.toThrow(
      /representation.*WRONG.*BP1/i,
    );
  });

  it('rejects incomplete components and duplicate element mappings', async () => {
    const meshDir = await mkdtemp(join(tmpdir(), 'sbla-mesh-map-'));
    const base = {
      targetDefinitions: [
        {
          id: 'one',
          label: 'one',
          components: [{ id: 'one', conceptId: 'FMA1', name: 'One' }],
        },
      ],
      parts: [{ conceptId: 'FMA1', representationId: 'BP1', name: 'One' }],
      relations: [],
      meshDir,
      buildLogic: 'FMA 3.0 is_a',
    };
    await expect(buildMeshMapping({ ...base, elements: [] })).rejects.toThrow(
      /no mapped meshes/i,
    );
    await expect(
      buildMeshMapping({
        ...base,
        elements: [
          { conceptId: 'FMA1', name: 'One', fileId: 'FJ1' },
          { conceptId: 'FMA1', name: 'One', fileId: 'FJ1' },
        ],
      }),
    ).rejects.toThrow(/duplicate element mapping/i);
  });

  it('serializes mappings with stable key and array ordering', async () => {
    const first = await stableJson({
      z: 1,
      targets: [{ id: 'b' }, { id: 'a' }],
      a: 2,
    });
    const second = await stableJson({
      a: 2,
      z: 1,
      targets: [{ id: 'a' }, { id: 'b' }],
    });
    expect(first).toBe(second);
    expect(first.indexOf('"a"')).toBeLessThan(first.indexOf('"z"'));
  });

  it('keeps the checked-in full mapping complete and evidence-backed', async () => {
    const manifest = JSON.parse(
      await readFile('docs/licenses/bodyparts3d-mesh-mapping.json', 'utf8'),
    );
    expect(manifest.coverage).toMatchObject({
      required: 28,
      present: 23,
      absent: 5,
      selectedMeshes: 139,
    });
    expect(manifest.coverage.absentIds).toEqual([
      'latissimus-dorsi',
      'rectus-abdominis',
      'internal-oblique',
      'transversus-abdominis',
      'multifidus',
    ]);
    for (const target of manifest.coverage.targets.filter(
      (entry: { present: boolean }) => entry.present,
    )) {
      for (const mappedComponent of target.components) {
        expect(mappedComponent.meshes.length).toBeGreaterThan(0);
        for (const mesh of mappedComponent.meshes) {
          expect(mesh).toMatchObject({
            buildLogic: 'FMA 3.0 is_a',
            bytes: expect.any(Number),
            triangles: expect.any(Number),
            sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
          });
          expect(mesh.conceptId).toMatch(/^FMA\d+$/);
          expect(mesh.representationId).toMatch(/^BP\d+$/);
          expect(mesh.fileId).toMatch(/^FJ\d+M?$/);
        }
      }
    }
  });
});

function storedZip(name: string, data: Buffer) {
  const filename = Buffer.from(name);
  const checksum = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(0, 8);
  local.writeUInt32LE(checksum, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(filename.length, 26);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(0, 10);
  central.writeUInt32LE(checksum, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(filename.length, 28);

  const centralOffset = local.length + filename.length + data.length;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(central.length + filename.length, 12);
  end.writeUInt32LE(centralOffset, 16);
  return Buffer.concat([local, filename, data, central, filename, end]);
}

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1)
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}
