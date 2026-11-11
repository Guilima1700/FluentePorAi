import * as THREE from 'three';
import { CITIES, buildArcPoints, surfacePoint } from './geometry.mjs';

const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);
const INITIAL_DISTANCE = 4.45;
const smooth = (x) => { const v = THREE.MathUtils.clamp(x, 0, 1); return v * v * (3 - 2 * v); };

function imageAtSize(image, width) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = width / 2;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { canvas, context, data: context.getImageData(0, 0, canvas.width, canvas.height) };
}

// Geographic imagery supplies the coastlines and topography. Only its palette
// changes: deep blue continents, blue oceans and the brand's warm highlights.
function createEarthMaps(dayImage, maskImage, width) {
  const color = imageAtSize(dayImage, width);
  const mask = imageAtSize(maskImage, width);
  const roughness = imageAtSize(maskImage, width);
  for (let index = 0; index < color.data.data.length; index += 4) {
    const source = color.data.data;
    const luminance = (source[index] * .21 + source[index + 1] * .72 + source[index + 2] * .07) / 255;
    const water = Math.pow(mask.data.data[index] / 255, .5);
    const terrain = Math.pow(luminance, .8);
    const land = [23 + terrain * 61, 67 + terrain * 63, 82 + terrain * 57];
    const ocean = [49 + luminance * 26, 111 + luminance * 42, 146 + luminance * 43];
    for (let channel = 0; channel < 3; channel++) {
      source[index + channel] = land[channel] * (1 - water) + ocean[channel] * water;
      roughness.data.data[index + channel] = 220 - water * 75;
    }
  }
  color.context.putImageData(color.data, 0, 0);
  roughness.context.putImageData(roughness.data, 0, 0);
  const colorMap = new THREE.CanvasTexture(color.canvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  const roughnessMap = new THREE.CanvasTexture(roughness.canvas);
  return { colorMap, roughnessMap, mask: mask.data };
}

export async function createGlobe({ host, pins, onReady, onFailure, reducedMotion, onDragStart }) {
  let destroyed = false;
  let raf = 0;
  let visible = true;
  let paused = false;
  let reduced = reducedMotion;
  let dragging = false;
  let pointer = null;
  let interactionUntil = 0;
  let highlighted = null;
  let focus = null;
  let lastFrame = 0;
  let elapsed = 0;
  let frameCount = 0;
  let frameBudget = 0;
  let lowQuality = window.innerWidth < 640 || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  let size = 1;
  let scrollProgress = 0;
  let cameraRestDistance = INITIAL_DISTANCE;
  let pendingDraw = false;
  const resources = new Set();
  const track = (object) => { resources.add(object); return object; };
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !lowQuality, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowQuality ? 1.35 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.dataset.globeRenderer = 'three';
  renderer.domElement.tabIndex = -1;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 30);
  camera.position.set(0, 0, INITIAL_DISTANCE);
  camera.lookAt(0, 0, 0);
  const planet = new THREE.Group();
  planet.rotation.set(.38, .62, -.1);
  scene.add(planet);

  scene.add(new THREE.HemisphereLight(0xe4f1f5, 0x17394b, 1.2));
  const sun = new THREE.DirectionalLight(0xfff2d9, 2.9);
  sun.position.set(-3, 3.4, 4.5);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x7faecb, .85);
  fill.position.set(3, .5, -1);
  scene.add(fill);

  const globeMaterial = track(new THREE.MeshStandardMaterial({ color: 0x669bbb, roughness: .8, metalness: .025, transparent: true, opacity: reduced ? 1 : 0 }));
  const earth = new THREE.Mesh(track(new THREE.SphereGeometry(1, lowQuality ? 72 : 128, lowQuality ? 40 : 72)), globeMaterial);
  // Align equirectangular texture longitude with the geographic coordinate system.
  earth.rotation.y = -Math.PI / 2;
  planet.add(earth);

  const atmosphereMaterial = track(new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: { tint: { value: new THREE.Color('#8bbbd3') }, strength: { value: reduced ? .14 : 0 } },
    vertexShader: `varying vec3 vNormal; varying vec3 vView;
      void main(){ vec4 p=modelViewMatrix*vec4(position,1.); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p; }`,
    fragmentShader: `varying vec3 vNormal; varying vec3 vView; uniform vec3 tint; uniform float strength;
      void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.7); gl_FragColor=vec4(tint,rim*strength);
      #include <colorspace_fragment>
      }`,
  }));
  const atmosphere = new THREE.Mesh(track(new THREE.SphereGeometry(1.025, 64, 32)), atmosphereMaterial);
  scene.add(atmosphere);

  const sphereGeometry = track(new THREE.SphereGeometry(.014, 12, 8));
  const travelerGeometry = track(new THREE.SphereGeometry(.009, 10, 6));
  const ringGeometry = track(new THREE.RingGeometry(.024, .028, 32));
  const markers = CITIES.map((city) => {
    const group = new THREE.Group();
    const normal = surfacePoint(city.lat, city.lon);
    group.position.copy(normal).multiplyScalar(1.017);
    const material = track(new THREE.MeshBasicMaterial({ color: city.home ? 0xc1121f : 0xfff1d7, transparent: true, opacity: 0 }));
    group.add(new THREE.Mesh(sphereGeometry, material));
    const ring = new THREE.Mesh(ringGeometry, track(new THREE.MeshBasicMaterial({ color: city.home ? 0xfef0d5 : 0xa4cadd, side: THREE.DoubleSide, transparent: true, opacity: 0 })));
    ring.quaternion.setFromUnitVectors(FORWARD, normal);
    group.add(ring);
    planet.add(group);
    return { city, normal, group, material, ring, pin: pins.get(city.id) };
  });

  const routes = CITIES.slice(1).map((city, index) => {
    const curve = new THREE.CatmullRomCurve3(buildArcPoints(CITIES[0], city), false, 'centripetal');
    const geometry = track(new THREE.TubeGeometry(curve, lowQuality ? 80 : 128, .00165, 4, false));
    geometry.setDrawRange(0, 0);
    const material = track(new THREE.MeshBasicMaterial({ color: index % 2 ? 0xc1121f : 0xadd4e6, transparent: true, opacity: .72 }));
    const tube = new THREE.Mesh(geometry, material);
    tube.renderOrder = 1;
    planet.add(tube);
    const traveler = new THREE.Mesh(travelerGeometry, track(new THREE.MeshBasicMaterial({ color: index % 2 ? 0xfef0d5 : 0xc1121f })));
    traveler.visible = false;
    planet.add(traveler);
    return { city, curve, geometry, material, traveler, index, total: geometry.index.count };
  });

  let particles = null;
  let textureMask = null;
  const loader = new THREE.ImageLoader();
  // All files are same-origin, pinned assets. No CDN is contacted at runtime.
  const images = await Promise.all([
    loader.loadAsync('/textures/earth_atmos_2048.jpg'),
    loader.loadAsync('/textures/earth_specular_2048.jpg'),
    lowQuality ? Promise.resolve(null) : loader.loadAsync('/textures/earth_normal_2048.jpg'),
  ]).catch(() => null);

  if (!images) {
    resources.forEach(resource => resource.dispose());
    renderer.dispose();
    renderer.domElement.remove();
    throw new Error('Geographic textures unavailable');
  }

  if (images) {
    const maps = createEarthMaps(images[0], images[1], lowQuality ? 1024 : 2048);
    textureMask = maps.mask;
    globeMaterial.map = track(maps.colorMap);
    globeMaterial.roughnessMap = track(maps.roughnessMap);
    globeMaterial.color.set(0xffffff);
    globeMaterial.map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), lowQuality ? 2 : 4);
    if (images[2]) {
      globeMaterial.normalMap = track(new THREE.Texture(images[2]));
      globeMaterial.normalMap.needsUpdate = true;
      globeMaterial.normalScale.set(.09, .09);
    }
    globeMaterial.needsUpdate = true;
  }

  if (textureMask) {
    const positions = [];
    const count = lowQuality ? 850 : 2600;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const lat = Math.asin(1 - 2 * (i + .5) / count) * 180 / Math.PI;
      const lon = (i * golden * 180 / Math.PI) % 360 - 180;
      const x = Math.min(textureMask.width - 1, Math.floor((lon + 180) / 360 * textureMask.width));
      const y = Math.min(textureMask.height - 1, Math.floor((90 - lat) / 180 * textureMask.height));
      if (textureMask.data[(y * textureMask.width + x) * 4] > 90) continue;
      positions.push(...surfacePoint(lat, lon, 1.006).toArray());
    }
    const geometry = track(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles = new THREE.Points(geometry, track(new THREE.PointsMaterial({ color: 0xc4dce4, size: lowQuality ? .006 : .0045, sizeAttenuation: true, transparent: true, opacity: .16, depthWrite: false })));
    planet.add(particles);
  }

  const world = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const towardCamera = new THREE.Vector3();
  const rotatedNormal = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const cameraAxis = new THREE.Vector3();
  const center = new THREE.Vector3();
  let ready = false;

  function render(delta = 0) {
    if (destroyed) return;
    const intro = reduced ? 1 : smooth(elapsed / 1.5);
    globeMaterial.opacity = intro;
    atmosphereMaterial.uniforms.strength.value = intro * .14;
    const entranceScale = reduced ? 1 : .94 + intro * .06;
    planet.scale.setScalar(entranceScale);
    atmosphere.scale.copy(planet.scale);
    if (focus) {
      focus.elapsed += delta;
      const progress = reduced ? 1 : smooth(focus.elapsed / 1.25);
      // Orbit around the sphere rather than cutting through it for far destinations.
      quaternion.identity().slerp(focus.rotation, progress);
      camera.position.copy(focus.direction).applyQuaternion(quaternion).multiplyScalar(THREE.MathUtils.lerp(focus.distance, 4.2, progress));
      if (progress === 1) { focus = null; cameraRestDistance = 4.2; }
    }
    // Optional, tiny scroll dolly, disabled at low quality and reduced motion.
    // Nothing is pinned, and the existing photograph enters on normal scroll.
    if (!focus) camera.position.setLength(cameraRestDistance * (1 - scrollProgress * .03));
    camera.lookAt(center);
    camera.updateMatrixWorld();
    planet.updateMatrixWorld(true);
    markers.forEach((marker, index) => {
      const entry = reduced ? 1 : smooth((elapsed - .55 - index * .12) / .65);
      marker.material.opacity = entry;
      marker.ring.material.opacity = entry * (highlighted === marker.city.id ? .95 : .55);
      const target = highlighted === marker.city.id ? 1.35 : 1;
      marker.group.scale.lerp(new THREE.Vector3(target, target, target), .12);
      marker.group.getWorldPosition(world);
      rotatedNormal.copy(marker.normal).applyQuaternion(planet.quaternion);
      towardCamera.copy(camera.position).sub(world).normalize();
      const isFront = rotatedNormal.dot(towardCamera) > .12 && entry > .05;
      projected.copy(world).project(camera);
      if (marker.pin) {
        marker.pin.style.visibility = isFront ? 'visible' : 'hidden';
        marker.pin.style.opacity = String(entry);
        marker.pin.style.transform = `translate3d(${(projected.x * .5 + .5) * size}px,${(-projected.y * .5 + .5) * size}px,0)`;
      }
    });
    routes.forEach((route) => {
      const entry = reduced ? 1 : smooth((elapsed - 1 - route.index * .32) / 2.2);
      route.geometry.setDrawRange(0, Math.floor(entry * (route.total / 24)) * 24);
      const highlight = highlighted === route.city.id;
      route.material.opacity = highlighted ? (highlight ? .98 : .23) : .66;
      route.traveler.visible = entry > .98;
      route.traveler.position.copy(route.curve.getPointAt(reduced ? .62 : (elapsed * .055 + route.index * .24) % 1));
    });
    renderer.render(scene, camera);
    host.dataset.globeQuality = lowQuality ? 'adaptive' : 'high';
    host.dataset.globeCamera = camera.position.toArray().map(value => value.toFixed(2)).join(',');
    if (!ready) {
      ready = true;
      onReady();
    }
  }

  function tick(now) {
    raf = 0;
    if (destroyed || !visible || document.hidden) return;
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 1 / 60;
    lastFrame = now;
    if (!paused && !reduced) elapsed += delta;
    if (!paused && !reduced && !dragging && !focus && !highlighted && now > interactionUntil) planet.rotateOnWorldAxis(UP, delta * .028);
    render(delta);
    frameCount++;
    frameBudget += delta;
    if (!lowQuality && frameCount === 120 && frameBudget / frameCount > .026) {
      lowQuality = true;
      renderer.setPixelRatio(1);
      renderer.setSize(size, size, false);
      if (particles) particles.visible = false;
    }
    const entering = elapsed < 4.8 && !reduced && !paused;
    if ((!reduced && !paused) || focus || entering || dragging) raf = requestAnimationFrame(tick);
  }

  function requestDraw() {
    if (destroyed || raf || pendingDraw || !visible || document.hidden) return;
    pendingDraw = true;
    queueMicrotask(() => {
      pendingDraw = false;
      if (!destroyed && !raf) { lastFrame = 0; raf = requestAnimationFrame(tick); }
    });
  }

  function resize() {
    size = Math.max(1, Math.round(host.clientWidth));
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    requestDraw();
  }

  function focusDestination(id) {
    const city = CITIES.find(item => item.id === id);
    if (!city) return;
    const destination = surfacePoint(city.lat, city.lon).applyQuaternion(planet.quaternion).normalize();
    const direction = camera.position.clone().normalize();
    focus = { direction, distance: camera.position.length(), rotation: new THREE.Quaternion().setFromUnitVectors(direction, destination), elapsed: 0 };
    interactionUntil = performance.now() + 11000;
    highlighted = id;
    requestDraw();
  }

  function rotate(dx, dy) {
    focus = null;
    cameraAxis.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    quaternion.setFromAxisAngle(cameraAxis, dx);
    planet.quaternion.premultiply(quaternion);
    cameraAxis.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    quaternion.setFromAxisAngle(cameraAxis, dy);
    planet.quaternion.premultiply(quaternion);
    interactionUntil = performance.now() + 4500;
    requestDraw();
  }

  function pointerDown(event) {
    if (event.button !== 0 && event.pointerType !== 'touch') return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, type: event.pointerType };
    dragging = false;
    renderer.domElement.setPointerCapture?.(event.pointerId);
  }
  function pointerMove(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!dragging && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < 4) return;
    if (!dragging && pointer.type === 'touch' && Math.abs(event.clientY - pointer.startY) > Math.abs(event.clientX - pointer.startX) * 1.25) { pointer = null; return; }
    if (!dragging) onDragStart();
    dragging = true;
    host.dataset.dragging = 'true';
    rotate(dx * .006, dy * .005);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }
  function pointerUp() { pointer = null; dragging = false; delete host.dataset.dragging; requestDraw(); }
  function visibilityChange() {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else requestDraw();
  }
  function onScroll() {
    const hero = host.closest('section');
    const rect = hero?.getBoundingClientRect();
    scrollProgress = !lowQuality && !reduced && rect ? THREE.MathUtils.clamp(-rect.top / rect.height, 0, 1) : 0;
    // No new frame is needed when the scene is entirely off screen.
    if (visible) requestDraw();
  }
  function contextLost(event) { event.preventDefault(); cancelAnimationFrame(raf); raf = 0; onFailure(); }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestDraw();
    else { cancelAnimationFrame(raf); raf = 0; }
  }, { threshold: .04 });
  observer.observe(host);
  renderer.domElement.addEventListener('pointerdown', pointerDown);
  renderer.domElement.addEventListener('pointermove', pointerMove);
  renderer.domElement.addEventListener('pointerup', pointerUp);
  renderer.domElement.addEventListener('pointercancel', pointerUp);
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  document.addEventListener('visibilitychange', visibilityChange);
  window.addEventListener('scroll', onScroll, { passive: true });
  resize();
  render();
  requestDraw();

  return {
    focusDestination,
    rotate,
    setHighlight(id) { highlighted = id; requestDraw(); },
    setPaused(value) { paused = value; if (value) elapsed = Math.max(elapsed, 6); requestDraw(); },
    setReducedMotion(value) { reduced = value; if (value) elapsed = 6; requestDraw(); },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', visibilityChange);
      window.removeEventListener('scroll', onScroll);
      resources.forEach(resource => resource.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
