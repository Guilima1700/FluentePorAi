import test from 'node:test';
import assert from 'node:assert/strict';
import { Quaternion, Vector3, CatmullRomCurve3 } from 'three';
import { CITIES, surfacePoint, buildArcPoints } from '../components/globe/geometry.mjs';

test('international routes have exact geographic endpoints and never cross the globe', () => {
  for (const city of CITIES.slice(1)) {
    const points = buildArcPoints(CITIES[0], city);
    assert.ok(points[0].clone().normalize().distanceTo(surfacePoint(CITIES[0].lat, CITIES[0].lon)) < 1e-9);
    assert.ok(points.at(-1).clone().normalize().distanceTo(surfacePoint(city.lat, city.lon)) < 1e-9);
    const curve = new CatmullRomCurve3(points, false, 'centripetal');
    for (let index = 0; index <= 500; index++) {
      const point = curve.getPointAt(index / 500);
      assert.ok(point.toArray().every(Number.isFinite), city.name);
      assert.ok(point.length() > 1.005, `${city.name} passes through the sphere`);
    }
  }
});

test('camera orbit to a far destination stays outside the surface', () => {
  const from = new Vector3(0, 0, 1);
  const to = surfacePoint(CITIES.at(-1).lat, CITIES.at(-1).lon);
  const orbit = new Quaternion().setFromUnitVectors(from, to);
  for (let step = 0; step <= 100; step++) {
    const turn = new Quaternion().slerp(orbit, step / 100);
    const camera = from.clone().applyQuaternion(turn).multiplyScalar(4.2);
    assert.ok(Math.abs(camera.length() - 4.2) < 1e-9);
  }
});

test('surface points cover both hemispheres without a mirrored longitude', () => {
  assert.ok(surfacePoint(0, 0).distanceTo(new Vector3(0, 0, 1)) < 1e-9);
  assert.ok(surfacePoint(0, 90).distanceTo(new Vector3(1, 0, 0)) < 1e-9);
  assert.ok(surfacePoint(90, 0).distanceTo(new Vector3(0, 1, 0)) < 1e-9);
});
