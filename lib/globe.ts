import * as THREE from 'three';

/** Sydney and New York, the two ends of the arc. */
const SYDNEY: [number, number] = [-33.87, 151.21];
const NEW_YORK: [number, number] = [40.71, -74.01];

const R = 1.6;
const DOTS = 2000;
const FALLBACK_ACCENT = '#C0341C';

type Options = {
  reducedMotion?: boolean;
  getScrollY?: () => number;
};

/**
 * Reads --accent off the document and rasterises one pixel to get RGB, so the
 * arc and markers stay in sync with the CSS token rather than duplicating it.
 */
function readAccent(): THREE.Color {
  if (typeof document === 'undefined') return new THREE.Color(FALLBACK_ACCENT);
  const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  if (!value) return new THREE.Color(FALLBACK_ACCENT);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return new THREE.Color(FALLBACK_ACCENT);
    ctx.fillStyle = '#000';
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    if (r + g + b > 6) return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  } catch {
    /* fall through */
  }
  return new THREE.Color(FALLBACK_ACCENT);
}

function toVector(lat: number, lon: number, radius = R): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * Builds the globe into `mount` and returns a teardown function.
 * Re-initialises itself if the WebGL context is lost and restored.
 */
export function createGlobe(mount: HTMLElement, options: Options = {}): () => void {
  let disposed = false;
  let teardown: (() => void) | null = null;

  const start = () => {
    if (disposed) return;
    teardown = build(mount, options, () => {
      if (disposed) return;
      teardown?.();
      teardown = null;
      start();
    });
  };

  start();

  return () => {
    disposed = true;
    teardown?.();
    teardown = null;
  };
}

function build(mount: HTMLElement, options: Options, onContextRestored: () => void): () => void {
  const reducedMotion = options.reducedMotion ?? false;
  const getScrollY = options.getScrollY ?? (() => window.scrollY);

  // repeat mounts leak GPU contexts and the browser caps them, after which the
  // globe silently blanks
  mount.querySelectorAll('canvas').forEach((c) => c.remove());

  let width = mount.clientWidth || 420;
  let height = mount.clientHeight || 420;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height);
  renderer.domElement.style.cssText =
    'display:block;width:100%;height:100%;cursor:grab;touch-action:pan-y';
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  const group = new THREE.Group();
  scene.add(group);

  const disposables: { dispose: () => void }[] = [];

  // Dot shell — points on a Fibonacci sphere
  const positions = new Float32Array(DOTS * 3);
  for (let i = 0; i < DOTS; i++) {
    const y = 1 - (i / (DOTS - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * Math.PI * (3 - Math.sqrt(5));
    positions[i * 3] = Math.cos(phi) * ring * R;
    positions[i * 3 + 1] = y * R;
    positions[i * 3 + 2] = Math.sin(phi) * ring * R;
  }
  const dotGeometry = new THREE.BufferGeometry();
  dotGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dotMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: new THREE.Color('#5c4f43'),
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  group.add(new THREE.Points(dotGeometry, dotMaterial));
  disposables.push(dotGeometry, dotMaterial);

  // Inner shell
  const shellGeometry = new THREE.SphereGeometry(R * 0.985, 48, 48);
  const shellMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#efe3d4'),
    transparent: true,
    opacity: 0.35,
  });
  group.add(new THREE.Mesh(shellGeometry, shellMaterial));
  disposables.push(shellGeometry, shellMaterial);

  const accent = readAccent();
  const sydney = toVector(...SYDNEY);
  const newYork = toVector(...NEW_YORK);

  const markers: { ring: THREE.Mesh; material: THREE.MeshBasicMaterial }[] = [];
  const addMarker = (position: THREE.Vector3) => {
    const dotGeo = new THREE.SphereGeometry(0.05, 18, 18);
    const dotMat = new THREE.MeshBasicMaterial({ color: accent.clone() });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(position);
    group.add(dot);

    const ringGeo = new THREE.RingGeometry(0.075, 0.09, 28);
    const ringMat = new THREE.MeshBasicMaterial({
      color: accent.clone(),
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(position);
    ring.lookAt(position.clone().multiplyScalar(2));
    group.add(ring);

    disposables.push(dotGeo, dotMat, ringGeo, ringMat);
    markers.push({ ring, material: ringMat });
  };
  addMarker(sydney);
  addMarker(newYork);

  // Great-circle arc. A Line is 1px and disappears at high DPI, so it is a tube.
  const mid = sydney.clone().add(newYork).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.55);
  const curve = new THREE.QuadraticBezierCurve3(sydney, mid, newYork);
  const arcGeometry = new THREE.TubeGeometry(curve, 64, 0.014, 8, false);
  const arcMaterial = new THREE.MeshBasicMaterial({
    color: accent.clone(),
    transparent: true,
    opacity: 0.92,
  });
  disposables.push(arcGeometry, arcMaterial);

  const arcMesh = new THREE.Mesh(arcGeometry, arcMaterial);

  const travellerGeometry = new THREE.SphereGeometry(0.035, 14, 14);
  const travellerMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2a93b') });
  group.add(arcMesh);
  const traveller = new THREE.Mesh(travellerGeometry, travellerMaterial);
  traveller.position.copy(curve.getPoint(0));
  group.add(traveller);
  disposables.push(travellerGeometry, travellerMaterial);

  // Rotation is eased toward a target, never set — raw scroll deltas feel janky
  let rotY = -1.15;
  let rotX = 0.32;
  let targetY = rotY;
  let targetX = rotX;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastScroll = getScrollY();
  group.rotation.set(rotX, rotY, 0);

  const dom = renderer.domElement;
  const onPointerDown = (e: PointerEvent) => {
    dragging = true;
    dom.style.cursor = 'grabbing';
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    targetY += (e.clientX - lastX) * 0.006;
    targetX += (e.clientY - lastY) * 0.006;
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onPointerUp = () => {
    dragging = false;
    dom.style.cursor = 'grab';
  };
  dom.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  const onResize = () => {
    width = mount.clientWidth || width;
    height = mount.clientHeight || height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', onResize);

  // stop rendering when the globe is off-screen
  let visible = true;
  let observer: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (visible = entry.isIntersecting)),
      { rootMargin: '140px' },
    );
    observer.observe(mount);
  }

  let raf = 0;
  let contextLost = false;
  const startedAt = performance.now();

  const animate = () => {
    raf = requestAnimationFrame(animate);

    const scrollY = getScrollY();
    let delta = scrollY - lastScroll;
    lastScroll = scrollY;
    if (delta > 80) delta = 80;
    else if (delta < -80) delta = -80;

    if (!dragging && !reducedMotion) targetY += 0.0018 + delta * 0.0011;
    targetX = Math.max(-0.6, Math.min(0.6, targetX));

    const prevX = rotX;
    const prevY = rotY;
    rotY += (targetY - rotY) * 0.085;
    rotX += (targetX - rotX) * 0.085;

    if (!visible || contextLost) return;
    if (reducedMotion && Math.abs(rotX - prevX) < 1e-5 && Math.abs(rotY - prevY) < 1e-5) return;

    group.rotation.y = rotY;
    group.rotation.x = rotX;

    if (!reducedMotion) {
      const t = (performance.now() - startedAt) / 1000;
      markers.forEach((marker, i) => {
        marker.ring.scale.setScalar(1 + Math.sin(t * 3 + i) * 0.28);
        marker.material.opacity = 0.5 + 0.32 * Math.sin(t * 3 + i);
      });
      traveller.position.copy(curve.getPoint((t * 0.16) % 1));
    }

    renderer.render(scene, camera);
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(raf);
  };
  const onContextRestore = () => onContextRestored();
  dom.addEventListener('webglcontextlost', onContextLost);
  dom.addEventListener('webglcontextrestored', onContextRestore);

  animate();
  renderer.render(scene, camera);

  return () => {
    cancelAnimationFrame(raf);
    observer?.disconnect();
    dom.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('resize', onResize);
    dom.removeEventListener('webglcontextlost', onContextLost);
    dom.removeEventListener('webglcontextrestored', onContextRestore);
    disposables.forEach((d) => d.dispose());
    try {
      renderer.forceContextLoss();
    } catch {
      /* not fatal */
    }
    renderer.dispose();
    dom.remove();
  };
}
