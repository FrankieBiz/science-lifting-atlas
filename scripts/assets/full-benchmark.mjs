import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { format } from 'prettier';

/** @typedef {{transferredBytes:number, fetchMs:number, parseMs:number, uploadMs:number, totalMs:number}} BenchmarkTrial */
/** @typedef {{nativeHardware:any, lowPowerSimulation:any}} BenchmarkProfiles */
/** @typedef {{id:string, executionId:string, startedAt:string, nativeHardware:any, lowPowerSimulation:any}} BenchmarkRun */

const GLB_PATH = new URL(
  '../../assets/derived/bodyparts3d/sbla005-representative.glb',
  import.meta.url,
);
const MANIFEST_PATH = new URL(
  '../../docs/licenses/bodyparts3d-conversion-manifest.json',
  import.meta.url,
);
const OUTPUT_PATH = new URL(
  '../../docs/licenses/bodyparts3d-performance.json',
  import.meta.url,
);
/** @param {import('node:crypto').BinaryLike} bytes */
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
/** @param {unknown} value @param {string} label @returns {number} */
const finite = (value, label) => {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new Error(`${label} must be finite`);
  return value;
};
/** @param {number} value */
const rounded = (value) => Math.round(value * 1000) / 1000;
const PROFILE_KEYS = /** @type {const} */ ([
  'nativeHardware',
  'lowPowerSimulation',
]);
const BUDGETS = Object.freeze({
  desktopTargetBytes: 6_000_000,
  hardCeilingBytes: 10_000_000,
  mobileInteractiveBytes: 3_000_000,
  hostPerFileCeilingBytes: 26_214_400,
  nativeTargetFps: [55, 60],
  simulatedGracefulFps: 30,
});
const SOURCE_CONTRACT = Object.freeze({
  kind: 'task4-optimized-glb',
  path: 'assets/derived/bodyparts3d/sbla005-representative.glb',
  bytes: 2_874_932,
  sha256: 'b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7',
  conversionManifestSha256:
    '8d2cb6813a49be110c47729da208f3093b74788e7ae479b55e6f8abdef684d5d',
});
const FULL_SCENE_CONTRACT = Object.freeze({
  objects: 139,
  meshes: 139,
  drawCalls: 139,
  vertices: 87_949,
  triangles: 107_146,
  geometryBufferBytes: 2_753_652,
  positionBytes: 1_055_388,
  normalBytes: 1_055_388,
  indexBytes: 642_876,
});
const REDUCED_SCENE_CONTRACT = Object.freeze({
  objects: 139,
  meshes: 139,
  drawCalls: 139,
  vertices: 73_619,
  triangles: 53_539,
  geometryBufferBytes: 2_088_090,
  positionBytes: 883_428,
  normalBytes: 883_428,
  indexBytes: 321_234,
});
const HOST_CONTRACT = Object.freeze({
  modelClass: 'Mac15,12',
  chipModel: 'Apple M3',
  logicalCpuCount: 8,
  ramBytes: 17_179_869_184,
  gpuModel: 'Apple M3',
  gpuCores: 8,
  graphicsApi: 'Metal 4',
});
const CAMERA_FIT_CONTRACT = Object.freeze({
  min: [-0.3205469250679016, -0.03798341378569603, -0.024905577301979065],
  max: [0.32054707407951355, 1.5065789222717285, 0.21879054605960846],
  center: [7.450580596923828e-8, 0.7342977542430162, 0.0969424843788147],
  clipMargin: 0.9,
  scale: 1.1653786694000279,
  fullyInsideClipObjectCount: 139,
  clipViolationCount: 0,
});
const ENVIRONMENT_CONTRACT = Object.freeze({
  os: 'macOS 26.6.2 (darwin arm64)',
  browser: 'Playwright Chromium 1.62.1',
  browserVersion: '151.0.7922.34',
  browserRevision: '1234',
  browserBinarySha256:
    'a596b1cfc6353e987fcec8d71a23a28cd6a9e7a6b4e20b908e4c4fcffe51158e',
  viewport: { width: 1280, height: 720 },
  pixelRatio: 1,
  powerState: { source: 'pmset -g batt', supply: 'Battery Power' },
});
const NATIVE_EXECUTION_PROTOCOL = Object.freeze({
  launchArgs: ['--use-angle=metal', '--enable-precise-memory-info'],
  cpuThrottling: { method: 'none', rate: 1 },
  browserEngine: 'Chromium',
  playwrightVersion: '1.62.1',
});
const SIMULATION_EXECUTION_PROTOCOL = Object.freeze({
  launchArgs: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--enable-precise-memory-info',
  ],
  cpuThrottling: {
    method: 'Emulation.setCPUThrottlingRate',
    rate: 4,
  },
  browserEngine: 'Chromium',
  playwrightVersion: '1.62.1',
});
const BENCHMARK_PROTOCOL = Object.freeze({
  cache: 'no-store',
  warmupTrials: 1,
  measuredColdTrials: 5,
  stabilizedAnimationFrames: 300,
  stabilizationFramesDiscarded: 30,
  glFinish: true,
  coldDefinition:
    'unique no-store URL; fresh Playwright BrowserContext, page, WebGL2 context, parse, and GPU buffers per measurement',
});
const HARNESS_PATH = 'scripts/assets/full-benchmark.mjs';
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** @param {unknown} value */
const digestJson = (value) => sha256(JSON.stringify(value));

/** @param {any} profile @param {string} role */
function retainedMeasurementPayload(profile, role) {
  if (role === 'warmup') return profile.warmups?.[0];
  if (/^cold-[1-5]$/.test(role))
    return profile.trials?.[Number(role.slice(5)) - 1];
  if (role === 'animation')
    return {
      trial: profile.animationTrial,
      frameTimesMs: profile.frameTimesMs,
      renderer: profile.renderer,
      cameraFit: profile.cameraFit,
      geometryBufferBytes: profile.geometryBufferBytes,
      jsHeap: profile.jsHeap,
    };
  return undefined;
}

/** @param {any} record @param {any} run @param {string} key @param {any} profile @param {any} context */
function measurementReceiptDigest(record, run, key, profile, context) {
  return digestJson({
    source: record.source,
    harness: record.harness,
    protocol: record.protocol,
    run: {
      id: run.id,
      executionId: run.executionId,
      startedAt: run.startedAt,
    },
    profileKey: key,
    executionProtocol: profile.executionProtocol,
    browserLaunchId: profile.execution.browserLaunchId,
    context: {
      id: context.id,
      role: context.role,
      recordedAt: context.recordedAt,
    },
    measurement: retainedMeasurementPayload(profile, context.role),
  });
}

/** @param {any} record @param {any} run @param {string} key @param {any} profile */
function profileEvidenceDigest(record, run, key, profile) {
  return digestJson({
    source: record.source,
    harness: record.harness,
    protocol: record.protocol,
    run: {
      id: run.id,
      executionId: run.executionId,
      startedAt: run.startedAt,
    },
    profileKey: key,
    executionProtocol: profile.executionProtocol,
    execution: profile.execution,
    measurements: {
      warmups: profile.warmups,
      trials: profile.trials,
      animationTrial: profile.animationTrial,
      frameTimesMs: profile.frameTimesMs,
      renderer: profile.renderer,
      cameraFit: profile.cameraFit,
      geometryBufferBytes: profile.geometryBufferBytes,
      jsHeap: profile.jsHeap,
      aggregates: profile.aggregates,
    },
  });
}

/** @param {any} record */
export function bindPerformanceEvidence(record) {
  for (const run of record.runs ?? [])
    for (const key of PROFILE_KEYS) {
      const profile = run[key];
      if (profile?.status !== 'available') continue;
      for (const context of profile.execution?.contexts ?? [])
        context.digest = measurementReceiptDigest(
          record,
          run,
          key,
          profile,
          context,
        );
      profile.evidenceDigest = profileEvidenceDigest(record, run, key, profile);
    }
  record.profiles = {
    nativeHardware: record.runs?.[1]?.nativeHardware,
    lowPowerSimulation: record.runs?.[1]?.lowPowerSimulation,
  };
  return record;
}

/** @param {number[]} values */
export function median(values) {
  if (!Array.isArray(values) || values.length === 0)
    throw new Error('median needs values');
  const sorted = values
    .map((value) => finite(value, 'median value'))
    .sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const upper = sorted[middle];
  if (upper === undefined) throw new Error('median upper value is missing');
  if (sorted.length % 2) return upper;
  const lower = sorted[middle - 1];
  if (lower === undefined) throw new Error('median lower value is missing');
  return (lower + upper) / 2;
}

/** @param {number[]} values @param {number} fraction */
export function percentile(values, fraction) {
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    fraction < 0 ||
    fraction > 1
  )
    throw new Error('percentile input is invalid');
  const sorted = values
    .map((value) => finite(value, 'percentile value'))
    .sort((a, b) => a - b);
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const lowerValue = sorted[lower];
  const upperValue = sorted[upper];
  if (lowerValue === undefined || upperValue === undefined)
    throw new Error('percentile interpolation values are missing');
  return rounded(lowerValue + (upperValue - lowerValue) * (position - lower));
}

/** @param {any} input @returns {any} */
export function parseGlb(input) {
  if (input?.json && input?.bytes) return input;
  const bytes = Buffer.isBuffer(input) ? input : Buffer.from(input ?? []);
  if (bytes.length < 20 || bytes.toString('ascii', 0, 4) !== 'glTF')
    throw new Error(
      'Expected a binary GLB; source-OBJ substitutes are forbidden',
    );
  if (bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length)
    throw new Error('Malformed GLB header');
  const jsonLength = bytes.readUInt32LE(12);
  if (
    bytes.readUInt32LE(16) !== 0x4e4f534a ||
    20 + jsonLength + 8 > bytes.length
  )
    throw new Error('Malformed GLB JSON chunk');
  const json = JSON.parse(
    bytes
      .subarray(20, 20 + jsonLength)
      .toString('utf8')
      .trimEnd(),
  );
  const binaryHeader = 20 + jsonLength;
  if (bytes.readUInt32LE(binaryHeader + 4) !== 0x004e4942)
    throw new Error('GLB binary chunk is missing');
  const binaryLength = bytes.readUInt32LE(binaryHeader);
  if (binaryHeader + 8 + binaryLength > bytes.length)
    throw new Error('Malformed GLB binary chunk');
  return {
    bytes,
    json,
    binaryOffset: binaryHeader + 8,
    binaryLength,
    sha256: sha256(bytes),
  };
}

const componentBytes = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
/** @param {number} componentType */
function bytesPerComponent(componentType) {
  const value = /** @type {Record<number, number>} */ (componentBytes)[
    componentType
  ];
  if (value === undefined)
    throw new Error(`Unsupported GLB component type ${componentType}`);
  return value;
}

/** @param {any} parsed @param {any} accessor */
function scalarAccessorValues(parsed, accessor) {
  if (
    accessor.type !== 'SCALAR' ||
    ![5123, 5125].includes(accessor.componentType)
  )
    throw new Error(
      'Benchmark indices must be unsigned 16-bit or 32-bit scalars',
    );
  const view = parsed.json.bufferViews?.[accessor.bufferView];
  if (!view) throw new Error('Benchmark index bufferView is missing');
  const width = bytesPerComponent(accessor.componentType);
  const stride = view.byteStride ?? width;
  if (stride < width) throw new Error('Benchmark index byteStride is invalid');
  const start =
    parsed.binaryOffset + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const data = new DataView(
    parsed.bytes.buffer,
    parsed.bytes.byteOffset,
    parsed.bytes.byteLength,
  );
  /** @type {number[]} */
  const values = [];
  for (let index = 0; index < accessor.count; index += 1) {
    const offset = start + index * stride;
    values.push(
      accessor.componentType === 5125
        ? data.getUint32(offset, true)
        : data.getUint16(offset, true),
    );
  }
  return values;
}

/** @param {number[]} indices @param {number} ratio */
function sampledReferencedVertices(indices, ratio) {
  const triangleCount = Math.floor(indices.length / 3);
  const keptTriangles = Math.max(1, Math.floor(triangleCount * ratio));
  const referenced = new Set();
  for (let target = 0; target < keptTriangles; target += 1) {
    const sourceTriangle = Math.floor((target * triangleCount) / keptTriangles);
    for (let corner = 0; corner < 3; corner += 1) {
      const value = indices[sourceTriangle * 3 + corner];
      if (value === undefined)
        throw new Error('Reduced triangle sampling exceeded index data');
      referenced.add(value);
    }
  }
  return { keptTriangles, referencedVertices: referenced.size };
}

/** @param {any} input */
export function sceneCameraFit(input) {
  const { json } = parseGlb(input);
  const minimum = [Infinity, Infinity, Infinity];
  const maximum = [-Infinity, -Infinity, -Infinity];
  /** @type {Array<{min:number[], max:number[]}>} */
  const objectBounds = [];
  for (const node of /** @type {any[]} */ (json.nodes ?? [])) {
    const nodeMinimum = [Infinity, Infinity, Infinity];
    const nodeMaximum = [-Infinity, -Infinity, -Infinity];
    const mesh = json.meshes?.[node.mesh];
    if (!mesh) throw new Error(`Camera fit mesh is missing for ${node.name}`);
    for (const primitive of mesh.primitives ?? []) {
      const accessor = json.accessors?.[primitive.attributes?.POSITION];
      if (!accessor || accessor.min?.length !== 3 || accessor.max?.length !== 3)
        throw new Error(`Camera fit bounds are missing for ${node.name}`);
      for (let axis = 0; axis < 3; axis += 1) {
        const lower = finite(accessor.min[axis], 'camera minimum');
        const upper = finite(accessor.max[axis], 'camera maximum');
        minimum[axis] = Math.min(minimum[axis] ?? Infinity, lower);
        maximum[axis] = Math.max(maximum[axis] ?? -Infinity, upper);
        nodeMinimum[axis] = Math.min(nodeMinimum[axis] ?? Infinity, lower);
        nodeMaximum[axis] = Math.max(nodeMaximum[axis] ?? -Infinity, upper);
      }
    }
    objectBounds.push({ min: nodeMinimum, max: nodeMaximum });
  }
  const center = minimum.map(
    (value, axis) => (value + (maximum[axis] ?? value)) / 2,
  );
  const half = minimum.map(
    (value, axis) => ((maximum[axis] ?? value) - value) / 2,
  );
  const radialExtent = Math.hypot(half[0] ?? 0, half[2] ?? 0);
  const fitExtent = Math.max(half[1] ?? 0, radialExtent);
  if (!Number.isFinite(fitExtent) || fitExtent <= 0)
    throw new Error('Camera fit extent is invalid');
  const clipMargin = 0.9;
  const scale = clipMargin / fitExtent;
  let clipViolationCount = 0;
  for (const bounds of objectBounds) {
    const x = Math.max(
      Math.abs((bounds.min[0] ?? 0) - (center[0] ?? 0)),
      Math.abs((bounds.max[0] ?? 0) - (center[0] ?? 0)),
    );
    const z = Math.max(
      Math.abs((bounds.min[2] ?? 0) - (center[2] ?? 0)),
      Math.abs((bounds.max[2] ?? 0) - (center[2] ?? 0)),
    );
    const y = Math.max(
      Math.abs((bounds.min[1] ?? 0) - (center[1] ?? 0)),
      Math.abs((bounds.max[1] ?? 0) - (center[1] ?? 0)),
    );
    if (
      Math.hypot(x, z) * scale > clipMargin + 1e-9 ||
      y * scale > clipMargin + 1e-9
    )
      clipViolationCount += 1;
  }
  return {
    min: minimum,
    max: maximum,
    center,
    clipMargin,
    scale,
    fullyInsideClipObjectCount: objectBounds.length - clipViolationCount,
    clipViolationCount,
  };
}
/** @param {any} input @param {number} [reducedRatio] */
export function summarizeScene(input, reducedRatio = 1) {
  if (!Number.isFinite(reducedRatio) || reducedRatio <= 0 || reducedRatio > 1)
    throw new Error('Reduced scene ratio must be within (0, 1]');
  const parsed = parseGlb(input);
  const { json } = parsed;
  const nodes = /** @type {any[]} */ (json.nodes ?? []);
  const meshes = /** @type {any[]} */ (json.meshes ?? []);
  const accessors = /** @type {any[]} */ (json.accessors ?? []);
  const names = nodes.map((node) => node.name);
  if (names.some((name) => typeof name !== 'string' || !name))
    throw new Error('Every scene object needs a name');
  if (new Set(names).size !== names.length)
    throw new Error('Duplicate scene object name');
  let vertices = 0;
  let triangles = 0;
  let drawCalls = 0;
  let geometryBufferBytes = 0;
  let positionBytes = 0;
  let normalBytes = 0;
  let indexBytes = 0;
  for (const node of nodes) {
    const mesh = meshes[node.mesh];
    if (!mesh) throw new Error(`Scene node ${node.name} has no mesh`);
    for (const primitive of mesh.primitives ?? []) {
      const position = accessors[primitive.attributes?.POSITION];
      const normal = accessors[primitive.attributes?.NORMAL];
      const indices = accessors[primitive.indices];
      if (
        !position ||
        !normal ||
        !indices ||
        position.type !== 'VEC3' ||
        normal.type !== 'VEC3' ||
        position.componentType !== 5126 ||
        normal.componentType !== 5126 ||
        normal.count !== position.count ||
        indices.type !== 'SCALAR'
      )
        throw new Error(`Scene mesh ${node.name} has malformed geometry`);
      const reduced = reducedRatio < 1;
      const selected = reduced
        ? sampledReferencedVertices(
            scalarAccessorValues(parsed, indices),
            reducedRatio,
          )
        : {
            keptTriangles: Math.floor(indices.count / 3),
            referencedVertices: position.count,
          };
      const keptIndices = selected.keptTriangles * 3;
      const keptVertices = selected.referencedVertices;
      if (keptVertices > position.count)
        throw new Error(`Scene mesh ${node.name} indices exceed POSITION data`);
      const primitivePositionBytes = keptVertices * 3 * 4;
      const primitiveNormalBytes = keptVertices * 3 * 4;
      const primitiveIndexBytes =
        keptIndices *
        (reduced
          ? keptVertices <= 65_535
            ? 2
            : 4
          : bytesPerComponent(indices.componentType));
      vertices += keptVertices;
      triangles += keptIndices / 3;
      drawCalls += 1;
      positionBytes += primitivePositionBytes;
      normalBytes += primitiveNormalBytes;
      indexBytes += primitiveIndexBytes;
      geometryBufferBytes +=
        primitivePositionBytes + primitiveNormalBytes + primitiveIndexBytes;
    }
  }
  return {
    objects: nodes.length,
    meshes: meshes.length,
    drawCalls,
    vertices,
    triangles,
    geometryBufferBytes,
    positionBytes,
    normalBytes,
    indexBytes,
    names,
  };
}

/** @param {any} input @param {any} manifest */
export function validateRepresentativeScene(input, manifest) {
  const parsed = parseGlb(input);
  const expectedArtifact = manifest?.artifacts?.glb;
  if (!expectedArtifact || parsed.bytes.length !== expectedArtifact.bytes)
    throw new Error('Task 4 GLB byte-size mismatch');
  if (parsed.sha256 !== expectedArtifact.sha256)
    throw new Error(`Task 4 GLB SHA-256 mismatch: ${parsed.sha256}`);
  const summary = summarizeScene(parsed);
  const expectedNames = manifest?.rawGltfEvidence?.names;
  if (
    !Array.isArray(expectedNames) ||
    expectedNames.length !== manifest.objects?.length
  )
    throw new Error('Conversion manifest scene names are incomplete');
  if (summary.names.length !== expectedNames.length)
    throw new Error(
      `Scene object count mismatch: expected ${expectedNames.length}, received ${summary.names.length}`,
    );
  const expected = new Set(expectedNames);
  const missing = expectedNames.filter((name) => !summary.names.includes(name));
  const extra = summary.names.filter((name) => !expected.has(name));
  if (missing.length)
    throw new Error(`Missing scene objects: ${missing.join(', ')}`);
  if (extra.length) throw new Error(`Extra scene objects: ${extra.join(', ')}`);
  const parsedNodes = /** @type {any[]} */ (parsed.json.nodes);
  for (const object of manifest.objects) {
    const node = parsedNodes.find(
      (candidate) => candidate.name === object.name,
    );
    if (
      !node ||
      node.extras?.sbla_source_file_id !== object.source.fileId ||
      node.extras?.sbla_source_sha256 !== object.source.sha256 ||
      node.extras?.sbla_entity_id !== object.normalized.entityId
    )
      throw new Error(`Scene provenance mismatch for ${object.name}`);
  }
  return summary;
}

/** @param {unknown} actual @param {unknown} expected @param {string} label */
function exact(actual, expected, label) {
  const actualNumber = finite(actual, label);
  const expectedNumber = finite(expected, `${label} expected value`);
  if (Math.abs(actualNumber - expectedNumber) > 0.001)
    throw new Error(`${label} aggregate mismatch`);
}
/** @param {any} value @param {string} label @param {number} sourceBytes */
function validateTrial(value, label, sourceBytes) {
  if (
    !value ||
    !Number.isInteger(value.transferredBytes) ||
    value.transferredBytes <= 0
  )
    throw new Error(`${label}.transferredBytes is invalid`);
  if (
    value.transferredBytes < sourceBytes ||
    value.transferredBytes > sourceBytes + 4096
  )
    throw new Error(
      `${label}.transferredBytes does not match the fixed GLB response`,
    );
  for (const key of ['fetchMs', 'parseMs', 'uploadMs', 'totalMs'])
    if (finite(value[key], `${label}.${key}`) < 0)
      throw new Error(`${label}.${key} is negative`);
}
/** @param {any} profile @param {string} label @param {any} protocol @param {number} sourceBytes @param {number} expectedGeometryBufferBytes */
function validateProfile(
  profile,
  label,
  protocol,
  sourceBytes,
  expectedGeometryBufferBytes,
) {
  if (profile?.status === 'unavailable') {
    if (
      typeof profile.unavailableReason !== 'string' ||
      !profile.unavailableReason
    )
      throw new Error(`${label} unavailable reason is required`);
    if (
      profile.warmups?.length ||
      profile.trials?.length ||
      profile.frameTimesMs?.length ||
      profile.aggregates !== null
    )
      throw new Error(
        `${label} unavailable profile must not contain measurements`,
      );
    return false;
  }
  if (profile?.status !== 'available')
    throw new Error(`${label}.status is invalid`);
  if (profile.warmups?.length < protocol.warmupTrials)
    throw new Error(`${label} needs at least one warmup`);
  if (profile.trials?.length !== protocol.measuredColdTrials)
    throw new Error(`${label} needs exactly five measured cold trials`);
  if (profile.frameTimesMs?.length !== protocol.stabilizedAnimationFrames)
    throw new Error(`${label} needs exactly 300 frame samples`);
  const warmups = /** @type {BenchmarkTrial[]} */ (profile.warmups);
  const trials = /** @type {BenchmarkTrial[]} */ (profile.trials);
  const frameTimes = /** @type {number[]} */ (profile.frameTimesMs);
  warmups.forEach((trial, index) =>
    validateTrial(trial, `${label}.warmups[${index}]`, sourceBytes),
  );
  trials.forEach((trial, index) =>
    validateTrial(trial, `${label}.trials[${index}]`, sourceBytes),
  );
  validateTrial(profile.animationTrial, `${label}.animationTrial`, sourceBytes);
  frameTimes.forEach((value, index) =>
    finite(value, `${label}.frameTimesMs[${index}]`) > 0
      ? undefined
      : (() => {
          throw new Error(`${label}.frameTimesMs[${index}] must be positive`);
        })(),
  );
  if (!profile.renderer?.vendor || !profile.renderer?.renderer)
    throw new Error(`${label} WebGL identity is required`);
  if (
    profile.browserVersion !== ENVIRONMENT_CONTRACT.browserVersion ||
    profile.headless !== true
  )
    throw new Error(`${label} browser version and headless mode are required`);
  if (profile.geometryBufferBytes !== expectedGeometryBufferBytes)
    throw new Error(`${label} geometryBufferBytes does not match its scene`);
  if (JSON.stringify(profile.cameraFit) !== JSON.stringify(CAMERA_FIT_CONTRACT))
    throw new Error(
      `${label} camera fit does not prove the full scene is visible`,
    );
  if (
    !profile.jsHeap ||
    (profile.jsHeap.bytes === null && !profile.jsHeap.unavailableReason) ||
    (profile.jsHeap.bytes !== null &&
      (!Number.isInteger(profile.jsHeap.bytes) ||
        profile.jsHeap.bytes <= 0 ||
        profile.jsHeap.precision !== 'precise (--enable-precise-memory-info)'))
  )
    throw new Error(`${label} JS heap needs a value or reason`);
  const mapping = {
    medianFetchMs: 'fetchMs',
    medianParseMs: 'parseMs',
    medianUploadMs: 'uploadMs',
    medianTotalMs: 'totalMs',
  };
  for (const [
    aggregate,
    field,
  ] of /** @type {Array<[string, keyof BenchmarkTrial]>} */ (
    Object.entries(mapping)
  ))
    exact(
      profile.aggregates?.[aggregate],
      rounded(median(trials.map((trial) => trial[field]))),
      `${label}.${aggregate}`,
    );
  exact(
    profile.aggregates?.medianFrameMs,
    rounded(median(frameTimes)),
    `${label}.medianFrameMs`,
  );
  exact(
    profile.aggregates?.p95FrameMs,
    percentile(frameTimes, 0.95),
    `${label}.p95FrameMs`,
  );
  return true;
}

/**
 * @param {any} profile
 * @param {string} label
 * @param {Set<string>} browserLaunchIds
 * @param {Set<string>} contextIds
 */
function validateExecutionIsolation(
  profile,
  label,
  browserLaunchIds,
  contextIds,
) {
  if (profile.status !== 'available') return;
  const execution = profile.execution;
  if (
    !UUID_V4.test(execution?.browserLaunchId ?? '') ||
    !Number.isFinite(Date.parse(execution?.startedAt)) ||
    execution?.measurementIsolation !==
      'fresh Playwright BrowserContext, page, and WebGL2 context per measurement'
  )
    throw new Error(`${label} independent browser launch evidence is invalid`);
  if (browserLaunchIds.has(execution.browserLaunchId))
    throw new Error(`${label} independent run reused a browser launch`);
  browserLaunchIds.add(execution.browserLaunchId);
  const expectedRoles = [
    'warmup',
    'cold-1',
    'cold-2',
    'cold-3',
    'cold-4',
    'cold-5',
    'animation',
  ];
  if (
    !Array.isArray(execution.contexts) ||
    JSON.stringify(
      /** @type {Array<{id:string,role:string}>} */ (execution.contexts).map(
        (item) => item?.role,
      ),
    ) !== JSON.stringify(expectedRoles)
  )
    throw new Error(`${label} fresh measurement context roles are invalid`);
  for (const context of execution.contexts) {
    if (!UUID_V4.test(context?.id ?? '') || contextIds.has(context.id))
      throw new Error(`${label} contains a duplicate or invalid fresh context`);
    contextIds.add(context.id);
  }
}

/**
 * @param {any} record
 * @param {any} run
 * @param {string} key
 * @param {any} profile
 * @param {Set<string>} profilePayloadDigests
 */
function validateEvidenceBinding(
  record,
  run,
  key,
  profile,
  profilePayloadDigests,
) {
  if (profile.status !== 'available') return;
  const payloadDigest = digestJson({
    warmups: profile.warmups,
    trials: profile.trials,
    animationTrial: profile.animationTrial,
    frameTimesMs: profile.frameTimesMs,
    renderer: profile.renderer,
    cameraFit: profile.cameraFit,
    geometryBufferBytes: profile.geometryBufferBytes,
    jsHeap: profile.jsHeap,
    aggregates: profile.aggregates,
  });
  if (profilePayloadDigests.has(payloadDigest))
    throw new Error(`${key} copied measurements are not independent`);
  profilePayloadDigests.add(payloadDigest);
  for (const context of profile.execution.contexts) {
    if (
      !Number.isFinite(Date.parse(context.recordedAt)) ||
      context.digest !==
        measurementReceiptDigest(record, run, key, profile, context)
    )
      throw new Error(`${key} measurement receipt is not bound to its payload`);
  }
  if (
    profile.evidenceDigest !== profileEvidenceDigest(record, run, key, profile)
  )
    throw new Error(`${key} profile evidence digest is invalid`);
}

/** @param {any} profile @param {string} key @param {string} label */
function validateProfileMode(profile, key, label) {
  if (profile.status === 'unavailable') {
    if (
      profile.unavailableReason.length > 240 ||
      /[\r\n]|\/Users\/|\[pid=/i.test(profile.unavailableReason)
    )
      throw new Error(`${label} unavailable reason is not sanitized`);
  }
  if (key === 'nativeHardware') {
    if (
      profile.status === 'available' &&
      (JSON.stringify(profile.executionProtocol) !==
        JSON.stringify(NATIVE_EXECUTION_PROTOCOL) ||
        profile.renderer.unmasked !== true ||
        !/Apple|Metal/i.test(profile.renderer.renderer) ||
        /swiftshader|software|llvmpipe/i.test(profile.renderer.renderer))
    )
      throw new Error(
        'Native launch args or renderer are not proven hardware-backed',
      );
    return;
  }
  if (
    !/simulation; not a physical/i.test(profile.label) ||
    profile.cpuThrottlingRate !== 4 ||
    profile.rendererMode !== 'SwiftShader software rendering' ||
    (profile.status === 'available' &&
      (profile.renderer.unmasked !== true ||
        !/SwiftShader/i.test(profile.renderer.renderer))) ||
    profile.reducedLod?.method !== 'deterministic browser triangle sampling' ||
    profile.reducedLod.ratio !== 0.5 ||
    profile.reducedLod.productFallback !== true ||
    profile.reducedLod.distribution !==
      'evenly spaced across every primitive' ||
    profile.physicalDeviceConfirmationRequired !== true ||
    (profile.status === 'available' &&
      JSON.stringify(profile.executionProtocol) !==
        JSON.stringify(SIMULATION_EXECUTION_PROTOCOL))
  )
    throw new Error(
      'Low-power simulation; not a physical device, requires exact CPU throttling via CDP, launch args, SwiftShader, reduced LOD, and later physical confirmation',
    );
}

/** @param {number} bytes @param {any} budgets */
function payloadAssessment(bytes, budgets) {
  return {
    desktopTarget: bytes <= budgets.desktopTargetBytes,
    hardCeiling: bytes <= budgets.hardCeilingBytes,
    mobileInteractive: bytes <= budgets.mobileInteractiveBytes,
    hostPerFileCeiling: bytes <= budgets.hostPerFileCeilingBytes,
  };
}

/** @param {any} profile @param {number} minimumFps */
function performanceAssessment(profile, minimumFps) {
  if (profile.status !== 'available')
    return {
      status: 'unavailable',
      observedMedianFps: null,
      passes: null,
      reason: 'Profile unavailable; no performance score may be assigned.',
    };
  const observedMedianFps = rounded(1000 / profile.aggregates.medianFrameMs);
  return {
    status: 'measured',
    observedMedianFps,
    passes: observedMedianFps >= minimumFps,
    reason: null,
  };
}

/** @param {any} record @returns {any} */
export function validatePerformanceRecord(record) {
  if (!Number.isFinite(Date.parse(record?.generatedAt)))
    throw new Error('Benchmark generation timestamp is invalid');
  if (record?.schemaVersion !== 1)
    throw new Error('Performance record schema is invalid');
  if (JSON.stringify(record.source) !== JSON.stringify(SOURCE_CONTRACT))
    throw new Error(
      'Performance source must be the fixed Task 4 optimized GLB',
    );
  const expectedHarness = {
    path: HARNESS_PATH,
    sha256: sha256(readFileSync(new URL(import.meta.url))),
  };
  if (JSON.stringify(record.harness) !== JSON.stringify(expectedHarness))
    throw new Error('Benchmark harness identity does not match executed code');
  const observedScene = Object.fromEntries(
    Object.keys(FULL_SCENE_CONTRACT).map((key) => [key, record.scene?.[key]]),
  );
  if (JSON.stringify(observedScene) !== JSON.stringify(FULL_SCENE_CONTRACT))
    throw new Error(
      'Performance record does not describe the representative scene',
    );
  const observedReduced = Object.fromEntries(
    Object.keys(REDUCED_SCENE_CONTRACT).map((key) => [
      key,
      record.scene?.reducedSimulation?.[key],
    ]),
  );
  if (
    JSON.stringify(observedReduced) !== JSON.stringify(REDUCED_SCENE_CONTRACT)
  )
    throw new Error('Performance record reduced scene is not source-bound');
  if (
    JSON.stringify(record.scene?.cameraFit) !==
    JSON.stringify(CAMERA_FIT_CONTRACT)
  )
    throw new Error('Performance record camera fit does not prove visibility');
  const p = record.protocol;
  if (JSON.stringify(p) !== JSON.stringify(BENCHMARK_PROTOCOL))
    throw new Error('Benchmark protocol is incomplete');
  if (JSON.stringify(record.budgets) !== JSON.stringify(BUDGETS))
    throw new Error('Benchmark budgets differ from the frozen thresholds');
  if (
    !record.machine?.modelClass ||
    !record.machine?.chipModel ||
    !record.machine?.logicalCpuCount ||
    !record.machine?.ramBytes ||
    !record.machine?.gpuModel ||
    !record.machine?.gpuCores ||
    !record.machine?.graphicsApi ||
    !record.machine?.os ||
    !record.machine?.browser ||
    !record.machine?.browserVersion ||
    !record.machine?.browserRevision ||
    !record.machine?.browserBinarySha256 ||
    !record.machine?.powerState?.source ||
    !record.machine?.powerState?.supply ||
    !record.machine?.viewport ||
    !record.machine?.pixelRatio
  )
    throw new Error('Non-sensitive machine-class metadata is incomplete');
  const observedHost = Object.fromEntries(
    Object.keys(HOST_CONTRACT).map((key) => [key, record.machine?.[key]]),
  );
  if (
    JSON.stringify(observedHost) !== JSON.stringify(HOST_CONTRACT) ||
    record.machine.hostVerification?.status !== 'matched-frozen-reference'
  )
    throw new Error(
      'Benchmark host does not match the frozen reference device',
    );
  const observedEnvironment = {
    os: record.machine.os,
    browser: record.machine.browser,
    browserVersion: record.machine.browserVersion,
    browserRevision: record.machine.browserRevision,
    browserBinarySha256: record.machine.browserBinarySha256,
    viewport: record.machine.viewport,
    pixelRatio: record.machine.pixelRatio,
    powerState: record.machine.powerState,
  };
  if (
    JSON.stringify(observedEnvironment) !== JSON.stringify(ENVIRONMENT_CONTRACT)
  )
    throw new Error('Benchmark does not match the frozen test environment');
  if (JSON.stringify(record).match(/serial|hardwareuuid|platformuuid/i))
    throw new Error('Device identifiers are forbidden');
  if (!Array.isArray(record.runs) || record.runs.length !== 2)
    throw new Error('Exactly two benchmark runs must be retained');
  const retainedRuns = /** @type {BenchmarkRun[]} */ (record.runs);
  const availability = [];
  const runExecutionIds = new Set();
  const runStartedAt = new Set();
  const browserLaunchIds = new Set();
  const contextIds = new Set();
  const profilePayloadDigests = {
    nativeHardware: new Set(),
    lowPowerSimulation: new Set(),
  };
  for (const [runIndex, run] of retainedRuns.entries()) {
    if (run?.id !== `run-${runIndex + 1}`)
      throw new Error('Benchmark run identity is invalid');
    if (
      !UUID_V4.test(run.executionId ?? '') ||
      runExecutionIds.has(run.executionId) ||
      !Number.isFinite(Date.parse(run.startedAt)) ||
      runStartedAt.has(run.startedAt)
    )
      throw new Error('Retained independent run identities are invalid');
    runExecutionIds.add(run.executionId);
    runStartedAt.add(run.startedAt);
    for (const key of PROFILE_KEYS) {
      const label = `runs[${runIndex}].${key}`;
      const expectedGeometry =
        key === 'nativeHardware'
          ? FULL_SCENE_CONTRACT.geometryBufferBytes
          : REDUCED_SCENE_CONTRACT.geometryBufferBytes;
      availability.push(
        validateProfile(
          run?.[key],
          label,
          p,
          SOURCE_CONTRACT.bytes,
          expectedGeometry,
        ),
      );
      validateProfileMode(run[key], key, label);
      validateExecutionIsolation(run[key], label, browserLaunchIds, contextIds);
      validateEvidenceBinding(
        record,
        run,
        key,
        run[key],
        profilePayloadDigests[key],
      );
    }
  }
  if (
    JSON.stringify(record.profiles) !==
    JSON.stringify({
      nativeHardware: record.runs[1].nativeHardware,
      lowPowerSimulation: record.runs[1].lowPowerSimulation,
    })
  )
    throw new Error('Top-level profiles must reproduce retained run-2 exactly');
  const varianceKeys = /** @type {const} */ ({
    nativeHardware: 'nativeMedianFrameMsDelta',
    lowPowerSimulation: 'simulatedMedianFrameMsDelta',
  });
  /** @type {Record<string, number | null>} */
  const expectedDeltas = {};
  for (const [
    profileKey,
    varianceKey,
  ] of /** @type {Array<[keyof BenchmarkProfiles, string]>} */ (
    Object.entries(varianceKeys)
  )) {
    const pair = retainedRuns.map((run) => run[profileKey]);
    const expected = pair.every((profile) => profile.status === 'available')
      ? rounded(
          Math.abs(
            pair[0].aggregates.medianFrameMs - pair[1].aggregates.medianFrameMs,
          ),
        )
      : null;
    expectedDeltas[varianceKey] = expected;
    if (expected === null) {
      if (
        record.variance?.[varianceKey] !== null ||
        !record.variance?.unavailableReason
      )
        throw new Error(
          'Unavailable two-run variance needs null plus a reason',
        );
    } else exact(record.variance?.[varianceKey], expected, varianceKey);
  }
  const materialThreshold = finite(
    record.variance?.materialDifferenceThresholdMs,
    'materialDifferenceThresholdMs',
  );
  if (materialThreshold <= 0)
    throw new Error('materialDifferenceThresholdMs must be positive');
  const deltaValues = Object.values(expectedDeltas);
  const numericDeltas = deltaValues.filter((value) => value !== null);
  const deltasAvailable = numericDeltas.length === deltaValues.length;
  const expectedMaterialDifference = deltasAvailable
    ? numericDeltas.some((value) => value > materialThreshold)
    : null;
  if (
    record.variance.materialDifferenceObserved !== expectedMaterialDifference ||
    (deltasAvailable && record.variance.unavailableReason !== null)
  )
    throw new Error('Material variance assessment is not recomputable');
  const expectedPayload = payloadAssessment(
    record.source.bytes,
    record.budgets,
  );
  if (
    JSON.stringify(record.payloadAssessment) !== JSON.stringify(expectedPayload)
  )
    throw new Error('Payload budget assessment is not recomputable');
  const expectedPerformance = {
    native: performanceAssessment(
      record.profiles.nativeHardware,
      record.budgets.nativeTargetFps[0],
    ),
    simulated: performanceAssessment(
      record.profiles.lowPowerSimulation,
      record.budgets.simulatedGracefulFps,
    ),
  };
  if (
    JSON.stringify(record.performanceAssessment) !==
    JSON.stringify(expectedPerformance)
  )
    throw new Error('Frame-performance assessment is not recomputable');
  const complete = availability.every(Boolean);
  if (record.browserPerformanceComplete !== complete)
    throw new Error(
      'browser performance completeness contradicts profile availability',
    );
  return record;
}

/** @param {Buffer} glb */
async function startServer(glb) {
  const server = createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store, max-age=0');
    response.setHeader('Pragma', 'no-cache');
    if (request.url?.startsWith('/scene.glb')) {
      response.writeHead(200, {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': glb.length,
      });
      response.end(glb);
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(
      '<!doctype html><meta charset="utf-8"><title>SBLA-005 full benchmark</title>',
    );
  });
  await /** @type {Promise<void>} */ (
    new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    })
  );
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Benchmark server did not bind');
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

/** @param {import('@playwright/test').Page} page @param {string} url @param {number} reducedRatio @param {number} [frames] */
async function browserMeasurement(page, url, reducedRatio, frames = 0) {
  return page.evaluate(
    async (
      /** @type {{url:string, reducedRatio:number, frames:number}} */ {
        url,
        reducedRatio,
        frames,
      },
    ) => {
      /** @param {number} n */
      const round = (n) => Math.round(n * 1000) / 1000;
      const fetchStart = performance.now();
      const response = await fetch(`${url}?cold=${crypto.randomUUID()}`, {
        cache: 'no-store',
      });
      if (
        !response.ok ||
        response.headers.get('cache-control')?.includes('no-store') !== true
      )
        throw new Error('GLB no-store fetch failed');
      const buffer = await response.arrayBuffer();
      const fetchEnd = performance.now();
      const parseStart = performance.now();
      const view = new DataView(buffer);
      const jsonLength = view.getUint32(12, true);
      const json = JSON.parse(
        new TextDecoder()
          .decode(new Uint8Array(buffer, 20, jsonLength))
          .trimEnd(),
      );
      const binaryOffset = 20 + jsonLength + 8;
      const parseEnd = performance.now();
      const minimum = [Infinity, Infinity, Infinity];
      const maximum = [-Infinity, -Infinity, -Infinity];
      const objectBounds = [];
      for (const node of json.nodes) {
        const nodeMinimum = [Infinity, Infinity, Infinity];
        const nodeMaximum = [-Infinity, -Infinity, -Infinity];
        for (const primitive of json.meshes[node.mesh].primitives) {
          const accessor = json.accessors[primitive.attributes.POSITION];
          if (accessor.min?.length !== 3 || accessor.max?.length !== 3)
            throw new Error('Browser camera fit bounds are missing');
          for (let axis = 0; axis < 3; axis += 1) {
            const lower = accessor.min[axis] ?? Infinity;
            const upper = accessor.max[axis] ?? -Infinity;
            minimum[axis] = Math.min(minimum[axis] ?? Infinity, lower);
            maximum[axis] = Math.max(maximum[axis] ?? -Infinity, upper);
            nodeMinimum[axis] = Math.min(nodeMinimum[axis] ?? Infinity, lower);
            nodeMaximum[axis] = Math.max(nodeMaximum[axis] ?? -Infinity, upper);
          }
        }
        objectBounds.push({ min: nodeMinimum, max: nodeMaximum });
      }
      const center = minimum.map(
        (value, axis) => (value + (maximum[axis] ?? value)) / 2,
      );
      const half = minimum.map(
        (value, axis) => ((maximum[axis] ?? value) - value) / 2,
      );
      const radialExtent = Math.hypot(half[0] ?? 0, half[2] ?? 0);
      const fitExtent = Math.max(half[1] ?? 0, radialExtent);
      const clipMargin = 0.9;
      const scale = clipMargin / fitExtent;
      let clipViolationCount = 0;
      for (const bounds of objectBounds) {
        const x = Math.max(
          Math.abs((bounds.min[0] ?? 0) - (center[0] ?? 0)),
          Math.abs((bounds.max[0] ?? 0) - (center[0] ?? 0)),
        );
        const z = Math.max(
          Math.abs((bounds.min[2] ?? 0) - (center[2] ?? 0)),
          Math.abs((bounds.max[2] ?? 0) - (center[2] ?? 0)),
        );
        const y = Math.max(
          Math.abs((bounds.min[1] ?? 0) - (center[1] ?? 0)),
          Math.abs((bounds.max[1] ?? 0) - (center[1] ?? 0)),
        );
        if (
          Math.hypot(x, z) * scale > clipMargin + 1e-9 ||
          y * scale > clipMargin + 1e-9
        )
          clipViolationCount += 1;
      }
      const cameraFit = {
        min: minimum,
        max: maximum,
        center,
        clipMargin,
        scale,
        fullyInsideClipObjectCount: objectBounds.length - clipViolationCount,
        clipViolationCount,
      };
      if (clipViolationCount !== 0 || objectBounds.length !== 139)
        throw new Error('Browser camera fit does not contain every object');
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const gl = canvas.getContext('webgl2', { antialias: false });
      if (!gl) throw new Error('WebGL2 unavailable');
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = {
        vendor: String(
          debug
            ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL)
            : gl.getParameter(gl.VENDOR),
        ),
        renderer: String(
          debug
            ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER),
        ),
        unmasked: Boolean(debug),
        evidence: debug
          ? 'WEBGL_debug_renderer_info unmasked vendor and renderer'
          : 'masked WebGL fallback only',
      };
      /** @param {number} type @param {string} source */
      const shader = (type, source) => {
        const item = gl.createShader(type);
        if (!item) throw new Error('Could not create WebGL shader');
        gl.shaderSource(item, source);
        gl.compileShader(item);
        if (!gl.getShaderParameter(item, gl.COMPILE_STATUS))
          throw new Error(gl.getShaderInfoLog(item) ?? 'Shader compile failed');
        return item;
      };
      const program = gl.createProgram();
      if (!program) throw new Error('Could not create WebGL program');
      gl.attachShader(
        program,
        shader(
          gl.VERTEX_SHADER,
          '#version 300 es\nin vec3 p; in vec3 n; uniform float a; uniform vec3 center; uniform float fitScale; out float light; void main(){float c=cos(a),s=sin(a); vec3 d=p-center; vec3 q=vec3(c*d.x+s*d.z,d.y,-s*d.x+c*d.z); vec3 rn=vec3(c*n.x+s*n.z,n.y,-s*n.x+c*n.z); light=.35+.65*abs(dot(normalize(rn),normalize(vec3(.3,.7,.6)))); gl_Position=vec4(q*fitScale,1.0);}',
        ),
      );
      gl.attachShader(
        program,
        shader(
          gl.FRAGMENT_SHADER,
          '#version 300 es\nprecision mediump float; in float light; out vec4 o; void main(){o=vec4(vec3(.58,.24,.16)*light,1.);}',
        ),
      );
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program) ?? 'Program link failed');
      gl.useProgram(program);
      gl.enable(gl.DEPTH_TEST);
      const positionLocation = gl.getAttribLocation(program, 'p');
      const normalLocation = gl.getAttribLocation(program, 'n');
      const angle = gl.getUniformLocation(program, 'a');
      const centerLocation = gl.getUniformLocation(program, 'center');
      const scaleLocation = gl.getUniformLocation(program, 'fitScale');
      gl.uniform3fv(centerLocation, center);
      gl.uniform1f(scaleLocation, scale);
      /** @type {Array<{pb:WebGLBuffer, nb:WebGLBuffer, ib:WebGLBuffer, count:number, type:number}>} */
      const draws = [];
      let geometryBufferBytes = 0;
      const uploadStart = performance.now();
      for (const node of json.nodes)
        for (const primitive of json.meshes[node.mesh].primitives) {
          const pa = json.accessors[primitive.attributes.POSITION],
            na = json.accessors[primitive.attributes.NORMAL],
            ia = json.accessors[primitive.indices],
            pv = json.bufferViews[pa.bufferView],
            nv = json.bufferViews[na.bufferView],
            iv = json.bufferViews[ia.bufferView];
          const positionOffset =
            binaryOffset + (pv.byteOffset ?? 0) + (pa.byteOffset ?? 0);
          const normalOffset =
            binaryOffset + (nv.byteOffset ?? 0) + (na.byteOffset ?? 0);
          const sourcePositions = new Float32Array(
            buffer,
            positionOffset,
            pa.count * 3,
          );
          const sourceNormals = new Float32Array(
            buffer,
            normalOffset,
            na.count * 3,
          );
          const triangleCount = Math.floor(ia.count / 3);
          const keptTriangles = Math.max(
            1,
            Math.floor(triangleCount * reducedRatio),
          );
          const keep = keptTriangles * 3;
          const indexBytes = ia.componentType === 5125 ? 4 : 2;
          const indexOffset =
            binaryOffset + (iv.byteOffset ?? 0) + (ia.byteOffset ?? 0);
          const SourceIndices =
            ia.componentType === 5125 ? Uint32Array : Uint16Array;
          const sourceIndices = new SourceIndices(
            buffer,
            indexOffset,
            ia.count,
          );
          let positions;
          let normals;
          let indices;
          let drawType;
          if (reducedRatio === 1) {
            positions = new Uint8Array(buffer, positionOffset, pa.count * 12);
            normals = new Uint8Array(buffer, normalOffset, na.count * 12);
            indices = new Uint8Array(buffer, indexOffset, keep * indexBytes);
            drawType = ia.componentType;
          } else {
            /** @type {number[]} */
            const remappedIndices = [];
            /** @type {number[]} */
            const compactPositions = [];
            /** @type {number[]} */
            const compactNormals = [];
            /** @type {Map<number, number>} */
            const remap = new Map();
            for (let target = 0; target < keptTriangles; target += 1) {
              const sourceTriangle = Math.floor(
                (target * triangleCount) / keptTriangles,
              );
              const first = sourceIndices[sourceTriangle * 3];
              const second = sourceIndices[sourceTriangle * 3 + 1];
              const third = sourceIndices[sourceTriangle * 3 + 2];
              if (
                first === undefined ||
                second === undefined ||
                third === undefined
              )
                throw new Error(
                  'Reduced triangle sampling exceeded index data',
                );
              for (const sourceIndex of [first, second, third]) {
                let compactIndex = remap.get(sourceIndex);
                if (compactIndex === undefined) {
                  compactIndex = remap.size;
                  remap.set(sourceIndex, compactIndex);
                  for (let axis = 0; axis < 3; axis += 1) {
                    const position = sourcePositions[sourceIndex * 3 + axis];
                    const normal = sourceNormals[sourceIndex * 3 + axis];
                    if (position === undefined || normal === undefined)
                      throw new Error(
                        'Reduced triangle references missing vertex data',
                      );
                    compactPositions.push(position);
                    compactNormals.push(normal);
                  }
                }
                remappedIndices.push(compactIndex);
              }
            }
            positions = new Float32Array(compactPositions);
            normals = new Float32Array(compactNormals);
            if (remap.size <= 65_535) {
              indices = new Uint16Array(remappedIndices);
              drawType = gl.UNSIGNED_SHORT;
            } else {
              indices = new Uint32Array(remappedIndices);
              drawType = gl.UNSIGNED_INT;
            }
          }
          const pb = gl.createBuffer();
          if (!pb) throw new Error('Could not create position buffer');
          gl.bindBuffer(gl.ARRAY_BUFFER, pb);
          gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
          const nb = gl.createBuffer();
          if (!nb) throw new Error('Could not create normal buffer');
          gl.bindBuffer(gl.ARRAY_BUFFER, nb);
          gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
          const ib = gl.createBuffer();
          if (!ib) throw new Error('Could not create index buffer');
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
          draws.push({ pb, nb, ib, count: keep, type: drawType });
          geometryBufferBytes +=
            positions.byteLength + normals.byteLength + indices.byteLength;
        }
      /** @param {number} a */
      const draw = (a) => {
        gl.uniform1f(angle, a);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (const item of draws) {
          gl.bindBuffer(gl.ARRAY_BUFFER, item.pb);
          gl.enableVertexAttribArray(positionLocation);
          gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, item.nb);
          gl.enableVertexAttribArray(normalLocation);
          gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, item.ib);
          gl.drawElements(gl.TRIANGLES, item.count, item.type, 0);
        }
      };
      draw(0);
      gl.finish();
      const uploadEnd = performance.now();
      const frameTimesMs = [];
      for (let i = -30; i < frames; i += 1) {
        const before = performance.now();
        await new Promise(requestAnimationFrame);
        draw(i / 120);
        gl.finish();
        const elapsed = performance.now() - before;
        if (i >= 0) frameTimesMs.push(round(elapsed));
      }
      const resources = /** @type {PerformanceResourceTiming[]} */ (
        performance.getEntriesByName(response.url)
      );
      const transferSize = resources.at(-1)?.transferSize;
      const transferredBytes =
        typeof transferSize === 'number' && transferSize > 0
          ? transferSize
          : buffer.byteLength;
      const memory =
        /** @type {Performance & {memory?: {usedJSHeapSize:number}}} */ (
          performance
        ).memory;
      return {
        trial: {
          transferredBytes,
          fetchMs: round(fetchEnd - fetchStart),
          parseMs: round(parseEnd - parseStart),
          uploadMs: round(uploadEnd - uploadStart),
          totalMs: round(uploadEnd - fetchStart),
        },
        frameTimesMs,
        renderer,
        cameraFit,
        geometryBufferBytes,
        jsHeap: memory?.usedJSHeapSize
          ? {
              bytes: memory.usedJSHeapSize,
              unavailableReason: null,
              precision: 'precise (--enable-precise-memory-info)',
            }
          : {
              bytes: null,
              unavailableReason:
                'performance.memory is unavailable in this Chromium context',
              precision: null,
            },
      };
    },
    { url, reducedRatio, frames },
  );
}

/** @param {BenchmarkTrial[]} trials @param {number[]} frames */
function aggregates(trials, frames) {
  return {
    medianFetchMs: rounded(median(trials.map((v) => v.fetchMs))),
    medianParseMs: rounded(median(trials.map((v) => v.parseMs))),
    medianUploadMs: rounded(median(trials.map((v) => v.uploadMs))),
    medianTotalMs: rounded(median(trials.map((v) => v.totalMs))),
    medianFrameMs: rounded(median(frames)),
    p95FrameMs: percentile(frames, 0.95),
  };
}

/** @param {unknown} error */
function unavailableReason(error) {
  const message = String(error instanceof Error ? error.message : error);
  if (
    /bootstrap_check_in|MachPortRendezvousServer|Permission denied \(1100\)/i.test(
      message,
    )
  )
    return 'Chromium launch unavailable in this sandbox: macOS Mach service registration was denied.';
  if (/native Chromium renderer was not hardware-backed/i.test(message))
    return (message.split(/\r?\n/, 1)[0] ?? message).slice(0, 240);
  if (/simulation did not reproduce SwiftShader/i.test(message))
    return (message.split(/\r?\n/, 1)[0] ?? message).slice(0, 240);
  return `Browser profile unavailable: ${message.split(/\r?\n/, 1)[0]}`.slice(
    0,
    240,
  );
}

function localMachineEvidence() {
  /** @param {string} command @param {string[]} args */
  const capture = (command, args) => {
    try {
      return execFileSync(command, args, { encoding: 'utf8' }).trim();
    } catch {
      return '';
    }
  };
  const power = capture('pmset', ['-g', 'batt']);
  const supply =
    power.match(/Now drawing from '([^']+)'/)?.[1] ?? 'unavailable';
  const macVersion = capture('sw_vers', ['-productVersion']);
  const browserExecutable = chromium.executablePath();
  const browserRevision = browserExecutable.match(/chromium-(\d+)/)?.[1] ?? '';
  const displayText = capture('system_profiler', [
    'SPDisplaysDataType',
    '-json',
  ]);
  /** @type {any} */
  const display = displayText ? JSON.parse(displayText) : {};
  const gpu = display.SPDisplaysDataType?.[0] ?? {};
  const metal =
    gpu.spdisplays_mtlgpufamilysupport === 'spdisplays_metal4'
      ? 'Metal 4'
      : String(gpu.spdisplays_mtlgpufamilysupport ?? 'unavailable');
  const detected = {
    modelClass: capture('sysctl', ['-n', 'hw.model']),
    chipModel: capture('sysctl', ['-n', 'machdep.cpu.brand_string']),
    logicalCpuCount: Number(capture('sysctl', ['-n', 'hw.logicalcpu'])),
    ramBytes: Number(capture('sysctl', ['-n', 'hw.memsize'])),
    gpuModel: String(gpu.sppci_model ?? 'unavailable'),
    gpuCores: Number(gpu.sppci_cores),
    graphicsApi: metal,
  };
  if (JSON.stringify(detected) !== JSON.stringify(HOST_CONTRACT))
    throw new Error(
      `Benchmark host does not match frozen reference: ${JSON.stringify(detected)}`,
    );
  return {
    ...detected,
    hostVerification: {
      status: 'matched-frozen-reference',
      method:
        'live sysctl plus selected non-sensitive system_profiler display fields',
    },
    os: macVersion
      ? `macOS ${macVersion} (${process.platform} ${process.arch})`
      : `${process.platform} ${process.arch}`,
    browser: 'Playwright Chromium 1.62.1',
    browserVersion: ENVIRONMENT_CONTRACT.browserVersion,
    browserRevision,
    browserBinarySha256: sha256(readFileSync(browserExecutable)),
    powerState: {
      source: 'pmset -g batt',
      supply,
    },
    viewport: { width: 1280, height: 720 },
    pixelRatio: 1,
  };
}

/**
 * @param {string} origin
 * @param {{native:boolean,args:string[],cpuRate:number,ratio:number,expectedGeometryBufferBytes:number,expectedCameraFit:any}} options
 */
async function runProfile(origin, options) {
  /** @type {import('@playwright/test').Browser | undefined} */
  let browser;
  const startedAt = new Date().toISOString();
  const browserLaunchId = randomUUID();
  const executionProtocol = options.native
    ? NATIVE_EXECUTION_PROTOCOL
    : SIMULATION_EXECUTION_PROTOCOL;
  if (
    JSON.stringify(options.args) !==
      JSON.stringify(executionProtocol.launchArgs) ||
    options.cpuRate !== executionProtocol.cpuThrottling.rate
  )
    throw new Error('Requested profile differs from frozen execution protocol');
  /** @type {Array<{id:string,role:string,recordedAt:string,digest?:string}>} */
  const contexts = [];
  try {
    const launchedBrowser = await chromium.launch({
      headless: true,
      args: options.args,
    });
    browser = launchedBrowser;
    if (launchedBrowser.version() !== ENVIRONMENT_CONTRACT.browserVersion)
      throw new Error(
        `Chromium browser version differs from frozen profile: ${launchedBrowser.version()}`,
      );
    /** @param {string} role @param {number} [frames] */
    const measureFreshContext = async (role, frames = 0) => {
      const contextId = randomUUID();
      const context = await launchedBrowser.newContext({
        viewport: ENVIRONMENT_CONTRACT.viewport,
        deviceScaleFactor: ENVIRONMENT_CONTRACT.pixelRatio,
      });
      const page = await context.newPage();
      try {
        if (options.cpuRate > 1) {
          const session = await context.newCDPSession(page);
          await session.send('Emulation.setCPUThrottlingRate', {
            rate: options.cpuRate,
          });
        }
        await page.goto(origin);
        const measurement = await browserMeasurement(
          page,
          `${origin}/scene.glb`,
          options.ratio,
          frames,
        );
        contexts.push({
          id: contextId,
          role,
          recordedAt: new Date().toISOString(),
        });
        return measurement;
      } finally {
        await context.close();
      }
    };
    const expectedGeometryBufferBytes = options.expectedGeometryBufferBytes;
    const measurements = [];
    const warm = await measureFreshContext('warmup');
    measurements.push(warm);
    /** @type {BenchmarkTrial[]} */
    const trials = [];
    for (let i = 0; i < 5; i += 1) {
      const measured = await measureFreshContext(`cold-${i + 1}`);
      measurements.push(measured);
      trials.push(measured.trial);
    }
    const animated = await measureFreshContext('animation', 300);
    measurements.push(animated);
    if (
      measurements.some(
        (measurement) =>
          measurement.geometryBufferBytes !== expectedGeometryBufferBytes,
      )
    )
      throw new Error(
        `browser geometry bytes did not match the checksum-bound scene: expected ${expectedGeometryBufferBytes}`,
      );
    if (
      measurements.some(
        (measurement) =>
          JSON.stringify(measurement.cameraFit) !==
          JSON.stringify(options.expectedCameraFit),
      )
    )
      throw new Error('browser camera fit differs from the source-bound fit');
    if (
      measurements.some(
        (measurement) =>
          JSON.stringify(measurement.renderer) !==
          JSON.stringify(animated.renderer),
      )
    )
      throw new Error('WebGL identity changed between benchmark trials');
    const profile = {
      status: 'available',
      browserVersion: launchedBrowser.version(),
      headless: true,
      geometryBufferBytes: animated.geometryBufferBytes,
      cameraFit: animated.cameraFit,
      renderer: animated.renderer,
      jsHeap: animated.jsHeap,
      execution: {
        browserLaunchId,
        startedAt,
        measurementIsolation:
          'fresh Playwright BrowserContext, page, and WebGL2 context per measurement',
        contexts,
      },
      executionProtocol,
      warmups: [warm.trial],
      trials,
      animationTrial: animated.trial,
      frameTimesMs: animated.frameTimesMs,
      aggregates: aggregates(trials, animated.frameTimesMs),
    };
    if (
      options.native &&
      /swiftshader|software|llvmpipe/i.test(profile.renderer.renderer)
    )
      throw new Error(
        `native Chromium renderer was not hardware-backed: ${profile.renderer.renderer}`,
      );
    if (!options.native && !/swiftshader/i.test(profile.renderer.renderer))
      throw new Error(
        `simulation did not reproduce SwiftShader: ${profile.renderer.renderer}`,
      );
    if (!options.native)
      Object.assign(profile, {
        label: 'conservative simulation; not a physical low-tier device',
        cpuThrottlingRate: options.cpuRate,
        rendererMode: 'SwiftShader software rendering',
        reducedLod: {
          method: 'deterministic browser triangle sampling',
          ratio: options.ratio,
          productFallback: true,
          distribution: 'evenly spaced across every primitive',
        },
        physicalDeviceConfirmationRequired: true,
      });
    return profile;
  } catch (error) {
    return {
      status: 'unavailable',
      unavailableReason: unavailableReason(error),
      warmups: [],
      trials: [],
      frameTimesMs: [],
      aggregates: null,
      ...(options.native
        ? {}
        : {
            label: 'conservative simulation; not a physical low-tier device',
            cpuThrottlingRate: options.cpuRate,
            rendererMode: 'SwiftShader software rendering',
            reducedLod: {
              method: 'deterministic browser triangle sampling',
              ratio: options.ratio,
              productFallback: true,
              distribution: 'evenly spaced across every primitive',
            },
            physicalDeviceConfirmationRequired: true,
          }),
    };
  } finally {
    await browser?.close();
  }
}

export async function runFullBenchmark() {
  const [glb, manifestBytes] = await Promise.all([
    readFile(GLB_PATH),
    readFile(MANIFEST_PATH),
  ]);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const scene = validateRepresentativeScene(glb, manifest);
  const parsed = parseGlb(glb);
  const reducedSimulation = summarizeScene(parsed, 0.5);
  const cameraFit = sceneCameraFit(parsed);
  if (JSON.stringify(cameraFit) !== JSON.stringify(CAMERA_FIT_CONTRACT))
    throw new Error('Source camera fit differs from the frozen contract');
  const machine = localMachineEvidence();
  const { server, origin } = await startServer(glb);
  /** @type {BenchmarkRun[]} */
  const runs = [];
  try {
    for (let index = 0; index < 2; index += 1) {
      const startedAt = new Date().toISOString();
      runs.push({
        id: `run-${index + 1}`,
        executionId: randomUUID(),
        startedAt,
        nativeHardware: await runProfile(origin, {
          native: true,
          args: [...NATIVE_EXECUTION_PROTOCOL.launchArgs],
          cpuRate: 1,
          ratio: 1,
          expectedGeometryBufferBytes: scene.geometryBufferBytes,
          expectedCameraFit: cameraFit,
        }),
        lowPowerSimulation: await runProfile(origin, {
          native: false,
          args: [...SIMULATION_EXECUTION_PROTOCOL.launchArgs],
          cpuRate: 4,
          ratio: 0.5,
          expectedGeometryBufferBytes: reducedSimulation.geometryBufferBytes,
          expectedCameraFit: cameraFit,
        }),
      });
    }
  } finally {
    await /** @type {Promise<void>} */ (
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      )
    );
  }
  const firstRun = runs[0];
  const finalRun = runs[1];
  if (!firstRun || !finalRun || runs.length !== 2)
    throw new Error('Exactly two benchmark runs were not produced');
  const native = finalRun.nativeHardware;
  const simulated = finalRun.lowPowerSimulation;
  /** @param {'nativeHardware'|'lowPowerSimulation'} key */
  const delta = (key) =>
    runs.every((run) => run[key].status === 'available')
      ? rounded(
          Math.abs(
            firstRun[key].aggregates.medianFrameMs -
              finalRun[key].aggregates.medianFrameMs,
          ),
        )
      : null;
  const nativeDelta = delta('nativeHardware');
  const simulatedDelta = delta('lowPowerSimulation');
  const record = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    harness: {
      path: HARNESS_PATH,
      sha256: sha256(readFileSync(new URL(import.meta.url))),
    },
    source: {
      kind: 'task4-optimized-glb',
      path: manifest.artifacts.glb.path,
      bytes: glb.length,
      sha256: sha256(glb),
      conversionManifestSha256: sha256(manifestBytes),
    },
    budgets: BUDGETS,
    payloadAssessment: payloadAssessment(glb.length, BUDGETS),
    scene: {
      ...scene,
      names: undefined,
      contextRule:
        'every Task 4 optimized selectable mapped object; no source OBJ or cherry-picked sample',
      cameraFit,
      reducedSimulation: {
        objects: reducedSimulation.objects,
        meshes: reducedSimulation.meshes,
        drawCalls: reducedSimulation.drawCalls,
        vertices: reducedSimulation.vertices,
        triangles: reducedSimulation.triangles,
        geometryBufferBytes: reducedSimulation.geometryBufferBytes,
        positionBytes: reducedSimulation.positionBytes,
        normalBytes: reducedSimulation.normalBytes,
        indexBytes: reducedSimulation.indexBytes,
        method: 'deterministic browser triangle sampling',
        ratio: 0.5,
        productFallback: true,
      },
    },
    protocol: BENCHMARK_PROTOCOL,
    machine,
    profiles: { nativeHardware: native, lowPowerSimulation: simulated },
    runs,
    variance: {
      nativeMedianFrameMsDelta: nativeDelta,
      simulatedMedianFrameMsDelta: simulatedDelta,
      unavailableReason:
        nativeDelta === null || simulatedDelta === null
          ? 'At least one retained run profile was unavailable, so variance is not measurable.'
          : null,
      materialDifferenceThresholdMs: 2,
      materialDifferenceObserved:
        nativeDelta !== null && simulatedDelta !== null
          ? nativeDelta > 2 || simulatedDelta > 2
          : null,
    },
    performanceAssessment: {
      native: performanceAssessment(native, 55),
      simulated: performanceAssessment(simulated, 30),
    },
    browserPerformanceComplete: runs.every(
      (run) =>
        run.nativeHardware.status === 'available' &&
        run.lowPowerSimulation.status === 'available',
    ),
  };
  return validatePerformanceRecord(bindPerformanceEvidence(record));
}

const isMain =
  process.argv[1] &&
  pathToFileURL(fileURLToPath(new URL(process.argv[1], 'file:'))).href ===
    import.meta.url;
if (isMain) {
  const record = await runFullBenchmark();
  if (process.argv.includes('--write'))
    await writeFile(
      OUTPUT_PATH,
      await format(JSON.stringify(record), {
        parser: 'json',
        endOfLine: 'lf',
      }),
    );
  console.log(JSON.stringify(record, null, 2));
}
