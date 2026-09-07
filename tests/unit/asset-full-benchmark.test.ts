import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  bindPerformanceEvidence,
  parseGlb,
  percentile,
  sceneCameraFit,
  summarizeScene,
  validatePerformanceRecord,
  validateRepresentativeScene,
} from '../../scripts/assets/full-benchmark.mjs';

type Trial = ReturnType<typeof trial>;
type MutableProfile = {
  status: string;
  unavailableReason?: string;
  renderer?: {
    vendor: string;
    renderer: string;
    unmasked: boolean;
    evidence: string;
  };
  browserVersion?: string;
  headless?: boolean;
  geometryBufferBytes?: number;
  jsHeap?: {
    bytes: number | null;
    unavailableReason: string | null;
    precision: string | null;
  };
  warmups: Trial[];
  trials: Trial[];
  frameTimesMs: number[];
  aggregates: {
    medianFetchMs?: number;
    medianParseMs?: number;
    medianUploadMs?: number;
    medianTotalMs?: number;
    medianFrameMs?: number;
    p95FrameMs?: number;
  } | null;
  [key: string]: unknown;
};
type MutableRun = {
  id: string;
  executionId: string;
  startedAt: string;
  nativeHardware: MutableProfile;
  lowPowerSimulation: MutableProfile;
};
type PerformanceAssessment = {
  status: string;
  observedMedianFps: number | null;
  passes: boolean | null;
  reason: string | null;
};
type MutableRecord = {
  profiles: {
    nativeHardware: MutableProfile;
    lowPowerSimulation: MutableProfile;
  };
  runs: [MutableRun, MutableRun];
  variance: {
    nativeMedianFrameMsDelta: number | null;
    simulatedMedianFrameMsDelta: number | null;
    unavailableReason: string | null;
    materialDifferenceThresholdMs: number;
    materialDifferenceObserved: boolean | null;
  };
  payloadAssessment: Record<string, boolean>;
  performanceAssessment: {
    native: PerformanceAssessment;
    simulated: PerformanceAssessment;
  };
  browserPerformanceComplete: boolean;
  [key: string]: unknown;
};

const manifestUrl = new URL(
  '../../docs/licenses/bodyparts3d-conversion-manifest.json',
  import.meta.url,
);
const glbUrl = new URL(
  '../../assets/derived/bodyparts3d/sbla005-representative.glb',
  import.meta.url,
);
const harnessUrl = new URL(
  '../../scripts/assets/full-benchmark.mjs',
  import.meta.url,
);
const uuid = (value: number) =>
  `00000000-0000-4000-8000-${String(value).padStart(12, '0')}`;
async function acceptedScene() {
  return {
    manifest: JSON.parse(await readFile(manifestUrl, 'utf8')),
    glb: await readFile(glbUrl),
  };
}
const trial = (n: number) => ({
  transferredBytes: 2_874_932,
  fetchMs: n,
  parseMs: n + 1,
  uploadMs: n + 2,
  totalMs: n * 3 + 3,
});
const cameraFit = {
  min: [-0.3205469250679016, -0.03798341378569603, -0.024905577301979065],
  max: [0.32054707407951355, 1.5065789222717285, 0.21879054605960846],
  center: [7.450580596923828e-8, 0.7342977542430162, 0.0969424843788147],
  clipMargin: 0.9,
  scale: 1.1653786694000279,
  fullyInsideClipObjectCount: 139,
  clipViolationCount: 0,
};
function profile(status = 'available', seed = 1): MutableProfile {
  if (status === 'unavailable')
    return {
      status,
      unavailableReason: 'renderer proof unavailable',
      warmups: [],
      trials: [],
      frameTimesMs: [],
      aggregates: null,
    };
  const offset = seed * 10;
  const trials = [1, 2, 3, 4, 5].map((value) => trial(value + offset));
  const frames = Array.from({ length: 300 }, (_, i) => 10 + i / 100);
  return {
    status,
    renderer: {
      vendor: 'Google Inc.',
      renderer: 'ANGLE (Apple, Apple M3, Metal)',
      unmasked: true,
      evidence: 'WEBGL_debug_renderer_info unmasked vendor and renderer',
    },
    browserVersion: '151.0.7922.34',
    headless: true,
    geometryBufferBytes: 2_753_652,
    cameraFit: structuredClone(cameraFit),
    execution: {
      browserLaunchId: uuid(seed),
      startedAt: `2026-09-07T18:00:${String(seed).padStart(2, '0')}.000Z`,
      measurementIsolation:
        'fresh Playwright BrowserContext, page, and WebGL2 context per measurement',
      contexts: [
        'warmup',
        'cold-1',
        'cold-2',
        'cold-3',
        'cold-4',
        'cold-5',
        'animation',
      ].map((role, index) => ({
        id: uuid(seed * 100 + index),
        role,
        recordedAt: `2026-09-07T18:01:${String(index).padStart(2, '0')}.000Z`,
      })),
    },
    executionProtocol: {
      launchArgs: ['--use-angle=metal', '--enable-precise-memory-info'],
      cpuThrottling: { method: 'none', rate: 1 },
      browserEngine: 'Chromium',
      playwrightVersion: '1.62.1',
    },
    jsHeap: {
      bytes: null,
      unavailableReason: 'performance.memory unavailable',
      precision: null,
    },
    warmups: [trial(offset)],
    trials,
    animationTrial: trial(offset + 6),
    frameTimesMs: frames,
    aggregates: {
      medianFetchMs: offset + 3,
      medianParseMs: offset + 4,
      medianUploadMs: offset + 5,
      medianTotalMs: offset * 3 + 12,
      medianFrameMs: 11.495,
      p95FrameMs: percentile(frames, 0.95),
    },
  };
}
function validRecord(): MutableRecord {
  const nativeRun1 = profile('available', 11);
  const nativeRun2 = profile('available', 12);
  const simulation = (seed: number) => ({
    ...profile('available', seed),
    renderer: {
      vendor: 'Google Inc.',
      renderer: 'ANGLE (SwiftShader)',
      unmasked: true,
      evidence: 'WEBGL_debug_renderer_info unmasked vendor and renderer',
    },
    label: 'conservative simulation; not a physical low-tier device',
    cpuThrottlingRate: 4,
    rendererMode: 'SwiftShader software rendering',
    geometryBufferBytes: 2_088_090,
    reducedLod: {
      method: 'deterministic browser triangle sampling',
      ratio: 0.5,
      productFallback: true,
      distribution: 'evenly spaced across every primitive',
    },
    physicalDeviceConfirmationRequired: true,
    executionProtocol: {
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
    },
  });
  const simulationRun1 = simulation(21);
  const simulationRun2 = simulation(22);
  const record = {
    schemaVersion: 1,
    generatedAt: '2026-09-07T18:00:00.000Z',
    harness: {
      path: 'scripts/assets/full-benchmark.mjs',
      sha256: createHash('sha256')
        .update(readFileSync(harnessUrl))
        .digest('hex'),
    },
    source: {
      kind: 'task4-optimized-glb',
      path: 'assets/derived/bodyparts3d/sbla005-representative.glb',
      bytes: 2_874_932,
      sha256:
        'b51f1fadbf84a5d1c439e5ca6af175397bee054306850d414f23178fb12cf5a7',
      conversionManifestSha256:
        '8d2cb6813a49be110c47729da208f3093b74788e7ae479b55e6f8abdef684d5d',
    },
    budgets: {
      desktopTargetBytes: 6_000_000,
      hardCeilingBytes: 10_000_000,
      mobileInteractiveBytes: 3_000_000,
      hostPerFileCeilingBytes: 26_214_400,
      nativeTargetFps: [55, 60],
      simulatedGracefulFps: 30,
    },
    payloadAssessment: {
      desktopTarget: true,
      hardCeiling: true,
      mobileInteractive: true,
      hostPerFileCeiling: true,
    },
    scene: {
      objects: 139,
      meshes: 139,
      drawCalls: 139,
      vertices: 87_949,
      triangles: 107_146,
      geometryBufferBytes: 2_753_652,
      positionBytes: 1_055_388,
      normalBytes: 1_055_388,
      indexBytes: 642_876,
      contextRule:
        'every Task 4 optimized selectable mapped object; no source OBJ or cherry-picked sample',
      reducedSimulation: {
        objects: 139,
        meshes: 139,
        drawCalls: 139,
        vertices: 73_619,
        triangles: 53_539,
        geometryBufferBytes: 2_088_090,
        positionBytes: 883_428,
        normalBytes: 883_428,
        indexBytes: 321_234,
        method: 'deterministic browser triangle sampling',
        ratio: 0.5,
        productFallback: true,
      },
      cameraFit: structuredClone(cameraFit),
    },
    protocol: {
      cache: 'no-store',
      warmupTrials: 1,
      measuredColdTrials: 5,
      stabilizedAnimationFrames: 300,
      stabilizationFramesDiscarded: 30,
      glFinish: true,
      coldDefinition:
        'unique no-store URL; fresh Playwright BrowserContext, page, WebGL2 context, parse, and GPU buffers per measurement',
    },
    machine: {
      modelClass: 'Mac15,12',
      chipModel: 'Apple M3',
      logicalCpuCount: 8,
      ramBytes: 17_179_869_184,
      gpuModel: 'Apple M3',
      gpuCores: 8,
      graphicsApi: 'Metal 4',
      hostVerification: {
        status: 'matched-frozen-reference',
        method:
          'live sysctl plus selected non-sensitive system_profiler display fields',
      },
      os: 'macOS 26.6.2 (darwin arm64)',
      browser: 'Playwright Chromium 1.62.1',
      browserVersion: '151.0.7922.34',
      browserRevision: '1234',
      browserBinarySha256:
        'a596b1cfc6353e987fcec8d71a23a28cd6a9e7a6b4e20b908e4c4fcffe51158e',
      powerState: { source: 'pmset -g batt', supply: 'Battery Power' },
      viewport: { width: 1280, height: 720 },
      pixelRatio: 1,
    },
    profiles: {
      nativeHardware: nativeRun2,
      lowPowerSimulation: simulationRun2,
    },
    runs: [
      {
        id: 'run-1',
        executionId: uuid(101),
        startedAt: '2026-09-07T18:01:00.000Z',
        nativeHardware: nativeRun1,
        lowPowerSimulation: simulationRun1,
      },
      {
        id: 'run-2',
        executionId: uuid(102),
        startedAt: '2026-09-07T18:02:00.000Z',
        nativeHardware: nativeRun2,
        lowPowerSimulation: simulationRun2,
      },
    ],
    variance: {
      nativeMedianFrameMsDelta: 0,
      simulatedMedianFrameMsDelta: 0,
      unavailableReason: null,
      materialDifferenceThresholdMs: 2,
      materialDifferenceObserved: false,
    },
    performanceAssessment: {
      native: {
        status: 'measured',
        observedMedianFps: 86.994,
        passes: true,
        reason: null,
      },
      simulated: {
        status: 'measured',
        observedMedianFps: 86.994,
        passes: true,
        reason: null,
      },
    },
    browserPerformanceComplete: true,
  } as MutableRecord;
  return bindPerformanceEvidence(record) as MutableRecord;
}

describe('complete representative browser benchmark', () => {
  it('accepts only the checksum-bound Task 4 GLB with its complete distinct scene', async () => {
    const { manifest, glb } = await acceptedScene();
    const parsed = parseGlb(glb);
    expect(() => validateRepresentativeScene(glb, manifest)).not.toThrow();
    expect(summarizeScene(parsed)).toMatchObject({
      objects: 139,
      meshes: 139,
      drawCalls: 139,
      vertices: 87_949,
      triangles: 107_146,
      normalBytes: 1_055_388,
      geometryBufferBytes: 2_753_652,
    });
    const reduced = summarizeScene(parsed, 0.5);
    expect(reduced.objects).toBe(139);
    expect(reduced.drawCalls).toBe(139);
    expect(reduced.triangles).toBe(53_539);
    expect(reduced.vertices).toBeLessThan(87_949);
    expect(reduced.normalBytes).toBe(reduced.positionBytes);
    expect(reduced.geometryBufferBytes).toBeLessThan(2_753_652);
    expect(sceneCameraFit(parsed)).toEqual(cameraFit);
  });
  it('rejects missing, extra, duplicate, tampered, and source-OBJ substitutes', async () => {
    const { manifest, glb } = await acceptedScene();
    const missing = parseGlb(glb);
    missing.json.nodes.pop();
    expect(() => validateRepresentativeScene(missing, manifest)).toThrow(
      /missing|count/i,
    );
    const extra = parseGlb(glb);
    extra.json.nodes.push({ ...extra.json.nodes[0], name: 'EXTRA' });
    expect(() => validateRepresentativeScene(extra, manifest)).toThrow(
      /extra|count/i,
    );
    const duplicate = parseGlb(glb);
    duplicate.json.nodes[1].name = duplicate.json.nodes[0].name;
    expect(() => validateRepresentativeScene(duplicate, manifest)).toThrow(
      /duplicate/i,
    );
    const tampered = Buffer.from(glb);
    const finalByte = tampered.length - 1;
    tampered[finalByte] = (tampered[finalByte] ?? 0) ^ 1;
    expect(() => validateRepresentativeScene(tampered, manifest)).toThrow(
      /SHA-256/i,
    );
    expect(() =>
      validateRepresentativeScene(Buffer.from('v 0 0 0\nf 1 1 1'), manifest),
    ).toThrow(/GLB|substitute/i);
  });
  it('recomputes every aggregate from five trials and 300 raw frames', () => {
    expect(() => validatePerformanceRecord(validRecord())).not.toThrow();
    const changed = validRecord();
    changed.profiles.nativeHardware.aggregates!.medianTotalMs! += 1;
    expect(() => validatePerformanceRecord(changed)).toThrow(/medianTotalMs/i);
    const short = validRecord();
    short.profiles.lowPowerSimulation.frameTimesMs.pop();
    expect(() => validatePerformanceRecord(short)).toThrow(/300/);
    const retainedRun = validRecord();
    retainedRun.runs[0].nativeHardware.aggregates!.medianFrameMs! += 1;
    expect(() => validatePerformanceRecord(retainedRun)).toThrow(
      /medianFrameMs/i,
    );
    const variance = validRecord();
    variance.variance.nativeMedianFrameMsDelta = 1;
    expect(() => validatePerformanceRecord(variance)).toThrow(
      /nativeMedianFrameMsDelta/i,
    );
    const payload = validRecord();
    payload.payloadAssessment.mobileInteractive = false;
    expect(() => validatePerformanceRecord(payload)).toThrow(/payload budget/i);
    const impossibleScene = validRecord();
    impossibleScene.scene = {
      ...(impossibleScene.scene as Record<string, unknown>),
      objects: 1,
      geometryBufferBytes: 1,
    };
    expect(() => validatePerformanceRecord(impossibleScene)).toThrow(
      /representative scene/i,
    );
    const impossibleTransfer = validRecord();
    impossibleTransfer.runs[0].nativeHardware.trials[0]!.transferredBytes = 1;
    expect(() => validatePerformanceRecord(impossibleTransfer)).toThrow(
      /transferredBytes/i,
    );
    const absentAggregate = validRecord();
    delete absentAggregate.runs[0].nativeHardware.aggregates!.medianFrameMs;
    expect(() => validatePerformanceRecord(absentAggregate)).toThrow(/finite/i);
  });
  it('requires renderer proof, simulation labeling, reduced LOD, and two runs', () => {
    const software = validRecord();
    software.profiles.nativeHardware.renderer!.renderer = 'ANGLE (SwiftShader)';
    expect(() => validatePerformanceRecord(software)).toThrow(
      /hardware-backed/i,
    );
    const physical = validRecord();
    physical.profiles.lowPowerSimulation.label = 'physical low-tier phone';
    expect(() => validatePerformanceRecord(physical)).toThrow(
      /simulation.*not a physical/i,
    );
    const weakCpu = validRecord();
    for (const run of weakCpu.runs)
      run.lowPowerSimulation.cpuThrottlingRate = 1;
    weakCpu.profiles.lowPowerSimulation.cpuThrottlingRate = 1;
    expect(() => validatePerformanceRecord(weakCpu)).toThrow(/CPU throttling/i);
    const looseReduction = validRecord();
    for (const run of looseReduction.runs)
      (run.lowPowerSimulation.reducedLod as { ratio: number }).ratio = 0.9;
    (
      looseReduction.profiles.lowPowerSimulation.reducedLod as {
        ratio: number;
      }
    ).ratio = 0.9;
    expect(() => validatePerformanceRecord(looseReduction)).toThrow(
      /reduced LOD/i,
    );
    const wrongHost = validRecord();
    (wrongHost.machine as { modelClass: string }).modelClass = 'OtherMac';
    expect(() => validatePerformanceRecord(wrongHost)).toThrow(
      /frozen reference device/i,
    );
    const clipped = validRecord();
    (
      clipped.scene as { cameraFit: { clipViolationCount: number } }
    ).cameraFit.clipViolationCount = 1;
    expect(() => validatePerformanceRecord(clipped)).toThrow(/camera fit/i);
    const coarseHeap = validRecord();
    coarseHeap.runs[0].nativeHardware.jsHeap = {
      bytes: 10_000_000,
      unavailableReason: null,
      precision: 'coarse',
    };
    expect(() => validatePerformanceRecord(coarseHeap)).toThrow(/JS heap/i);
    const one = validRecord();
    one.runs.pop();
    expect(() => validatePerformanceRecord(one)).toThrow(/two benchmark runs/i);
  });
  it('freezes the complete browser test environment and harness identity', () => {
    const wrongOs = validRecord();
    (wrongOs.machine as { os: string }).os = 'macOS other';
    expect(() => validatePerformanceRecord(wrongOs)).toThrow(
      /frozen.*environment/i,
    );
    const wrongBrowser = validRecord();
    wrongBrowser.runs[0].nativeHardware.browserVersion = '152.0.0.0';
    expect(() => validatePerformanceRecord(wrongBrowser)).toThrow(
      /browser version/i,
    );
    const wrongBinary = validRecord();
    (
      wrongBinary.machine as { browserBinarySha256: string }
    ).browserBinarySha256 = '0'.repeat(64);
    expect(() => validatePerformanceRecord(wrongBinary)).toThrow(
      /frozen.*environment/i,
    );
    const extraPowerClaims = validRecord();
    (
      extraPowerClaims.machine as {
        powerState: Record<string, unknown>;
      }
    ).powerState.batteryPercent = 'unknown';
    expect(() => validatePerformanceRecord(extraPowerClaims)).toThrow(
      /frozen.*environment/i,
    );
    const wrongViewport = validRecord();
    (wrongViewport.machine as { viewport: { width: number } }).viewport.width =
      640;
    expect(() => validatePerformanceRecord(wrongViewport)).toThrow(
      /frozen.*environment/i,
    );
    const wrongHarness = validRecord();
    (wrongHarness.harness as { sha256: string }).sha256 = '0'.repeat(64);
    expect(() => validatePerformanceRecord(wrongHarness)).toThrow(/harness/i);
  });
  it('binds launch flags and CDP throttling to the retained evidence', () => {
    const wrongFlags = validRecord();
    (
      wrongFlags.runs[0].nativeHardware.executionProtocol as {
        launchArgs: string[];
      }
    ).launchArgs = [];
    expect(() => validatePerformanceRecord(wrongFlags)).toThrow(/launch args/i);
    const wrongCdp = validRecord();
    (
      wrongCdp.runs[0].lowPowerSimulation.executionProtocol as {
        cpuThrottling: { rate: number };
      }
    ).cpuThrottling.rate = 1;
    expect(() => validatePerformanceRecord(wrongCdp)).toThrow(
      /CDP|throttling/i,
    );
  });
  it('requires fresh measurement contexts and distinct retained runs', () => {
    const duplicatedContext = validRecord();
    const contexts = (
      duplicatedContext.runs[0].nativeHardware.execution as {
        contexts: Array<{ id: string; role: string }>;
      }
    ).contexts;
    contexts[1]!.id = contexts[0]!.id;
    expect(() => validatePerformanceRecord(duplicatedContext)).toThrow(
      /fresh.*context|duplicate.*context/i,
    );
    const duplicatedProfile = validRecord();
    duplicatedProfile.runs[1].nativeHardware.execution = structuredClone(
      duplicatedProfile.runs[0].nativeHardware.execution,
    );
    expect(() => validatePerformanceRecord(duplicatedProfile)).toThrow(
      /independent.*run|browser launch/i,
    );
    const duplicatedRun = validRecord();
    duplicatedRun.runs[1].executionId = duplicatedRun.runs[0].executionId;
    expect(() => validatePerformanceRecord(duplicatedRun)).toThrow(
      /independent.*run/i,
    );
    const relabelledCopy = validRecord();
    const retainedExecution = structuredClone(
      relabelledCopy.runs[1].nativeHardware.execution,
    );
    relabelledCopy.runs[1].nativeHardware = structuredClone(
      relabelledCopy.runs[0].nativeHardware,
    );
    relabelledCopy.runs[1].nativeHardware.execution = retainedExecution;
    relabelledCopy.profiles.nativeHardware =
      relabelledCopy.runs[1].nativeHardware;
    expect(() => validatePerformanceRecord(relabelledCopy)).toThrow(
      /copied.*measurement|measurement.*independent/i,
    );
    const repeatedTrial = validRecord();
    const repeated = structuredClone(
      repeatedTrial.runs[0].nativeHardware.trials[0]!,
    );
    repeatedTrial.runs[0].nativeHardware.trials = Array.from(
      { length: 5 },
      () => structuredClone(repeated),
    );
    const aggregates = repeatedTrial.runs[0].nativeHardware.aggregates!;
    aggregates.medianFetchMs = repeated.fetchMs;
    aggregates.medianParseMs = repeated.parseMs;
    aggregates.medianUploadMs = repeated.uploadMs;
    aggregates.medianTotalMs = repeated.totalMs;
    expect(() => validatePerformanceRecord(repeatedTrial)).toThrow(
      /repeated.*trial|trial.*independent/i,
    );
  });
  it('blocks completeness if a profile is unavailable', () => {
    const record = validRecord();
    record.runs[0].nativeHardware = profile('unavailable');
    record.runs[1].nativeHardware = profile('unavailable');
    record.profiles.nativeHardware = record.runs[1].nativeHardware;
    record.variance.nativeMedianFrameMsDelta = null;
    record.variance.unavailableReason = 'Native profile unavailable.';
    record.variance.materialDifferenceObserved = null;
    record.performanceAssessment.native = {
      status: 'unavailable',
      observedMedianFps: null,
      passes: null,
      reason: 'Profile unavailable; no performance score may be assigned.',
    };
    record.browserPerformanceComplete = false;
    expect(() => validatePerformanceRecord(record)).not.toThrow();
    record.browserPerformanceComplete = true;
    expect(() => validatePerformanceRecord(record)).toThrow(/completeness/i);
  });
  it('pins the checked-in record to the actual artifact', async () => {
    const [text, glb, manifestBytes] = await Promise.all([
      readFile(
        new URL(
          '../../docs/licenses/bodyparts3d-performance.json',
          import.meta.url,
        ),
        'utf8',
      ),
      readFile(glbUrl),
      readFile(manifestUrl),
    ]);
    const record = JSON.parse(text);
    expect(record.source.sha256).toBe(
      createHash('sha256').update(glb).digest('hex'),
    );
    expect(record.source.bytes).toBe(glb.byteLength);
    expect(record.source.conversionManifestSha256).toBe(
      createHash('sha256').update(manifestBytes).digest('hex'),
    );
    const scene = summarizeScene(glb);
    expect(record.scene).toMatchObject({
      objects: scene.objects,
      meshes: scene.meshes,
      drawCalls: scene.drawCalls,
      vertices: scene.vertices,
      triangles: scene.triangles,
      geometryBufferBytes: scene.geometryBufferBytes,
    });
    expect(() => validatePerformanceRecord(record)).not.toThrow();
  });
});
