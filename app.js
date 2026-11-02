import * as THREE from "three";

const host = document.getElementById("scene");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x193b31, 0.027);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 150);
camera.position.set(0, 5.8, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc6dfc5, 0x263b2d, 2.0));
const moonLight = new THREE.DirectionalLight(0xffdfaa, 2.4);
moonLight.position.set(-7, 12, 8);
scene.add(moonLight);
const glowLight = new THREE.PointLight(0xe4bd70, 36, 30, 2);
glowLight.position.set(1, 6, -2);
scene.add(glowLight);

const ground = new THREE.Mesh(new THREE.CircleGeometry(38, 80), new THREE.MeshStandardMaterial({ color: 0x284b39, roughness: 0.96 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.3;
scene.add(ground);

const water = new THREE.Mesh(new THREE.CircleGeometry(5.3, 80), new THREE.MeshPhysicalMaterial({ color: 0x4c8273, roughness: 0.22, metalness: 0.12, transparent: true, opacity: 0.78, clearcoat: 0.8 }));
water.rotation.x = -Math.PI / 2;
water.position.set(3.5, -0.18, 1.5);
scene.add(water);

const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x594936, roughness: 0.9 });
const leafMaterials = [0x6f9565, 0x91a96d, 0x4f795b, 0xb0ad75].map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.82 }));
const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.58, 5.2, 12), trunkMaterial);
trunk.position.set(1.6, 2.25, -2.2);
trunk.rotation.z = -0.08;
scene.add(trunk);

function branch(x, y, z, length, angle) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.15, length, 8), trunkMaterial);
  mesh.position.set(x, y, z);
  mesh.rotation.z = angle;
  scene.add(mesh);
}
branch(0.65, 4.0, -2.2, 2.3, -0.72);
branch(2.5, 4.0, -2.1, 2.4, 0.72);
branch(1.0, 5.0, -2.4, 1.8, -0.55);
branch(2.1, 5.1, -2.3, 1.9, 0.6);

const canopy = new THREE.Group();
scene.add(canopy);
const leafGeometry = new THREE.IcosahedronGeometry(1, 2);
for (let i = 0; i < 42; i++) {
  const angle = i * 2.399;
  const radius = Math.sqrt(i / 42) * 3.6;
  const y = 5.4 + Math.sin(i * 1.7) * 1.15 + (1 - radius / 3.6) * 1.1;
  const leaf = new THREE.Mesh(leafGeometry, leafMaterials[i % leafMaterials.length]);
  leaf.position.set(1.6 + Math.cos(angle) * radius, y, -2.2 + Math.sin(angle) * radius * 0.62);
  const scale = 0.65 + (i % 5) * 0.13;
  leaf.scale.set(scale * 1.15, scale, scale);
  leaf.rotation.set(i * 0.3, angle, i * 0.16);
  canopy.add(leaf);
}

const blossomMaterial = new THREE.MeshStandardMaterial({ color: 0xe7c98e, emissive: 0x72512b, emissiveIntensity: 0.7, roughness: 0.5 });
for (let i = 0; i < 24; i++) {
  const angle = i * 2.4;
  const r = 1.3 + (i % 4) * 0.65;
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.055 + (i % 3) * 0.018, 10, 8), blossomMaterial);
  orb.position.set(1.6 + Math.cos(angle) * r, 4.7 + (i % 5) * 0.48, -2.2 + Math.sin(angle) * r * 0.55);
  canopy.add(orb);
}

const lanterns = [];
const lanternMaterial = new THREE.MeshStandardMaterial({ color: 0xe8bd6e, emissive: 0xe0a94f, emissiveIntensity: 2.2, roughness: 0.35 });
for (let i = 0; i < 9; i++) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), lanternMaterial);
  body.scale.set(0.78, 1.15, 0.78);
  group.add(body);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.07, 12), new THREE.MeshStandardMaterial({ color: 0x8a6840, metalness: 0.4 }));
  cap.position.y = 0.23;
  group.add(cap);
  group.position.set(-3.8 + i * 0.95, 2.5 + Math.sin(i * 1.9) * 1.5, -1.5 - (i % 3) * 1.4);
  scene.add(group);
  lanterns.push(group);
}

const petalGeometry = new THREE.SphereGeometry(0.07, 8, 6);
const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xd9b6a0, roughness: 0.65 });
const petals = [];
for (let i = 0; i < 75; i++) {
  const petal = new THREE.Mesh(petalGeometry, petalMaterial);
  petal.scale.set(1.4, 0.42, 0.8);
  petal.position.set((Math.random() - 0.5) * 23, Math.random() * 9, (Math.random() - 0.5) * 18 - 1);
  scene.add(petal);
  petals.push({ mesh: petal, speed: 0.15 + Math.random() * 0.28, phase: Math.random() * Math.PI * 2 });
}

const stars = new THREE.Group();
scene.add(stars);
for (let i = 0; i < 130; i++) {
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018 + Math.random() * 0.025, 6, 6), new THREE.MeshBasicMaterial({ color: 0xf4dfad, transparent: true, opacity: 0.3 + Math.random() * 0.55 }));
  dot.position.set((Math.random() - 0.5) * 36, 3 + Math.random() * 12, -9 - Math.random() * 12);
  stars.add(dot);
}

const hills = new THREE.Group();
scene.add(hills);
for (let i = 0; i < 7; i++) {
  const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x345b47 : 0x42674d, roughness: 1 }));
  hill.scale.set(5 + (i % 3), 2.5 + (i % 2), 2.2);
  hill.position.set(-14 + i * 4.7, -1.5, -9 - (i % 3) * 2);
  hills.add(hill);
}

const clock = new THREE.Clock();
let targetX = 0;
let targetY = 0;
let cameraDrift = 0;
let entering = false;

function resize() {
  const width = host.clientWidth;
  const height = host.clientHeight;
  camera.aspect = width / height;
  camera.position.z = width < 700 ? 23 : 18;
  camera.position.y = width < 700 ? 6.7 : 5.8;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener("resize", resize, { passive: true });
resize();

window.addEventListener("pointermove", event => {
  if (event.pointerType === "touch" || reducedMotion) return;
  targetX = (event.clientX / window.innerWidth - 0.5) * 0.65;
  targetY = (event.clientY / window.innerHeight - 0.5) * 0.24;
}, { passive: true });

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const drift = reducedMotion ? 0 : 1;
  camera.position.x += (targetX + Math.sin(t * 0.12) * 0.12 * drift - camera.position.x) * 0.018;
  camera.position.y += (5.8 + targetY + Math.sin(t * 0.2) * 0.08 * drift - camera.position.y) * 0.018;
  camera.lookAt(0.3, 3.0, -1.2);
  canopy.rotation.y = Math.sin(t * 0.12) * 0.035 * drift;
  water.material.roughness = 0.2 + Math.sin(t * 0.8) * 0.025;
  lanterns.forEach((lantern, i) => {
    lantern.position.y += Math.sin(t * 0.65 + i) * 0.0018 * drift;
    lantern.rotation.z = Math.sin(t * 0.35 + i) * 0.08 * drift;
  });
  petals.forEach(({ mesh, speed, phase }) => {
    if (drift) {
      mesh.position.y -= speed * 0.012;
      mesh.position.x += Math.sin(t * 0.45 + phase) * 0.003;
      mesh.rotation.z += 0.002;
      if (mesh.position.y < -0.3) mesh.position.y = 8 + Math.random() * 3;
    }
  });
  renderer.render(scene, camera);
}
animate();

const panel = document.getElementById("wishPanel");
const openPanel = () => { panel.classList.add("open"); panel.setAttribute("aria-hidden", "false"); };
const closePanel = () => { panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); };
document.getElementById("wishButton").addEventListener("click", openPanel);
document.getElementById("closePanel").addEventListener("click", closePanel);
document.getElementById("enterButton").addEventListener("click", () => {
  entering = !entering;
  targetX = entering ? 0.85 : 0;
  const toast = document.getElementById("toast");
  toast.textContent = entering ? "Hãy thả lỏng và khám phá khu vườn nhé." : "Bạn đang ở giữa khu vườn an lành.";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
});
document.getElementById("wishForm").addEventListener("submit", event => {
  event.preventDefault();
  const message = document.getElementById("wishText").value.trim();
  if (!message) return;
  try {
    const wishes = JSON.parse(localStorage.getItem("vuon-an-lanh-wishes") || "[]");
    wishes.push({ message, to: document.getElementById("wishTo").value.trim(), createdAt: new Date().toISOString() });
    localStorage.setItem("vuon-an-lanh-wishes", JSON.stringify(wishes.slice(-30)));
  } catch {}
  document.getElementById("formSuccess").classList.add("show");
  document.getElementById("wishText").value = "";
  document.getElementById("wishTo").value = "";
});
document.getElementById("soundButton").addEventListener("click", () => {
  const toast = document.getElementById("toast");
  toast.textContent = "Âm thanh thiên nhiên sẽ được bổ sung ở bản tiếp theo.";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
});