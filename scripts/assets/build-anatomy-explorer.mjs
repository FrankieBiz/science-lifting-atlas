import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { MeshoptSimplifier } from 'meshoptimizer';

/** @typedef {{id:string,name:string,chunk:number,vertexCount:number,indexCount:number,positions:number,normals:number,indices:number}} SourcePart */
/** @typedef {{id:string,components:{meshes:{fileId:string}[]}[]}} MappedTarget */

const root = new URL('../../', import.meta.url);
const source = process.argv[process.argv.indexOf('--source') + 1];
if (!source || !process.argv.includes('--source'))
  throw new Error('Pass --source /path/to/Human-Atlas');
const commit = '5bb5713aab18d7fe9380c3339eb09f173491ea06';
if (
  execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim() !== commit
)
  throw new Error('Source revision mismatch');
/** @param {Buffer} data */
const hash = (data) => createHash('sha256').update(data).digest('hex');
const first = JSON.parse(
  await readFile(
    new URL('docs/licenses/bodyparts3d-first-slice-manifest.json', root),
    'utf8',
  ),
);
const sourceHashes = {
  ...first.source.adaptation.files,
  'body-2.bin':
    '4b3acfc35b91e4427eaca0e3be897d33f144354342ae0e52a2328b582ca8bdbe',
  'body-4.bin':
    '0509e6c996fe5b935ace770a5dbf2d83a474330b7e541a844052a080bbf814bb',
  'body-5.bin':
    '32a967198ffed45839968228898f3d246c67f86fb26892c3ae270be30e2f1149',
};
/** @type {Record<string,Buffer>} */
const blobs = {};
for (const [name, expected] of Object.entries(sourceHashes)) {
  const bytes = await readFile(resolve(source, 'public/models', name));
  if (hash(bytes) !== expected)
    throw new Error(`Source checksum mismatch: ${name}`);
  blobs[name] = bytes;
}
/** @param {string} name */
function blob(name) {
  const bytes = blobs[name];
  if (!bytes) throw new Error('Missing source blob: ' + name);
  return bytes;
}
/** @type {{parts:SourcePart[]}} */
const atlas = JSON.parse(blob('atlas.json').toString());
/** @type {{coverage:{targets:MappedTarget[],absentIds:string[]}}} */
const mapping = JSON.parse(
  await readFile(
    new URL('docs/licenses/bodyparts3d-mesh-mapping.json', root),
    'utf8',
  ),
);
const entities = mapping.coverage.targets
  .filter((target) =>
    target.components.some((component) => component.meshes.length),
  )
  .map((target) => ({
    id: target.id,
    name: target.id
      .split('-')
      .map((word) => (word === 'regions' || word === 'heads' ? '' : word))
      .filter(Boolean)
      .join(' ')
      .replace(/^./, (char) => char.toUpperCase()),
    partIds: [
      ...new Set(
        target.components.flatMap((component) =>
          component.meshes.map((mesh) => mesh.fileId),
        ),
      ),
    ].sort(),
  }));
const selectedIds = [
  ...new Set(entities.flatMap((entity) => entity.partIds)),
].sort();
selectedIds.push('FJ2810');
/** @type {{asset:object,scene:number,scenes:{nodes:number[]}[],nodes:object[],meshes:object[],materials:object[],accessors:object[],bufferViews:object[],buffers:object[]}} */
const gltf = {
  asset: {
    version: '2.0',
    generator: 'SBLA anatomy explorer / meshoptimizer 1.2.0',
  },
  scene: 0,
  scenes: [{ nodes: [] }],
  nodes: [],
  meshes: [],
  materials: [],
  accessors: [],
  bufferViews: [],
  buffers: [],
};
/** @type {Buffer[]} */
const chunks = [];
let byteLength = 0;
/** @param {Float32Array | Uint16Array | Uint32Array} array @param {number} target */
function view(array, target) {
  const bytes = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  const id = gltf.bufferViews.length;
  gltf.bufferViews.push({
    buffer: 0,
    byteOffset: byteLength,
    byteLength: bytes.length,
    target,
  });
  chunks.push(bytes);
  const padding = (4 - (bytes.length % 4)) % 4;
  if (padding) chunks.push(Buffer.alloc(padding));
  byteLength += bytes.length + padding;
  return id;
}
await MeshoptSimplifier.ready;
const parts = [];
for (const id of selectedIds) {
  const part = atlas.parts.find((item) => item.id === id);
  if (!part) throw new Error(`Missing mapped part ${id}`);
  const buffer = blob(`body-${part.chunk}.bin`);
  const positions = new Float32Array(part.vertexCount * 3);
  const normals = new Float32Array(part.vertexCount * 3);
  const indices = new Uint32Array(part.indexCount);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = buffer.readFloatLE(part.positions + i * 4);
    normals[i] = buffer.readInt16LE(part.normals + i * 2) / 32767;
  }
  for (let i = 0; i < indices.length; i++)
    indices[i] = buffer.readUInt32LE(part.indices + i * 4);
  const welded = new Map();
  const weldMap = new Uint32Array(part.vertexCount);
  for (let i = 0; i < part.vertexCount; i++) {
    const key = `${positions[i * 3]},${positions[i * 3 + 1]},${positions[i * 3 + 2]}`;
    if (!welded.has(key)) welded.set(key, i);
    weldMap[i] = welded.get(key);
  }
  for (let i = 0; i < indices.length; i++)
    indices[i] = weldMap[indices[i] ?? 0] ?? 0;
  const target = Math.max(12, Math.floor((indices.length * 0.3) / 3) * 3);
  const [simplified, error] = MeshoptSimplifier.simplify(
    indices,
    positions,
    3,
    target,
    0.002,
  );
  const remap = new Map();
  const compactPositions = [],
    compactNormals = [],
    compactIndices = [];
  for (const old of simplified) {
    if (!remap.has(old)) {
      remap.set(old, remap.size);
      compactPositions.push(...positions.subarray(old * 3, old * 3 + 3));
      compactNormals.push(...normals.subarray(old * 3, old * 3 + 3));
    }
    compactIndices.push(remap.get(old));
  }
  const pos = new Float32Array(compactPositions),
    norm = new Float32Array(compactNormals);
  const idx =
    remap.size < 65536
      ? new Uint16Array(compactIndices)
      : new Uint32Array(compactIndices);
  const min = [Infinity, Infinity, Infinity],
    max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i++) {
    min[i % 3] = Math.min(min[i % 3] ?? Infinity, pos[i] ?? Infinity);
    max[i % 3] = Math.max(max[i % 3] ?? -Infinity, pos[i] ?? -Infinity);
  }
  const start = gltf.accessors.length;
  gltf.accessors.push(
    {
      bufferView: view(pos, 34962),
      componentType: 5126,
      count: remap.size,
      type: 'VEC3',
      min,
      max,
    },
    {
      bufferView: view(norm, 34962),
      componentType: 5126,
      count: remap.size,
      type: 'VEC3',
    },
    {
      bufferView: view(idx, 34963),
      componentType: idx.BYTES_PER_ELEMENT === 2 ? 5123 : 5125,
      count: idx.length,
      type: 'SCALAR',
    },
  );
  const index = gltf.meshes.length;
  const isSkin = id === 'FJ2810';
  gltf.materials.push({
    name: id,
    pbrMetallicRoughness: {
      baseColorFactor: isSkin ? [0.64, 0.7, 0.76, 0.12] : [0.68, 0.38, 0.34, 1],
      metallicFactor: 0,
      roughnessFactor: 0.58,
    },
    doubleSided: true,
    ...(isSkin ? { alphaMode: 'BLEND' } : {}),
  });
  gltf.meshes.push({
    name: part.name,
    primitives: [
      {
        attributes: { POSITION: start, NORMAL: start + 1 },
        indices: start + 2,
        material: index,
      },
    ],
  });
  gltf.nodes.push({
    name: part.name,
    mesh: index,
    extras: {
      sourceId: id,
      entityIds: entities
        .filter((entity) => entity.partIds.includes(id))
        .map((entity) => entity.id),
    },
  });
  gltf.scenes[0]?.nodes.push(index);
  parts.push({
    id,
    name: part.name,
    sourceVertices: part.vertexCount,
    vertices: remap.size,
    triangles: idx.length / 3,
    relativeError: error,
  });
}
gltf.buffers.push({ byteLength });
let json = Buffer.from(JSON.stringify(gltf));
json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 32)]);
const header = Buffer.alloc(20);
header.write('glTF');
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + json.length + byteLength, 8);
header.writeUInt32LE(json.length, 12);
header.write('JSON', 16);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(byteLength);
binHeader.write('BIN\0', 4);
const output = Buffer.concat([header, json, binHeader, ...chunks]);
if (output.length >= 3_000_000)
  throw new Error(`Explorer exceeds 3 MB: ${output.length}`);
await writeFile(
  new URL('assets/derived/bodyparts3d/anatomy-explorer.glb', root),
  output,
);
await writeFile(
  new URL('docs/licenses/anatomy-explorer-manifest.json', root),
  JSON.stringify(
    {
      source: {
        ...first.source,
        adaptation: { ...first.source.adaptation, files: sourceHashes },
      },
      model: {
        path: 'assets/derived/bodyparts3d/anatomy-explorer.glb',
        bytes: output.length,
        sha256: hash(output),
      },
      optimization: {
        tool: 'meshoptimizer',
        version: '1.2.0',
        targetRatio: 0.3,
        maximumRelativeError: 0.002,
      },
      entities,
      parts,
      absentEntityIds: mapping.coverage.absentIds,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  `Explorer: ${output.length} bytes; ${entities.length} groups; ${parts.length} parts; ${hash(output)}`,
);
