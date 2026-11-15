import { test } from 'node:test';
import assert from 'node:assert';
import { POSES, interpolatePose, SceneObjectId, SectionPoseKey } from '../scene/poses';

const objects: SceneObjectId[] = [
  'lensa',
  'kartu1',
  'kartu2',
  'kartu3',
  'kubus',
  'rodaGigi',
  'tombolGeser',
  'gelembungChat',
  'dekorOkta',
];

const sections: SectionPoseKey[] = ['hero', 'discovery', 'produk', 'penutup'];

test('poses: all objects have complete and valid coordinates without NaN', () => {
  ['desktop', 'portrait'].forEach((layout) => {
    const layoutPoses = layout === 'desktop' ? POSES.desktop : POSES.portrait;

    sections.forEach((section) => {
      const secPoses = layoutPoses[section];
      assert.ok(secPoses, `Section ${section} in ${layout} must exist`);

      objects.forEach((objId) => {
        const pose = secPoses[objId];
        assert.ok(pose, `Object ${objId} in ${section} (${layout}) must have a pose`);

        assert.ok(!Number.isNaN(pose.x), `${objId}.x in ${section} is NaN`);
        assert.ok(!Number.isNaN(pose.y), `${objId}.y in ${section} is NaN`);
        assert.ok(!Number.isNaN(pose.z), `${objId}.z in ${section} is NaN`);
        assert.ok(!Number.isNaN(pose.scale), `${objId}.scale in ${section} is NaN`);
        assert.ok(!Number.isNaN(pose.opacity), `${objId}.opacity in ${section} is NaN`);
      });
    });
  });
});

test('poses: interpolatePose transitions smoothly without NaN or unbounded values', () => {
  const poseA = POSES.desktop.hero.lensa;
  const poseB = POSES.desktop.discovery.lensa;

  const mid = interpolatePose(poseA, poseB, 0.5);
  assert.strictEqual(mid.x, poseA.x + (poseB.x - poseA.x) * 0.5);
  assert.ok(!Number.isNaN(mid.x));
  assert.ok(!Number.isNaN(mid.scale));
  assert.ok(mid.opacity >= 0 && mid.opacity <= 1);
});

