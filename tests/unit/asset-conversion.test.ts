import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const conversionPath = resolve(
  'docs/licenses/bodyparts3d-conversion-manifest.json',
);
const scriptPath = resolve('scripts/assets/blender/convert.py');

async function conversionManifest() {
  return JSON.parse(await readFile(conversionPath, 'utf8'));
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
      scale: 0.001,
      origin: 'world-origin-preserved',
      axisTransform: [1, 0, 0, 0, 1, 0, 0, 0, 1],
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
    const decoded = manifest.determinism.structure.decodedGeometry;
    const decodedNames = decoded.map((entry: { name: string }) => entry.name);
    expect(new Set(manifestNames).size).toBe(139);
    expect(new Set(decodedNames).size).toBe(139);
    expect(manifestNames.sort()).toEqual(decodedNames.sort());
    const decodedByName = new Map(
      decoded.map((entry: { name: string; bounds: unknown }) => [
        entry.name,
        entry.bounds,
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
      method: 'decoded-glb-directed-edge-consistency',
      zeroAreaFaces: 0,
      sameDirectionSharedEdges: 0,
    });
  });

  it('keeps the conversion command fully scripted with no manual steps', async () => {
    const script = await readFile(scriptPath, 'utf8');
    expect(script).toContain('BLENDER_VERSION = "4.5.13"');
    expect(script).toContain('bpy.app.version');
    expect(script).toContain('bpy.app.version_string');
    expect(script).toContain('--compare-glb');
    expect(script).toContain('prior GLB SHA-256 does not match');
    expect(script).toContain('decoded_glb_structure');
    expect(script).toContain('directed-edge-consistency');
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
});
