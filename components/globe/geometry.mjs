import { Vector3 } from 'three';

export { CITIES } from './destinations.mjs';

export function surfacePoint(lat, lon, radius = 1) {
  const phi = lat * Math.PI / 180;
  const theta = lon * Math.PI / 180;
  return new Vector3(Math.cos(phi) * Math.sin(theta), Math.sin(phi), Math.cos(phi) * Math.cos(theta)).multiplyScalar(radius);
}

export function buildArcPoints(from, to, segments = 128) {
  const a = surfacePoint(from.lat, from.lon);
  const b = surfacePoint(to.lat, to.lon);
  const angle = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
  const denominator = Math.sin(angle);
  return Array.from({ length: segments + 1 }, (_, index) => {
    const t = index / segments;
    const point = denominator > 1e-7
      ? a.clone().multiplyScalar(Math.sin((1 - t) * angle) / denominator).addScaledVector(b, Math.sin(t * angle) / denominator)
      : a.clone().lerp(b, t).normalize();
    const elevation = 0.012 + Math.sin(Math.PI * t) * Math.min(0.25, angle * 0.1);
    return point.normalize().multiplyScalar(1 + elevation);
  });
}
