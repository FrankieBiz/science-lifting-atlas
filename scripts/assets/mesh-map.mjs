import { createHash } from 'node:crypto';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inflateRawSync } from 'node:zlib';

import prettier from 'prettier';

/** @typedef {{conceptId: string, representationId: string, name: string}} PartRow */
/** @typedef {{conceptId: string, name: string, fileId: string}} ElementRow */
/** @typedef {{parentId: string, parentName: string, childId: string, childName: string}} RelationRow */
/** @typedef {{id: string, name: string, conceptId: string}} ComponentSpec */
/** @typedef {{id: string, label: string, components: ComponentSpec[], reason?: string}} TargetSpec */

/** @type {Readonly<Record<string, readonly [number, string]>>} */
const METADATA = Object.freeze({
  'isa_element_parts.txt': [
    1_142_159,
    'a3de74423f943b0d724ae8f59b3a817f87c423a544f8db98113b1980817cbeaf',
  ],
  'isa_inclusion_relation_list.txt': [
    207_664,
    '26e7d818e03a8c909fe09c561f38d0d513423c87681f9450a803bc38f5b07564',
  ],
  'isa_parts_list.txt': [
    302_828,
    'e5f32398b916e259b88b8aabadac347fe4e0d6bcb2b6535a45ec66b5e60b32b5',
  ],
  'isa_parts_list_e.txt': [
    128_086,
    'ab7796deedd49205e77f3609a1cb8c53e2bbee14ecb5c9a6ca05227469780513',
  ],
  'partof_element_parts.txt': [
    651_179,
    '3f5f6df1028eb122b30de77c711597b6bb8e5541658e5985859fd228adbf88ea',
  ],
  'partof_inclusion_relation_list.txt': [
    91_241,
    '1b40738270931e3c1d955ce34e0fce0d8d10d8c5ad543463e40b4b4c0243007c',
  ],
  'partof_parts_list.txt': [
    142_590,
    'dd29cceba270ffaa5d5f53003b1c3284f70a15fba7137bb81f26f176f4bdb5e3',
  ],
  'partof_parts_list_e.txt': [
    59_351,
    '9224080557053e6f1322f1e13ab27f0ecde0db19bb3b505f0631afad230eeebd',
  ],
});

/** @type {Readonly<Record<string, readonly [number, string]>>} */
const ARCHIVES = Object.freeze({
  'isa_BP3D_4.0_obj_99.zip': [
    142_903_898,
    '40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e',
  ],
  'partof_BP3D_4.0_obj_99.zip': [
    64_888_505,
    '9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97',
  ],
});

const KNOWN_SOURCE_EXCLUSIONS = Object.freeze({
  FJ1543: {
    bytes: 103_745,
    sha256: '3dc2e6367ead09b94da4551212a36692ecf56586be7c27d8b5e834d4c32e1fcb',
    reason:
      'Official OBJ header has blank Representation ID, Concept ID, and English name; excluded because exact identity cannot be proven.',
  },
});

/** @param {string} id @param {string} label @param {string} reason @returns {TargetSpec} */
const absent = (id, label, reason) => ({ id, label, components: [], reason });
/** @param {string} id @param {string} name @param {string} conceptId @returns {ComponentSpec} */
const component = (id, name, conceptId) => ({ id, name, conceptId });
/** @param {string} id @param {string} label @param {ComponentSpec[]} components @returns {TargetSpec} */
const target = (id, label, components) => ({ id, label, components });

/** Exact FMA roots whose represented descendants make up each §4.3 target. */
export const MESH_TARGETS = Object.freeze([
  target('pectoralis-major', 'pectoralis major', [
    component('clavicular', 'clavicular part of pectoralis major', 'FMA34687'),
    component(
      'sternocostal',
      'sternocostal part of pectoralis major',
      'FMA34696',
    ),
    component('abdominal', 'abdominal part of pectoralis major', 'FMA34699'),
  ]),
  target('deltoid-regions', 'deltoid regions', [
    component('clavicular', 'clavicular part of deltoid', 'FMA34677'),
    component('acromial', 'acromial part of deltoid', 'FMA34678'),
    component('spinal', 'spinal part of deltoid', 'FMA34679'),
  ]),
  absent(
    'latissimus-dorsi',
    'latissimus dorsi',
    'No matching FMA concept or mesh exists in the checksum-pinned IS-A or PART-OF releases.',
  ),
  target('teres-major', 'teres major', [
    component('teres-major', 'teres major', 'FMA32549'),
  ]),
  target('trapezius-regions', 'trapezius regions', [
    component('ascending', 'ascending part of trapezius', 'FMA32555'),
    component('transverse', 'transverse part of trapezius', 'FMA32556'),
    component('descending', 'descending part of trapezius', 'FMA32557'),
  ]),
  target('rhomboids', 'rhomboids', [
    component('major', 'rhomboid major', 'FMA13379'),
    component('minor', 'rhomboid minor', 'FMA13380'),
  ]),
  target('rotator-cuff', 'rotator cuff muscles', [
    component('supraspinatus', 'supraspinatus', 'FMA9629'),
    component('infraspinatus', 'infraspinatus', 'FMA32546'),
    component('subscapularis', 'subscapularis', 'FMA13413'),
    component('teres-minor', 'teres minor', 'FMA32550'),
  ]),
  target('biceps-brachii', 'biceps brachii', [
    component('short-head', 'short head of biceps brachii', 'FMA37682'),
    component('long-head', 'long head of biceps brachii', 'FMA37683'),
  ]),
  target('brachialis', 'brachialis', [
    component('brachialis', 'brachialis', 'FMA37667'),
  ]),
  target('brachioradialis', 'brachioradialis', [
    component('brachioradialis', 'brachioradialis', 'FMA38485'),
  ]),
  target('triceps-brachii', 'triceps brachii', [
    component('long-head', 'long head of triceps brachii', 'FMA37692'),
    component('medial-head', 'medial head of triceps brachii', 'FMA37693'),
    component('lateral-head', 'lateral head of triceps brachii', 'FMA37694'),
  ]),
  target('forearm-flexors-extensors', 'forearm flexor/extensor groupings', [
    component(
      'anterior-compartment',
      'muscle of anterior compartment of forearm',
      'FMA38456',
    ),
    component(
      'posterior-compartment',
      'muscle of posterior compartment of forearm',
      'FMA38488',
    ),
  ]),
  absent(
    'rectus-abdominis',
    'rectus abdominis',
    'No matching FMA concept or mesh exists in the checksum-pinned IS-A or PART-OF releases.',
  ),
  target('external-oblique', 'external oblique', [
    component('external-oblique', 'external oblique', 'FMA13335'),
  ]),
  absent(
    'internal-oblique',
    'internal oblique',
    'No matching FMA concept or mesh exists in the checksum-pinned IS-A or PART-OF releases.',
  ),
  absent(
    'transversus-abdominis',
    'transversus abdominis',
    'No matching FMA concept or mesh exists in the checksum-pinned IS-A or PART-OF releases.',
  ),
  target('spinal-erectors', 'spinal erector grouping', [
    component('iliocostalis', 'iliocostalis', 'FMA77177'),
    component('longissimus', 'longissimus', 'FMA77178'),
    component('spinalis', 'spinalis', 'FMA77179'),
  ]),
  absent(
    'multifidus',
    'multifidus grouping',
    'No matching FMA concept or mesh exists in the checksum-pinned IS-A or PART-OF releases.',
  ),
  target('gluteus-maximus', 'gluteus maximus', [
    component('gluteus-maximus', 'gluteus maximus', 'FMA22314'),
  ]),
  target('gluteus-medius', 'gluteus medius', [
    component('gluteus-medius', 'gluteus medius', 'FMA22315'),
  ]),
  target('gluteus-minimus', 'gluteus minimus', [
    component('gluteus-minimus', 'gluteus minimus', 'FMA22317'),
  ]),
  target('quadriceps', 'quadriceps components', [
    component('rectus-femoris', 'rectus femoris', 'FMA22430'),
    component('vastus-lateralis', 'vastus lateralis', 'FMA22431'),
    component('vastus-medialis', 'vastus medialis', 'FMA22432'),
    component('vastus-intermedius', 'vastus intermedius', 'FMA22433'),
  ]),
  target('hamstrings', 'hamstring components', [
    component('biceps-femoris-long', 'long head of biceps femoris', 'FMA45887'),
    component(
      'biceps-femoris-short',
      'short head of biceps femoris',
      'FMA45890',
    ),
    component('semitendinosus', 'semitendinosus', 'FMA22357'),
    component('semimembranosus', 'semimembranosus', 'FMA22438'),
  ]),
  target('hip-adductors', 'hip adductor group', [
    component('adductor-longus', 'adductor longus', 'FMA22441'),
    component('adductor-brevis', 'adductor brevis', 'FMA22442'),
    component('adductor-magnus', 'adductor magnus', 'FMA22443'),
  ]),
  target('major-hip-flexors', 'major hip flexors', [
    component('iliacus', 'iliacus', 'FMA22310'),
    component('psoas-major', 'psoas major', 'FMA18060'),
  ]),
  target('gastrocnemius-heads', 'gastrocnemius heads', [
    component('medial-head', 'medial head of gastrocnemius', 'FMA45956'),
    component('lateral-head', 'lateral head of gastrocnemius', 'FMA45959'),
  ]),
  target('soleus', 'soleus', [component('soleus', 'soleus', 'FMA22542')]),
  target('tibialis-anterior', 'tibialis anterior', [
    component('tibialis-anterior', 'tibialis anterior', 'FMA22532'),
  ]),
]);

/** @param {Buffer} bytes */
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/**
 * @param {string} text
 * @param {string[]} expectedHeader
 * @param {string} source
 * @returns {string[][]}
 */
function parseTsv(text, expectedHeader, source) {
  const lines = text.replace(/\r/g, '').split('\n');
  if (lines.at(-1) === '') lines.pop();
  const header = lines.shift()?.split('\t');
  if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
    throw new Error(`${source}: unexpected metadata schema`);
  }
  return lines.map((line, index) => {
    const values = line.split('\t');
    if (
      values.length !== expectedHeader.length ||
      values.some((value) => !value)
    ) {
      throw new Error(`${source}:${index + 2}: malformed metadata row`);
    }
    return values;
  });
}

/** @param {string} text @param {string} [source] @returns {PartRow[]} */
export function parsePartsList(text, source = 'parts list') {
  return parseTsv(text, ['concept id', 'representation id', 'en'], source).map(
    (row) => {
      const [conceptId, representationId, name] =
        /** @type {[string, string, string]} */ (row);
      return {
        conceptId,
        representationId,
        name,
      };
    },
  );
}

/** @param {string} text @param {string} [source] @returns {ElementRow[]} */
export function parseElementParts(text, source = 'element parts') {
  return parseTsv(text, ['concept id', 'name', 'element file id'], source).map(
    (row) => {
      const [conceptId, name, fileId] =
        /** @type {[string, string, string]} */ (row);
      return { conceptId, name, fileId };
    },
  );
}

/** @param {string} text @param {string} [source] @returns {RelationRow[]} */
export function parseInclusionRelations(text, source = 'inclusion relations') {
  return parseTsv(
    text,
    ['parent id', 'parent name', 'child id', 'child name'],
    source,
  ).map((row) => {
    const [parentId, parentName, childId, childName] =
      /** @type {[string, string, string, string]} */ (row);
    return { parentId, parentName, childId, childName };
  });
}

/** @param {PartRow[]} parts */
export function validateUniqueIds(parts) {
  const concepts = new Map();
  const representations = new Map();
  for (const row of parts) {
    if (concepts.has(row.conceptId))
      throw new Error(`duplicate concept ID ${row.conceptId}`);
    if (representations.has(row.representationId))
      throw new Error(`duplicate representation ID ${row.representationId}`);
    concepts.set(row.conceptId, row);
    representations.set(row.representationId, row);
  }
  return { concepts, representations };
}

/** @param {Buffer} bytes */
export function parseObj(bytes) {
  const text = bytes.toString('utf8');
  /** @param {string} label */
  const field = (label) => {
    const match = text.match(
      new RegExp(`^# ${label}[ \\t]*:[ \\t]*(\\S.*)$`, 'm'),
    );
    if (!match) throw new Error(`OBJ missing ${label}`);
    return /** @type {string} */ (match[1]).trim();
  };
  const boundsMatch = text.match(
    /^# Bounds\(mm\):\s*\(([^)]+)\)-\(([^)]+)\)$/m,
  );
  if (!boundsMatch) throw new Error('OBJ missing or malformed Bounds(mm)');
  /** @param {string} value */
  const vector = (value) => value.split(',').map(Number);
  const headerMin = vector(/** @type {string} */ (boundsMatch[1]));
  const headerMax = vector(/** @type {string} */ (boundsMatch[2]));
  if (
    headerMin.length !== 3 ||
    headerMax.length !== 3 ||
    [...headerMin, ...headerMax].some((value) => !Number.isFinite(value))
  )
    throw new Error('OBJ contains invalid bounds');

  let vertices = 0;
  let faces = 0;
  let triangles = 0;
  const geometryMin = [Infinity, Infinity, Infinity];
  const geometryMax = [-Infinity, -Infinity, -Infinity];
  for (const line of text.split('\n')) {
    if (line.startsWith('v ')) {
      const coordinates = line.trim().split(/\s+/).slice(1).map(Number);
      if (
        coordinates.length < 3 ||
        coordinates.slice(0, 3).some((value) => !Number.isFinite(value))
      )
        throw new Error('OBJ contains a non-finite or malformed vertex');
      vertices += 1;
      for (let axis = 0; axis < 3; axis += 1) {
        const coordinate = /** @type {number} */ (coordinates[axis]);
        geometryMin[axis] = Math.min(
          /** @type {number} */ (geometryMin[axis]),
          coordinate,
        );
        geometryMax[axis] = Math.max(
          /** @type {number} */ (geometryMax[axis]),
          coordinate,
        );
      }
    }
    if (line.startsWith('f ')) {
      faces += 1;
      const corners = line.trim().split(/\s+/).length - 1;
      if (corners < 3)
        throw new Error('OBJ contains a face with fewer than 3 vertices');
      triangles += corners - 2;
    }
  }
  if (vertices === 0 || faces === 0)
    throw new Error('OBJ contains no geometry');
  const boundsMaxAbsoluteDeltaMm = Number(
    Math.max(
      ...geometryMin.map((value, axis) =>
        Math.abs(value - /** @type {number} */ (headerMin[axis])),
      ),
      ...geometryMax.map((value, axis) =>
        Math.abs(value - /** @type {number} */ (headerMax[axis])),
      ),
    ).toFixed(6),
  );
  return {
    fileId: field('File ID'),
    representationId: field('Representation ID'),
    buildLogic: field('Build-up logic'),
    conceptId: field('Concept ID'),
    name: field('English name'),
    bytes: bytes.byteLength,
    vertices,
    faces,
    triangles,
    geometryBounds: { min: geometryMin, max: geometryMax },
    sourceHeaderBounds: { min: headerMin, max: headerMax },
    boundsMaxAbsoluteDeltaMm,
    sha256: sha256(bytes),
  };
}

/** @param {string} root @param {Map<string, string[]>} children */
function descendants(root, children) {
  const result = new Set();
  const pending = [root];
  while (pending.length) {
    const current = pending.pop();
    if (!current) continue;
    if (result.has(current)) continue;
    result.add(current);
    pending.push(...(children.get(current) ?? []));
  }
  return result;
}

/**
 * @param {{targetDefinitions: readonly TargetSpec[], parts: PartRow[], elements: ElementRow[], relations: RelationRow[], meshDir: string, buildLogic: string}} input
 */
export async function buildMeshMapping({
  targetDefinitions,
  parts,
  elements,
  relations,
  meshDir,
  buildLogic,
}) {
  const { concepts } = validateUniqueIds(parts);
  const children = new Map();
  for (const relation of relations) {
    const list = children.get(relation.parentId) ?? [];
    list.push(relation.childId);
    children.set(relation.parentId, list);
  }
  const filesByConcept = new Map();
  const exactElementRows = new Set();
  for (const row of elements) {
    const key = `${row.conceptId}\0${row.fileId}`;
    if (exactElementRows.has(key))
      throw new Error(
        `duplicate element mapping ${row.conceptId}/${row.fileId}`,
      );
    exactElementRows.add(key);
    const files = filesByConcept.get(row.conceptId) ?? [];
    files.push(row.fileId);
    filesByConcept.set(row.conceptId, files);
  }

  const mappedTargets = [];
  for (const definition of targetDefinitions) {
    if (definition.components.length === 0) {
      mappedTargets.push({
        id: definition.id,
        label: definition.label,
        present: false,
        inclusionReason: null,
        exclusionReason: definition.reason,
        components: [],
      });
      continue;
    }
    const mappedComponents = [];
    for (const specification of definition.components) {
      const root = concepts.get(specification.conceptId);
      if (!root || root.name !== specification.name)
        throw new Error(
          `${definition.id}/${specification.id}: concept ${specification.conceptId} name mismatch`,
        );
      const allowedConcepts = descendants(specification.conceptId, children);
      const fileIds = new Set();
      for (const conceptId of allowedConcepts)
        for (const fileId of filesByConcept.get(conceptId) ?? [])
          fileIds.add(fileId);
      if (fileIds.size === 0)
        throw new Error(
          `${definition.id}/${specification.id}: no mapped meshes`,
        );

      const meshes = [];
      const excludedMeshes = [];
      for (const fileId of [...fileIds].sort()) {
        const path = join(meshDir, `${fileId}.obj`);
        let bytes;
        try {
          bytes = await readFile(path);
        } catch (error) {
          if (
            error &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === 'ENOENT'
          )
            throw new Error(`missing OBJ ${fileId} at ${path}`);
          throw error;
        }
        const knownExclusion =
          /** @type {Record<string, {bytes: number, sha256: string, reason: string}>} */ (
            KNOWN_SOURCE_EXCLUSIONS
          )[fileId];
        if (knownExclusion) {
          const actualHash = sha256(bytes);
          if (
            bytes.byteLength !== knownExclusion.bytes ||
            actualHash !== knownExclusion.sha256
          ) {
            throw new Error(
              `${fileId}: known source exclusion bytes were tampered`,
            );
          }
          excludedMeshes.push({
            fileId,
            bytes: bytes.byteLength,
            sha256: actualHash,
            reason: knownExclusion.reason,
          });
          continue;
        }
        const obj = parseObj(bytes);
        if (obj.fileId !== fileId)
          throw new Error(`${fileId}: header File ID is ${obj.fileId}`);
        if (obj.buildLogic !== buildLogic)
          throw new Error(
            `${fileId}: build logic is ${obj.buildLogic}, expected ${buildLogic}`,
          );
        if (!allowedConcepts.has(obj.conceptId))
          throw new Error(
            `${fileId}: concept ${obj.conceptId} is outside component closure`,
          );
        if (!exactElementRows.has(`${obj.conceptId}\0${fileId}`))
          throw new Error(
            `${fileId}: exact concept/file mapping is absent from metadata`,
          );
        const identity = concepts.get(obj.conceptId);
        if (!identity)
          throw new Error(`${fileId}: concept ${obj.conceptId} is absent`);
        if (identity.representationId !== obj.representationId)
          throw new Error(
            `${fileId}: representation ${obj.representationId} does not match ${identity.representationId}`,
          );
        if (
          identity.name.toLocaleLowerCase('en-US') !==
          obj.name.toLocaleLowerCase('en-US')
        )
          throw new Error(`${fileId}: English name does not match metadata`);
        meshes.push(obj);
      }
      if (meshes.length === 0)
        throw new Error(
          `${definition.id}/${specification.id}: no identity-valid mapped meshes`,
        );
      mappedComponents.push({
        id: specification.id,
        name: specification.name,
        rootConceptId: specification.conceptId,
        meshes,
        excludedMeshes,
      });
    }
    mappedTargets.push({
      id: definition.id,
      label: definition.label,
      present: true,
      inclusionReason:
        'Every required component resolves to checksum-verified meshes with exact metadata/header identity.',
      exclusionReason: null,
      components: mappedComponents,
    });
  }
  const placements = new Map();
  const uniqueMeshes = new Map();
  for (const mappedTarget of mappedTargets)
    for (const mappedComponent of mappedTarget.components)
      for (const mesh of mappedComponent.meshes) {
        uniqueMeshes.set(mesh.fileId, mesh);
        const meshPlacements = placements.get(mesh.fileId) ?? [];
        meshPlacements.push(`${mappedTarget.id}/${mappedComponent.id}`);
        placements.set(mesh.fileId, meshPlacements);
      }
  return {
    required: mappedTargets.length,
    present: mappedTargets.filter((entry) => entry.present).length,
    absent: mappedTargets.filter((entry) => !entry.present).length,
    selectedMeshes: uniqueMeshes.size,
    boundsComparison: {
      comparedUniqueMeshes: uniqueMeshes.size,
      differentFromSourceHeader: [...uniqueMeshes.values()].filter(
        (mesh) => mesh.boundsMaxAbsoluteDeltaMm > 0,
      ).length,
      greaterThanPointOneMm: [...uniqueMeshes.values()].filter(
        (mesh) => mesh.boundsMaxAbsoluteDeltaMm > 0.1,
      ).length,
      maximumAbsoluteDeltaMm: Math.max(
        ...[...uniqueMeshes.values()].map(
          (mesh) => mesh.boundsMaxAbsoluteDeltaMm,
        ),
      ),
      maximumDeltaFileId: [...uniqueMeshes.values()].sort(
        (left, right) =>
          right.boundsMaxAbsoluteDeltaMm - left.boundsMaxAbsoluteDeltaMm,
      )[0]?.fileId,
      note: 'geometryBounds are computed from vertices; sourceHeaderBounds are recorded metadata and are not used as geometry extrema.',
    },
    reusedMeshes: [...placements]
      .filter(([, meshPlacements]) => meshPlacements.length > 1)
      .map(([fileId, meshPlacements]) => ({
        fileId,
        placements: meshPlacements,
      })),
    absentIds: mappedTargets
      .filter((entry) => !entry.present)
      .map((entry) => entry.id),
    targets: mappedTargets,
  };
}

/** @param {any} value @returns {any} */
function canonicalize(value) {
  if (Array.isArray(value)) {
    const canonical = value.map(canonicalize);
    if (
      canonical.every(
        (entry) =>
          entry &&
          typeof entry === 'object' &&
          ('id' in entry || 'fileId' in entry),
      )
    ) {
      return canonical.sort((a, b) =>
        String(a.id ?? a.fileId).localeCompare(
          String(b.id ?? b.fileId),
          'en-US',
        ),
      );
    }
    return canonical;
  }
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort((a, b) => a.localeCompare(b, 'en-US'))
      .map((key) => [key, canonicalize(value[key])]),
  );
}

/** @param {any} value */
export async function stableJson(value) {
  return prettier.format(JSON.stringify(canonicalize(value)), {
    parser: 'json',
    printWidth: 80,
  });
}

/** @param {string} path @param {number} expectedBytes @param {string} expectedHash */
async function verifiedFile(path, expectedBytes, expectedHash) {
  const bytes = await readFile(path);
  validateBytes(bytes, basename(path), expectedBytes, expectedHash);
  return bytes;
}

/** @param {Buffer} bytes @param {string} label @param {number} expectedBytes @param {string} expectedHash */
export function validateBytes(bytes, label, expectedBytes, expectedHash) {
  if (bytes.byteLength !== expectedBytes)
    throw new Error(
      `${label}: ${bytes.byteLength} bytes, expected ${expectedBytes}`,
    );
  const actualHash = sha256(bytes);
  if (actualHash !== expectedHash)
    throw new Error(
      `${label}: SHA-256 ${actualHash}, expected ${expectedHash}`,
    );
}

/**
 * @param {Buffer} archive
 * @returns {Map<string, {bytes: Buffer, method: 0 | 8}>}
 */
function readZipEntries(archive) {
  /** @param {number} offset @param {number} length @param {string} context */
  const requireRange = (offset, length, context) => {
    if (
      !Number.isSafeInteger(offset) ||
      !Number.isSafeInteger(length) ||
      offset < 0 ||
      length < 0 ||
      offset + length > archive.length
    )
      throw new Error(`${context}: ZIP record extends outside archive bounds`);
  };
  /** @param {number} offset @param {string} context */
  const uint16 = (offset, context) => {
    requireRange(offset, 2, context);
    return archive.readUInt16LE(offset);
  };
  /** @param {number} offset @param {string} context */
  const uint32 = (offset, context) => {
    requireRange(offset, 4, context);
    return archive.readUInt32LE(offset);
  };
  let eocd = -1;
  const lowerBound = Math.max(0, archive.length - 65_557);
  for (let offset = archive.length - 22; offset >= lowerBound; offset -= 1) {
    if (uint32(offset, 'ZIP EOCD search') === 0x06054b50) {
      eocd = offset;
      break;
    }
  }
  if (eocd < 0)
    throw new Error('ZIP end-of-central-directory record is absent');
  requireRange(eocd, 22, 'ZIP EOCD');
  const diskNumber = uint16(eocd + 4, 'ZIP EOCD');
  const centralDisk = uint16(eocd + 6, 'ZIP EOCD');
  const diskEntryCount = uint16(eocd + 8, 'ZIP EOCD');
  const entryCount = uint16(eocd + 10, 'ZIP EOCD');
  const centralSize = uint32(eocd + 12, 'ZIP EOCD');
  const centralOffset = uint32(eocd + 16, 'ZIP EOCD');
  const commentLength = uint16(eocd + 20, 'ZIP EOCD');
  if (eocd + 22 + commentLength !== archive.length)
    throw new Error('ZIP EOCD comment length or trailing bytes are invalid');
  if (diskNumber !== 0 || centralDisk !== 0 || diskEntryCount !== entryCount)
    throw new Error('multi-disk ZIP archives are unsupported');
  if (
    entryCount === 0xffff ||
    centralOffset === 0xffffffff ||
    centralSize === 0xffffffff
  )
    throw new Error('Zip64 archives are not supported');
  requireRange(centralOffset, centralSize, 'ZIP central directory');
  if (centralOffset + centralSize !== eocd)
    throw new Error('ZIP central directory bounds do not meet the EOCD');

  const result = new Map();
  let cursor = centralOffset;
  for (let index = 0; index < entryCount; index += 1) {
    const context = `ZIP central directory entry ${index}`;
    requireRange(cursor, 46, context);
    if (uint32(cursor, context) !== 0x02014b50)
      throw new Error(`ZIP central directory entry ${index} is malformed`);
    const flags = uint16(cursor + 8, context);
    const method = uint16(cursor + 10, context);
    const expectedCrc32 = uint32(cursor + 16, context);
    const compressedSize = uint32(cursor + 20, context);
    const uncompressedSize = uint32(cursor + 24, context);
    const filenameLength = uint16(cursor + 28, context);
    const extraLength = uint16(cursor + 30, context);
    const entryCommentLength = uint16(cursor + 32, context);
    const localOffset = uint32(cursor + 42, context);
    const centralEntryLength =
      46 + filenameLength + extraLength + entryCommentLength;
    requireRange(cursor, centralEntryLength, context);
    const filename = archive
      .subarray(cursor + 46, cursor + 46 + filenameLength)
      .toString('utf8');
    if (flags & (1 | 64 | 8192))
      throw new Error(
        `${filename}: encrypted or masked ZIP entry is unsupported`,
      );
    if (
      compressedSize === 0xffffffff ||
      uncompressedSize === 0xffffffff ||
      localOffset === 0xffffffff
    )
      throw new Error(`${filename}: Zip64 entry is unsupported`);
    requireRange(localOffset, 30, `${filename} local ZIP header`);
    if (uint32(localOffset, `${filename} local ZIP header`) !== 0x04034b50)
      throw new Error(`${filename}: local ZIP header is malformed`);
    const localFlags = uint16(localOffset + 6, `${filename} local ZIP header`);
    const localMethod = uint16(localOffset + 8, `${filename} local ZIP header`);
    const localCrc32 = uint32(localOffset + 14, `${filename} local ZIP header`);
    const localCompressedSize = uint32(
      localOffset + 18,
      `${filename} local ZIP header`,
    );
    const localUncompressedSize = uint32(
      localOffset + 22,
      `${filename} local ZIP header`,
    );
    const localFilenameLength = uint16(
      localOffset + 26,
      `${filename} local ZIP header`,
    );
    const localExtraLength = uint16(
      localOffset + 28,
      `${filename} local ZIP header`,
    );
    if (localFlags !== flags || localMethod !== method)
      throw new Error(
        `${filename}: local and central ZIP flags/method disagree`,
      );
    requireRange(
      localOffset + 30,
      localFilenameLength + localExtraLength,
      `${filename} local ZIP name/extra`,
    );
    const localFilename = archive.subarray(
      localOffset + 30,
      localOffset + 30 + localFilenameLength,
    );
    const centralFilename = archive.subarray(
      cursor + 46,
      cursor + 46 + filenameLength,
    );
    if (!localFilename.equals(centralFilename))
      throw new Error(`${filename}: local and central ZIP filename disagree`);
    if (!(flags & 8)) {
      if (
        localCrc32 !== expectedCrc32 ||
        localCompressedSize !== compressedSize ||
        localUncompressedSize !== uncompressedSize
      )
        throw new Error(`${filename}: local and central ZIP size/CRC disagree`);
    }
    const dataOffset =
      localOffset + 30 + localFilenameLength + localExtraLength;
    requireRange(dataOffset, compressedSize, `${filename} compressed data`);
    if (dataOffset + compressedSize > centralOffset)
      throw new Error(
        `${filename}: compressed data overlaps central directory`,
      );
    const compressed = archive.subarray(
      dataOffset,
      dataOffset + compressedSize,
    );
    let bytes;
    if (method === 0) bytes = Buffer.from(compressed);
    else if (method === 8) bytes = inflateRawSync(compressed);
    else
      throw new Error(
        `${filename}: unsupported ZIP compression method ${method}`,
      );
    if (bytes.byteLength !== uncompressedSize)
      throw new Error(`${filename}: uncompressed ZIP size mismatch`);
    if (crc32(bytes) !== expectedCrc32)
      throw new Error(`${filename}: ZIP entry CRC-32 mismatch`);
    if (result.has(filename))
      throw new Error(`duplicate ZIP entry ${filename}`);
    result.set(filename, {
      bytes,
      method: /** @type {0 | 8} */ (method),
    });
    cursor += centralEntryLength;
  }
  if (cursor !== centralOffset + centralSize)
    throw new Error('ZIP central directory size does not match parsed records');
  return result;
}

const CRC32_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1)
    value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  return value >>> 0;
});

/** @param {Buffer} bytes */
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes)
    crc =
      /** @type {number} */ (CRC32_TABLE[(crc ^ byte) & 0xff]) ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * @param {Buffer} archive
 * @param {string} meshDir
 * @param {{entryPrefix: string, expectedObjFiles: number}} options
 */
export async function verifyExtractedAgainstArchive(
  archive,
  meshDir,
  { entryPrefix, expectedObjFiles },
) {
  if (
    !/^[A-Za-z0-9][A-Za-z0-9._-]*\/$/.test(entryPrefix) ||
    entryPrefix.includes('..')
  )
    throw new Error(`unsafe ZIP entry prefix ${entryPrefix}`);
  const entries = readZipEntries(archive);
  const archiveObjs = [...entries]
    .filter(([name]) => name.toLocaleLowerCase('en-US').endsWith('.obj'))
    .sort(([left], [right]) => left.localeCompare(right, 'en-US'));
  for (const [name] of archiveObjs) {
    const suffix = name.startsWith(entryPrefix)
      ? name.slice(entryPrefix.length)
      : '';
    if (!/^FJ\d+M?\.obj$/.test(suffix))
      throw new Error(`unsafe ZIP OBJ entry path ${name}`);
  }
  if (archiveObjs.length !== expectedObjFiles)
    throw new Error(
      `ZIP contains ${archiveObjs.length} OBJ files under ${entryPrefix}, expected ${expectedObjFiles}`,
    );
  const extractedNames = (await readdir(meshDir))
    .filter((name) => name.endsWith('.obj'))
    .sort((left, right) => left.localeCompare(right, 'en-US'));
  if (extractedNames.length !== expectedObjFiles)
    throw new Error(
      `${basename(meshDir)} contains ${extractedNames.length} OBJ files, expected ${expectedObjFiles}`,
    );
  const archiveBasenames = new Set();
  const compressionMethods = { stored: 0, deflate: 0 };
  for (const [entryName, archivedEntry] of archiveObjs) {
    const { bytes: archivedBytes, method } = archivedEntry;
    if (method === 0) compressionMethods.stored += 1;
    else compressionMethods.deflate += 1;
    const extractedName = basename(entryName);
    if (archiveBasenames.has(extractedName))
      throw new Error(`duplicate ZIP OBJ basename ${extractedName}`);
    archiveBasenames.add(extractedName);
    let extractedBytes;
    try {
      extractedBytes = await readFile(join(meshDir, extractedName));
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      )
        throw new Error(`${extractedName}: extracted OBJ is absent`);
      throw error;
    }
    if (!archivedBytes.equals(extractedBytes))
      throw new Error(
        `${extractedName}: extracted bytes do not match verified ZIP entry`,
      );
  }
  for (const extractedName of extractedNames)
    if (!archiveBasenames.has(extractedName))
      throw new Error(
        `${extractedName}: extracted OBJ is absent from verified ZIP`,
      );
  return {
    verifiedObjFiles: archiveObjs.length,
    compressionMethods,
    binding: 'byte-identical to entries in whole-file SHA-256-verified ZIP',
  };
}

/**
 * @param {{meshDir: string, expectedFiles: number, buildLogic: string, parts: PartRow[], elements: ElementRow[]}} input
 */
async function inspectExtractedArchive({
  meshDir,
  expectedFiles,
  buildLogic,
  parts,
  elements,
}) {
  const filenames = (await readdir(meshDir))
    .filter((name) => name.endsWith('.obj'))
    .sort((a, b) => a.localeCompare(b, 'en-US'));
  if (filenames.length !== expectedFiles)
    throw new Error(
      `${basename(meshDir)}: ${filenames.length} OBJ files, expected ${expectedFiles}`,
    );
  const partsByConcept = new Map(parts.map((row) => [row.conceptId, row]));
  const exactElements = new Set(
    elements.map((row) => `${row.conceptId}\0${row.fileId}`),
  );
  const seenFileIds = new Set();
  const incompleteIdentityHeaders = [];
  const metadataIdentityConflicts = [];
  /** @type {Record<string, number>} */
  const gapTerms = {
    'internal oblique': 0,
    latissimus: 0,
    multifid: 0,
    'rectus abdominis': 0,
    'transversus abdominis': 0,
  };
  for (const filename of filenames) {
    const text = (await readFile(join(meshDir, filename), 'utf8')).slice(
      0,
      4_096,
    );
    /** @param {string} label */
    const header = (label) => {
      const match = text.match(
        new RegExp(`^# ${label}[ \\t]*:[ \\t]*(.*)$`, 'm'),
      );
      return match?.[1]?.trim() ?? null;
    };
    const fileId = header('File ID');
    const representationId = header('Representation ID');
    const conceptId = header('Concept ID');
    const name = header('English name');
    if (fileId !== filename.slice(0, -4))
      throw new Error(`${filename}: header File ID is ${fileId}`);
    if (seenFileIds.has(fileId))
      throw new Error(`duplicate OBJ File ID ${fileId}`);
    seenFileIds.add(fileId);
    if (header('Build-up logic') !== buildLogic)
      throw new Error(`${filename}: unexpected build-up logic`);
    if (!representationId || !conceptId || !name) {
      incompleteIdentityHeaders.push(fileId);
      continue;
    }
    const metadata = partsByConcept.get(conceptId);
    if (
      !metadata ||
      metadata.representationId !== representationId ||
      metadata.name.toLocaleLowerCase('en-US') !==
        name.toLocaleLowerCase('en-US') ||
      !exactElements.has(`${conceptId}\0${fileId}`)
    ) {
      metadataIdentityConflicts.push(fileId);
    }
    const normalized = name.toLocaleLowerCase('en-US');
    for (const term of Object.keys(gapTerms))
      if (normalized.includes(term)) gapTerms[term] = (gapTerms[term] ?? 0) + 1;
  }
  return {
    objFiles: filenames.length,
    completeIdentityHeaders:
      filenames.length - incompleteIdentityHeaders.length,
    incompleteIdentityHeaders,
    metadataIdentityConflicts,
    priorGapTermHeaderMatches: gapTerms,
  };
}

/** @param {string[]} argv @returns {Map<string, string>} */
function argumentsFrom(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith('--') || !value)
      throw new Error('invalid CLI arguments');
    values.set(flag.slice(2), resolve(value));
  }
  const required = [
    'metadata-dir',
    'isa-archive',
    'partof-archive',
    'isa-mesh-dir',
    'partof-mesh-dir',
    'out',
  ];
  for (const name of required)
    if (!values.has(name)) throw new Error(`missing --${name}`);
  return values;
}

/** @param {string[]} argv */
async function runExtractionBindingCli(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith('--') || !value)
      throw new Error('invalid extraction-verification arguments');
    values.set(flag.slice(2), value);
  }
  const required = [
    'archive',
    'expected-bytes',
    'expected-sha256',
    'mesh-dir',
    'entry-prefix',
    'expected-obj-files',
  ];
  for (const name of required)
    if (!values.has(name)) throw new Error(`missing --${name}`);
  /** @param {string} name @returns {string} */
  const get = (name) => /** @type {string} */ (values.get(name));
  const expectedBytes = Number(get('expected-bytes'));
  const expectedObjFiles = Number(get('expected-obj-files'));
  if (
    !Number.isSafeInteger(expectedBytes) ||
    !Number.isSafeInteger(expectedObjFiles)
  )
    throw new Error('expected byte and OBJ counts must be integers');
  const archive = await verifiedFile(
    resolve(get('archive')),
    expectedBytes,
    get('expected-sha256'),
  );
  const result = await verifyExtractedAgainstArchive(
    archive,
    resolve(get('mesh-dir')),
    { entryPrefix: get('entry-prefix'), expectedObjFiles },
  );
  console.log(JSON.stringify(result));
}

/** @param {string[]} argv */
async function runCli(argv) {
  const args = argumentsFrom(argv);
  /** @param {string} name @returns {string} */
  const getArg = (name) => /** @type {string} */ (args.get(name));
  const metadataBytes = new Map();
  for (const [name, [size, hash]] of Object.entries(METADATA)) {
    metadataBytes.set(
      name,
      await verifiedFile(join(getArg('metadata-dir'), name), size, hash),
    );
  }
  /** @type {Map<string, Buffer>} */
  const archiveBytes = new Map();
  for (const [flag, name] of /** @type {[string, string][]} */ ([
    ['isa-archive', 'isa_BP3D_4.0_obj_99.zip'],
    ['partof-archive', 'partof_BP3D_4.0_obj_99.zip'],
  ])) {
    if (basename(getArg(flag)) !== name)
      throw new Error(`${flag}: expected canonical filename ${name}`);
    const archiveIdentity = /** @type {readonly [number, string]} */ (
      ARCHIVES[name]
    );
    archiveBytes.set(
      name,
      await verifiedFile(getArg(flag), archiveIdentity[0], archiveIdentity[1]),
    );
  }
  // Both extracted trees are required, even though §4.3 muscle geometry is in IS-A.
  await stat(getArg('isa-mesh-dir'));
  await stat(getArg('partof-mesh-dir'));

  const parts = parsePartsList(
    metadataBytes.get('isa_parts_list_e.txt').toString('utf8'),
    'isa_parts_list_e.txt',
  );
  const elements = parseElementParts(
    metadataBytes.get('isa_element_parts.txt').toString('utf8'),
    'isa_element_parts.txt',
  );
  const relations = parseInclusionRelations(
    metadataBytes.get('isa_inclusion_relation_list.txt').toString('utf8'),
    'isa_inclusion_relation_list.txt',
  );
  const partofParts = parsePartsList(
    metadataBytes.get('partof_parts_list_e.txt').toString('utf8'),
    'partof_parts_list_e.txt',
  );
  const partofElements = parseElementParts(
    metadataBytes.get('partof_element_parts.txt').toString('utf8'),
    'partof_element_parts.txt',
  );
  parseInclusionRelations(
    metadataBytes.get('partof_inclusion_relation_list.txt').toString('utf8'),
    'partof_inclusion_relation_list.txt',
  );
  for (const prefix of ['isa', 'partof'])
    parseTsv(
      metadataBytes.get(`${prefix}_parts_list.txt`).toString('utf8'),
      ['concept id', 'representation id', 'en', 'kanji', 'kana'],
      `${prefix}_parts_list.txt`,
    );
  validateUniqueIds(partofParts);
  const extractedArchiveBinding = {
    isa: await verifyExtractedAgainstArchive(
      /** @type {Buffer} */ (archiveBytes.get('isa_BP3D_4.0_obj_99.zip')),
      getArg('isa-mesh-dir'),
      {
        entryPrefix: 'isa_BP3D_4.0_obj_99/',
        expectedObjFiles: 2_234,
      },
    ),
    partof: await verifyExtractedAgainstArchive(
      /** @type {Buffer} */ (archiveBytes.get('partof_BP3D_4.0_obj_99.zip')),
      getArg('partof-mesh-dir'),
      {
        entryPrefix: 'partof_BP3D_4.0_obj_99/',
        expectedObjFiles: 1_258,
      },
    ),
  };
  const extractedArchiveInspection = {
    isa: await inspectExtractedArchive({
      meshDir: getArg('isa-mesh-dir'),
      expectedFiles: 2_234,
      buildLogic: 'FMA 3.0 is_a',
      parts,
      elements,
    }),
    partof: await inspectExtractedArchive({
      meshDir: getArg('partof-mesh-dir'),
      expectedFiles: 1_258,
      buildLogic: 'FMA 3.0 part_of',
      parts: partofParts,
      elements: partofElements,
    }),
  };
  const coverage = await buildMeshMapping({
    targetDefinitions: MESH_TARGETS,
    parts,
    elements,
    relations,
    meshDir: getArg('isa-mesh-dir'),
    buildLogic: 'FMA 3.0 is_a',
  });
  const result = {
    schemaVersion: 1,
    candidate: 'path-c-bodyparts3d',
    datasetVersion: 'BodyParts3D 4.0 / FMA 3.0 / 99% polygon reduction',
    generatedBy: 'SBLA-005 deterministic mesh-map.mjs',
    source: {
      baseUrl: 'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/',
      archives: Object.fromEntries(
        Object.entries(ARCHIVES).map(([name, [bytes, digest]]) => [
          name,
          { bytes, sha256: digest },
        ]),
      ),
      metadata: Object.fromEntries(
        Object.entries(METADATA).map(([name, [bytes, digest]]) => [
          name,
          { bytes, sha256: digest },
        ]),
      ),
      extractedArchiveBinding,
      extractedArchiveInspection,
    },
    reproduction: {
      command:
        'pnpm assets:mesh-map --metadata-dir <metadata-dir> --isa-archive <isa-archive.zip> --partof-archive <partof-archive.zip> --isa-mesh-dir <extracted-isa-dir> --partof-mesh-dir <extracted-partof-dir> --out <output.json>',
      note: 'Source archives and extracted OBJ trees remain external to Git.',
    },
    coverage: {
      ...coverage,
      conclusion:
        'Full mesh/header inspection confirms the five prior label gaps; none is recoverable under another represented FMA term.',
    },
  };
  await writeFile(getArg('out'), await stableJson(result));
  console.log(
    `Mapped ${coverage.present}/${coverage.required} targets using ${coverage.selectedMeshes} unique meshes; wrote ${getArg('out')}`,
  );
}

const isMain =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const argv = process.argv.slice(2);
  const operation =
    argv[0] === '--verify-extraction-only'
      ? runExtractionBindingCli(argv.slice(1))
      : runCli(argv);
  await operation.catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
