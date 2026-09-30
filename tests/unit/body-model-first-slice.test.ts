import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { expect, test } from 'vitest';

const modelPath = resolve('assets/derived/bodyparts3d/sbla013-pectoralis.glb');
const manifestPath = resolve(
  'docs/licenses/bodyparts3d-first-slice-manifest.json',
);
const expectedParts = [
  'FJ2810',
  'FJ1446',
  'FJ1446M',
  'FJ1447',
  'FJ1447M',
  'FJ1464',
  'FJ1464M',
];
const expectedSourceFiles = {
  'atlas.json':
    'd6979fc62cf18fa4f08a9e6efae8fdac9ec383c5a1f3c757920125ac758429fe',
  'body-1.bin':
    'aa077a4675f0d0dd3c9b0af39dc8cf6bcb348c3bf7d283478d4206ce30a5a0de',
  'body-3.bin':
    '6febb76b50423331f66802a63bb43f04f99ce08129837015910eed43d0719268',
  'body-10.bin':
    '4a959d998acd35cf88518a0f2f8ab99b42d9f69c7ce0d6a814df315eeac807ac',
};

test('the optional whole-body model is bounded, traceable, and complete for pectoralis major', async () => {
  const [model, manifestBytes] = await Promise.all([
    readFile(modelPath),
    readFile(manifestPath),
  ]);
  const manifest = JSON.parse(manifestBytes.toString('utf8'));

  expect(model.subarray(0, 4).toString('utf8')).toBe('glTF');
  expect(model.readUInt32LE(8)).toBe(model.byteLength);
  expect(model.byteLength).toBeLessThan(3_000_000);
  expect(manifest.model.sha256).toBe(
    createHash('sha256').update(model).digest('hex'),
  );
  expect(manifest.model.bytes).toBe(model.byteLength);
  expect(manifest.source.dataset).toBe('BodyParts3D 4.0');
  expect(manifest.source.adaptation.commit).toBe(
    '5bb5713aab18d7fe9380c3339eb09f173491ea06',
  );
  expect(manifest.source.adaptation.files).toEqual(expectedSourceFiles);
  expect(manifest.source.attribution).toContain(
    'Database Center for Life Science',
  );
  expect(manifest.source.historicNotice).toContain('CC BY-SA 2.1 Japan');
  expect(manifest.selectedPartIds).toEqual(expectedParts);

  const jsonLength = model.readUInt32LE(12);
  expect(model.subarray(16, 20).toString('utf8')).toBe('JSON');
  const gltf = JSON.parse(model.subarray(20, 20 + jsonLength).toString('utf8'));
  expect(
    gltf.nodes
      .map((node: { extras: { sourceId: string } }) => node.extras.sourceId)
      .sort(),
  ).toEqual([...expectedParts].sort());
  expect(gltf.materials).toHaveLength(2);
  expect(gltf.meshes).toHaveLength(7);
});
