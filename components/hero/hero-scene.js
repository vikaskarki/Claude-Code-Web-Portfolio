/**
 * Hero 3D scene (Three.js)
 * A glossy burgundy gem inside three spinning gyroscope rings with small
 * orbiting beads and a cloud of dust. It follows the mouse and turns as you
 * scroll. Rendering pauses while the hero is off screen.
 *
 * Three.js is loaded from a CDN via the import map in index.html.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { prefersReducedMotion } from '../../scripts/utils/motion.js';

const COLORS = {
  gunmetal: 0x4A4A50,
  burgundyMetal: 0x8A2234,
  gem: 0x6E1E2B,
  gemEdges: 0xE8C9CE,
  dust: 0x6E1E2B,
  keyLight: 0xFFF1E6,
  ambient: 0xF2EFEA,
};

export function initHeroScene(canvas) {
  // ---- Renderer, scene, camera -------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // ---- Materials ---------------------------------------------------------
  const gunmetal = new THREE.MeshStandardMaterial({ color: COLORS.gunmetal, metalness: 1, roughness: 0.3 });
  const burgundyMetal = new THREE.MeshStandardMaterial({ color: COLORS.burgundyMetal, metalness: 0.9, roughness: 0.32 });
  const gemMaterial = new THREE.MeshPhysicalMaterial({
    color: COLORS.gem, metalness: 0.3, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08,
  });

  const rig = new THREE.Group(); // everything that rotates with the mouse
  scene.add(rig);

  // ---- Gyroscope rings: [radius, thickness, material, starting rotation] --
  const rings = [
    [2.7, 0.032, gunmetal, [1.2, 0.2, 0]],
    [2.25, 0.05, burgundyMetal, [0.3, 1.1, 0.4]],
    [1.8, 0.028, gunmetal, [-0.6, 0.5, 1.2]],
  ].map(([radius, tube, material, rotation]) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 32, 240), material);
    ring.rotation.set(...rotation);
    rig.add(ring);
    return ring;
  });

  // ---- Faceted gem in the centre, with light edges ------------------------
  const gemGeometry = new THREE.IcosahedronGeometry(0.95, 1);
  const gem = new THREE.Mesh(gemGeometry, gemMaterial);
  gem.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(gemGeometry),
    new THREE.LineBasicMaterial({ color: COLORS.gemEdges, transparent: true, opacity: 0.35 })
  ));
  rig.add(gem);

  // ---- One small bead travelling along each ring --------------------------
  const beads = rings.map((ring, i) => {
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(i === 1 ? 0.11 : 0.08, 24, 24),
      i === 1 ? gemMaterial : gunmetal
    );
    ring.add(bead);
    return bead;
  });

  // ---- Dust particles in a shell around the object -----------------------
  const DUST_COUNT = 260;
  const positions = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    const r = 3.2 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.set([
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ], i * 3);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: COLORS.dust, size: 0.035, transparent: true, opacity: 0.55 })
  );
  scene.add(dust);

  // ---- Lights ------------------------------------------------------------
  const keyLight = new THREE.DirectionalLight(COLORS.keyLight, 2.2);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight, new THREE.AmbientLight(COLORS.ambient, 0.3));

  // ---- Keep the canvas sharp when it resizes -----------------------------
  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  // ---- Mouse follow ------------------------------------------------------
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    target.x = (event.clientX / window.innerWidth - 0.5) * 0.8;
    target.y = (event.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // ---- Pause rendering while off screen ----------------------------------
  let isVisible = true;
  new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }).observe(canvas);

  // ---- Animation loop ----------------------------------------------------
  const clock = new THREE.Clock();
  function render() {
    requestAnimationFrame(render);
    if (!isVisible) return;

    const t = prefersReducedMotion ? 0 : clock.getElapsedTime();
    current.x += (target.x - current.x) * 0.05; // smooth follow
    current.y += (target.y - current.y) * 0.05;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);

    rig.rotation.y = current.x + scroll * 0.8;
    rig.rotation.x = current.y + scroll * 0.3;
    rig.position.y = Math.sin(t * 0.8) * 0.08; // gentle float

    rings[0].rotation.z = t * 0.25;
    rings[1].rotation.x = 1.1 + t * 0.18;
    rings[2].rotation.y = 0.5 + t * 0.3;

    beads.forEach((bead, i) => {
      const radius = rings[i].geometry.parameters.radius;
      const angle = t * (0.6 + i * 0.25) + i * 2;
      bead.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });

    gem.rotation.y = t * 0.3;
    gem.rotation.x = t * 0.15;
    dust.rotation.y = t * 0.03;

    renderer.render(scene, camera);
  }
  render();
}
