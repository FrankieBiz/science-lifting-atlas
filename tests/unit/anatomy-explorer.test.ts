import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import manifest from '../../docs/licenses/anatomy-explorer-manifest.json';
import mapping from '../../docs/licenses/bodyparts3d-mesh-mapping.json';

test('explorer retains approved mapping, source provenance, and bounded geometry', async () => {
  const bytes = await readFile(manifest.model.path);
  expect(bytes.length).toBeLessThan(3_000_000);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(
    manifest.model.sha256,
  );
  expect(manifest.source.adaptation.commit).toBe(
    '5bb5713aab18d7fe9380c3339eb09f173491ea06',
  );
  expect(manifest.source.historicNotice).toContain('CC BY-SA');
  expect(manifest.entities).toHaveLength(23);
  expect(manifest.parts).toHaveLength(140);
  for (const entity of manifest.entities) {
    const target = mapping.coverage.targets.find(
      (item) => item.id === entity.id,
    )!;
    expect(entity.partIds).toEqual(
      [
        ...new Set(
          target.components.flatMap((component) =>
            component.meshes.map((mesh) => mesh.fileId),
          ),
        ),
      ].sort(),
    );
  }
  const gltf = JSON.parse(
    bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString(),
  );
  expect(gltf.meshes).toHaveLength(140);
  expect(
    gltf.nodes
      .map((node: { extras: { sourceId: string } }) => node.extras.sourceId)
      .sort(),
  ).toEqual(manifest.parts.map((part) => part.id).sort());
  expect(
    Math.max(...manifest.parts.map((part) => part.relativeError)),
  ).toBeLessThanOrEqual(0.002);
});
