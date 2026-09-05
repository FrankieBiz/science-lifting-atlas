import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from '@playwright/test';

export const SAMPLE = Object.freeze({
  path: new URL('../../assets/samples/bodyparts3d/FJ1446.obj', import.meta.url),
  sourceArchive:
    'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_BP3D_4.0_obj_99.zip',
  archivePath: 'partof_BP3D_4.0_obj_99/FJ1446.obj',
  bytes: 105005,
  sha256: '964ab8e287e7f44f14b07d8c7694ec70eee63bc9d7b1eeb3c5dc79e80460336d',
});

/** @param {string} text */
export function parseObjStats(text) {
  const result = {
    vertices: 0,
    normals: 0,
    textureCoordinates: 0,
    faces: 0,
    triangles: 0,
  };

  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('v ')) result.vertices += 1;
    else if (line.startsWith('vn ')) result.normals += 1;
    else if (line.startsWith('vt ')) result.textureCoordinates += 1;
    else if (line.startsWith('f ')) {
      const corners = line.trim().split(/\s+/).length - 1;
      result.faces += 1;
      result.triangles += Math.max(0, corners - 2);
    }
  }

  return result;
}

/** @param {number[]} values */
export function median(values) {
  if (values.length === 0) throw new Error('Cannot calculate an empty median');
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const upper = sorted[middle];
  if (upper === undefined) throw new Error('Cannot calculate an empty median');
  if (sorted.length % 2 !== 0) return upper;
  const lower = sorted[middle - 1];
  if (lower === undefined) throw new Error('Median pair is incomplete');
  return (lower + upper) / 2;
}

/**
 * @param {Buffer} bytes
 * @param {{bytes: number, sha256: string}} expected
 */
export function validateSampleIdentity(bytes, expected) {
  if (bytes.byteLength !== expected.bytes) {
    throw new Error(
      `Sample byte-size mismatch: expected ${expected.bytes}, received ${bytes.byteLength}`,
    );
  }
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== expected.sha256) {
    throw new Error(
      `Sample SHA-256 mismatch: expected ${expected.sha256}, received ${actual}`,
    );
  }
}

/** @param {Buffer} sampleBytes */
async function startServer(sampleBytes) {
  const server = createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.url?.startsWith('/sample.obj')) {
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(sampleBytes);
      return;
    }
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><title>SBLA asset benchmark</title>');
  });

  await /** @type {Promise<void>} */ (
    new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', () => resolve());
    })
  );
  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Could not determine benchmark server port');
  }
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

/** @param {{trials?: number}} [options] */
export async function runBenchmark({ trials = 5 } = {}) {
  if (!Number.isInteger(trials) || trials < 1) {
    throw new Error('trials must be a positive integer');
  }

  const sampleBytes = await readFile(SAMPLE.path);
  validateSampleIdentity(sampleBytes, SAMPLE);
  const expectedStats = parseObjStats(sampleBytes.toString('utf8'));
  const { server, origin } = await startServer(sampleBytes);
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(origin);
    const userAgent = await page.evaluate(() => navigator.userAgent);
    /**
     * @type {Array<{
     *   fetchMs: number,
     *   parseMs: number,
     *   uploadAndDrawMs: number,
     *   totalMs: number,
     *   webgl: {vendor: string, renderer: string},
     *   stats: ReturnType<typeof parseObjStats>
     * }>}
     */
    const measurements = [];

    for (let index = 0; index < trials + 1; index += 1) {
      const measurement = await page.evaluate(async (sampleUrl) => {
        const fetchStart = performance.now();
        const response = await fetch(sampleUrl, { cache: 'no-store' });
        if (!response.ok)
          throw new Error(`sample fetch failed: ${response.status}`);
        const text = await response.text();
        const fetchEnd = performance.now();

        const parseStart = performance.now();
        const positions = [];
        const indices = [];
        let normals = 0;
        let textureCoordinates = 0;
        let faces = 0;
        let triangles = 0;
        for (const line of text.split(/\r?\n/)) {
          if (line.startsWith('v ')) {
            const [, x, y, z] = line.trim().split(/\s+/);
            positions.push(Number(x), Number(y), Number(z));
          } else if (line.startsWith('vn ')) normals += 1;
          else if (line.startsWith('vt ')) textureCoordinates += 1;
          else if (line.startsWith('f ')) {
            const corners = line
              .trim()
              .split(/\s+/)
              .slice(1)
              .map((corner) => Number(corner.split('/')[0]) - 1);
            faces += 1;
            for (let corner = 1; corner < corners.length - 1; corner += 1) {
              const first = corners[0];
              const current = corners[corner];
              const next = corners[corner + 1];
              if (
                first === undefined ||
                current === undefined ||
                next === undefined
              )
                throw new Error('Malformed OBJ face');
              indices.push(first, current, next);
              triangles += 1;
            }
          }
        }
        const parseEnd = performance.now();

        const gpuStart = performance.now();
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 320;
        const gl = canvas.getContext('webgl');
        if (!gl) throw new Error('WebGL is unavailable');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const webgl = {
          vendor: String(
            debugInfo
              ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
              : gl.getParameter(gl.VENDOR),
          ),
          renderer: String(
            debugInfo
              ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
              : gl.getParameter(gl.RENDERER),
          ),
        };

        /** @param {number} type @param {string} source */
        const compile = (type, source) => {
          const shader = gl.createShader(type);
          if (!shader) throw new Error('Could not create shader');
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(
              gl.getShaderInfoLog(shader) ?? 'Shader compile failed',
            );
          }
          return shader;
        };
        const program = gl.createProgram();
        if (!program) throw new Error('Could not create WebGL program');
        gl.attachShader(
          program,
          compile(
            gl.VERTEX_SHADER,
            'attribute vec3 p; void main(){gl_Position=vec4(p*0.001,1.0);}',
          ),
        );
        gl.attachShader(
          program,
          compile(
            gl.FRAGMENT_SHADER,
            'precision mediump float; void main(){gl_FragColor=vec4(0.2,0.8,0.7,1.0);}',
          ),
        );
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(
            gl.getProgramInfoLog(program) ?? 'Program link failed',
          );
        }
        gl.useProgram(program);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(positions),
          gl.STATIC_DRAW,
        );
        const location = gl.getAttribLocation(program, 'p');
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW,
        );
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        gl.finish();
        const gpuEnd = performance.now();

        return {
          fetchMs: fetchEnd - fetchStart,
          parseMs: parseEnd - parseStart,
          uploadAndDrawMs: gpuEnd - gpuStart,
          totalMs: gpuEnd - fetchStart,
          webgl,
          stats: {
            vertices: positions.length / 3,
            normals,
            textureCoordinates,
            faces,
            triangles,
          },
        };
      }, `${origin}/sample.obj?trial=${index}`);

      if (JSON.stringify(measurement.stats) !== JSON.stringify(expectedStats)) {
        throw new Error(
          'Browser parser produced geometry counts that differ from Node',
        );
      }
      if (index > 0) measurements.push(measurement);
    }

    const webgl = measurements[0]?.webgl;
    if (!webgl?.vendor || !webgl.renderer) {
      throw new Error('WebGL vendor and renderer were not reported');
    }
    if (
      measurements.some(
        (measurement) =>
          measurement.webgl.vendor !== webgl.vendor ||
          measurement.webgl.renderer !== webgl.renderer,
      )
    ) {
      throw new Error('WebGL vendor or renderer changed between trials');
    }

    /** @param {'fetchMs'|'parseMs'|'uploadAndDrawMs'|'totalMs'} key */
    const metric = (key) =>
      Math.round(median(measurements.map((item) => item[key])) * 1000) / 1000;

    return {
      schemaVersion: 1,
      sample: {
        sourceArchive: SAMPLE.sourceArchive,
        archivePath: SAMPLE.archivePath,
        bytes: SAMPLE.bytes,
        sha256: SAMPLE.sha256,
        ...expectedStats,
      },
      environment: {
        node: process.version,
        playwrightChromium: userAgent,
        platform: `${process.platform}-${process.arch}`,
        headless: true,
        webgl,
      },
      protocol: {
        warmupTrials: 1,
        measuredTrials: trials,
        cache: 'no-store',
        canvas: '320x320 WebGL',
      },
      mediansMs: {
        fetch: metric('fetchMs'),
        parse: metric('parseMs'),
        uploadAndDraw: metric('uploadAndDrawMs'),
        total: metric('totalMs'),
      },
      trials: measurements.map((measurement) => ({
        fetchMs: Math.round(measurement.fetchMs * 1000) / 1000,
        parseMs: Math.round(measurement.parseMs * 1000) / 1000,
        uploadAndDrawMs: Math.round(measurement.uploadAndDrawMs * 1000) / 1000,
        totalMs: Math.round(measurement.totalMs * 1000) / 1000,
      })),
    };
  } finally {
    await browser.close();
    await /** @type {Promise<void>} */ (
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      )
    );
  }
}

const isMain =
  process.argv[1] &&
  pathToFileURL(fileURLToPath(new URL(process.argv[1], 'file:'))).href ===
    import.meta.url;

if (isMain) {
  const result = await runBenchmark();
  console.log(JSON.stringify(result, null, 2));
}
