import * as THREE from "three";

const host = document.getElementById("scene");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x102c25);
scene.fog = new THREE.FogExp2(0x173b30, 0.018);

const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 180);
camera.position.set(0, 6.2, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc9e4d2, 0x1b3027, 1.8));
const keyLight = new THREE.DirectionalLight(0xffe2b1, 3.1);
keyLight.position.set(-8, 13, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.left = -18;
keyLight.shadow.camera.right = 18;
keyLight.shadow.camera.top = 18;
keyLight.shadow.camera.bottom = -18;
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x9dc6a0, 1.35);
rimLight.position.set(9, 7, -9);
scene.add(rimLight);

const glow = new THREE.PointLight(0xe8bd75, 38, 24, 2);
glow.position.set(4, 5.2, -1.5);
scene.add(glow);

const barkCanvas = document.createElement("canvas");
barkCanvas.width = 256;
barkCanvas.height = 512;
const barkCtx = barkCanvas.getContext("2d");
barkCtx.fillStyle = "#493b2b";
barkCtx.fillRect(0, 0, 256, 512);
for (let i = 0; i < 95; i++) {
  const x = Math.random() * 256;
  barkCtx.strokeStyle = i % 3 ? "rgba(25,18,12,.24)" : "rgba(190,145,89,.18)";
  barkCtx.lineWidth = 1 + Math.random() * 4;
  barkCtx.beginPath();
  barkCtx.moveTo(x, 0);
  barkCtx.bezierCurveTo(x - 20 + Math.random() * 40, 160, x - 15 + Math.random() * 30, 350, x + Math.random() * 18, 512);
  barkCtx.stroke();
}
const barkTexture = new THREE.CanvasTexture(barkCanvas);
barkTexture.colorSpace = THREE.SRGBColorSpace;
const barkMaterial = new THREE.MeshStandardMaterial({ map: barkTexture, color: 0xc4a17a, roughness: 0.94 });

const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), new THREE.MeshStandardMaterial({ color: 0x294d3a, roughness: 0.98 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.18;
ground.receiveShadow = true;
scene.add(ground);

const terrainMat = new THREE.MeshStandardMaterial({ color: 0x345b42, roughness: 1 });
for (let i = 0; i < 8; i++) {
  const mound = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), terrainMat);
  mound.scale.set(6.5 + (i % 3) * 1.6, 1.2 + (i % 2) * 0.5, 3.8);
  mound.position.set(-17 + i * 4.9, -1.15, -12 - (i % 3) * 2.2);
  mound.receiveShadow = true;
  scene.add(mound);
}

const waterGeometry = new THREE.CircleGeometry(5.7, 96);
const waterMaterial = new THREE.MeshPhysicalMaterial({ color: 0x427d70, roughness: 0.16, metalness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.91 });
const pond = new THREE.Mesh(waterGeometry, waterMaterial);
pond.rotation.x = -Math.PI / 2;
pond.position.set(5.2, -0.105, 1.8);
pond.receiveShadow = true;
scene.add(pond);

const pondRim = new THREE.Mesh(new THREE.TorusGeometry(5.65, 0.16, 10, 100), new THREE.MeshStandardMaterial({ color: 0x65745a, roughness: 0.9 }));
pondRim.rotation.x = Math.PI / 2;
pondRim.position.set(5.2, -0.08, 1.8);
scene.add(pondRim);

const tree = new THREE.Group();
tree.position.set(5.3, 0, -3.3);
scene.add(tree);

function curvedBranch(points, radius, material = barkMaterial) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 9, false), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  tree.add(mesh);
  return mesh;
}

curvedBranch([[0,0,0],[0.12,1.2,0.02],[0.02,2.5,-0.1],[-0.18,4.1,-0.25],[-0.55,5.7,-0.4]], 0.42);
curvedBranch([[0.02,2.6,-0.1],[-0.9,3.5,-0.15],[-2.1,4.4,-0.3],[-3.4,5.1,-0.55]], 0.18);
curvedBranch([[0.02,2.8,-0.1],[0.95,3.7,-0.15],[2.0,4.5,-0.45],[3.4,4.9,-0.65]], 0.2);
curvedBranch([[-0.2,4.0,-0.2],[-1.1,4.8,-0.35],[-1.6,5.8,-0.5],[-2.7,6.4,-0.6]], 0.12);
curvedBranch([[0.2,4.0,-0.25],[1.1,4.9,-0.45],[1.6,5.9,-0.55],[2.8,6.35,-0.7]], 0.13);
curvedBranch([[-1.7,4.3,-0.3],[-2.8,4.45,-0.55],[-3.8,4.85,-0.8]], 0.09);
curvedBranch([[1.8,4.5,-0.45],[2.8,4.4,-0.65],[3.9,4.7,-0.8]], 0.09);

const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.12, 0.16, 0.17, 0.42, 0, 0.62);
leafShape.bezierCurveTo(-0.17, 0.42, -0.12, 0.16, 0, 0);
const leafGeo = new THREE.ShapeGeometry(leafShape, 5);
leafGeo.rotateX(-Math.PI / 2);
leafGeo.translate(0, 0, -0.31);
const leafColors = [0x567e4d,0x668b52,0x78965a,0x3f6948,0x91a66b,0x58784a];
const leafMats = leafColors.map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.78, side: THREE.DoubleSide }));
const leafCount = 1900;
const leafInstances = leafMats.map(mat => {
  const mesh = new THREE.InstancedMesh(leafGeo, mat, Math.ceil(leafCount / leafMats.length));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  tree.add(mesh);
  return mesh;
});
const dummy = new THREE.Object3D();
let leafIndex = 0;
for (let i = 0; i < leafCount; i++) {
  const u = Math.random() * Math.PI * 2;
  const v = Math.acos(2 * Math.random() - 1);
  const radius = 3.15 + Math.random() * 0.65;
  const x = Math.sin(v) * Math.cos(u) * radius;
  const y = 5.7 + Math.cos(v) * radius * 0.64;
  const z = Math.sin(v) * Math.sin(u) * radius * 0.62;
  dummy.position.set(x, y, z);
  dummy.rotation.set((Math.random() - 0.5) * 1.1, u, (Math.random() - 0.5) * 1.4);
  const size = 0.48 + Math.random() * 0.72;
  dummy.scale.set(size, size * (0.8 + Math.random() * 0.5), size);
  dummy.updateMatrix();
  const materialIndex = i % leafMats.length;
  const localIndex = Math.floor(i / leafMats.length);
  leafInstances[materialIndex].setMatrixAt(localIndex, dummy.matrix);
  leafIndex++;
}
leafInstances.forEach(mesh => { mesh.instanceMatrix.needsUpdate = true; });

const lanterns = [];
for (let i = 0; i < 5; i++) {
  const group = new THREE.Group();
  const warm = new THREE.MeshStandardMaterial({ color: 0xf4d59a, emissive: 0xd89b43, emissiveIntensity: 1.8, roughness: 0.36 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 18), warm);
  body.scale.set(0.82, 1.24, 0.82);
  group.add(body);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x725337, metalness: 0.4, roughness: 0.6 }));
  top.position.y = 0.25;
  group.add(top);
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.012, 6, 14), new THREE.MeshStandardMaterial({ color: 0xc7a66b, metalness: 0.65 }));
  loop.position.y = 0.33;
  group.add(loop);
  group.position.set(2.4 + i * 1.05, 2.2 + (i % 3) * 0.7, -1.1 - (i % 2) * 1.1);
  tree.add(group);
  const light = new THREE.PointLight(0xffc878, 4.5, 5, 2);
  light.position.copy(group.position);
  scene.add(light);
  lanterns.push({ group, light, phase: i * 1.7 });
}

const lotusGroup = new THREE.Group();
scene.add(lotusGroup);
const padMat = new THREE.MeshStandardMaterial({ color: 0x4e8058, roughness: 0.75, side: THREE.DoubleSide });
const petalMat = new THREE.MeshStandardMaterial({ color: 0xe9c6c0, roughness: 0.42, side: THREE.DoubleSide });
const lotusGold = new THREE.MeshStandardMaterial({ color: 0xe6bd70, roughness: 0.5 });
for (let i = 0; i < 7; i++) {
  const angle = i * 2.4;
  const radius = 1.1 + (i % 3) * 1.25;
  const x = 5.2 + Math.cos(angle) * radius;
  const z = 1.8 + Math.sin(angle) * radius;
  const pad = new THREE.Mesh(new THREE.CircleGeometry(0.48 + (i % 2) * 0.12, 32), padMat);
  pad.rotation.x = -Math.PI / 2;
  pad.rotation.z = angle;
  pad.position.set(x, -0.01, z);
  lotusGroup.add(pad);
  if (i % 2 === 0) {
    const flower = new THREE.Group();
    for (let j = 0; j < 9; j++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), petalMat);
      petal.scale.set(0.7, 1.8, 0.55);
      const a = j / 9 * Math.PI * 2;
      petal.position.set(Math.cos(a) * 0.16, 0.12, Math.sin(a) * 0.16);
      petal.rotation.z = Math.cos(a) * 0.4;
      petal.rotation.x = Math.sin(a) * 0.4;
      flower.add(petal);
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), lotusGold);
    center.position.y = 0.13;
    flower.add(center);
    flower.position.set(x, 0.02, z);
    lotusGroup.add(flower);
  }
}

const steppingStones = new THREE.Group();
scene.add(steppingStones);
for (let i = 0; i < 9; i++) {
  const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 + Math.random() * 0.2, 1), new THREE.MeshStandardMaterial({ color: 0x777968, roughness: 0.96 }));
  stone.scale.y = 0.28;
  stone.position.set(0.8 + i * 0.82, -0.04, 5.4 + Math.sin(i * 0.8) * 0.45);
  stone.rotation.y = Math.random() * 2;
  stone.castShadow = true;
  steppingStones.add(stone);
}

const fireflies = [];
const fireflyMaterial = new THREE.MeshBasicMaterial({ color: 0xffe4a5 });
for (let i = 0; i < 65; i++) {
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.025 + Math.random() * 0.025, 8, 8), fireflyMaterial);
  dot.position.set((Math.random() - 0.5) * 20, 0.5 + Math.random() * 7, -6 + Math.random() * 12);
  scene.add(dot);
  fireflies.push({ mesh: dot, base: dot.position.clone(), phase: Math.random() * 6.28, speed: 0.3 + Math.random() * 0.6 });
}

const petals = [];
const fallingPetalGeo = new THREE.SphereGeometry(0.045, 8, 6);
const fallingPetalMat = new THREE.MeshStandardMaterial({ color: 0xd8b7a4, roughness: 0.7 });
for (let i = 0; i < 42; i++) {
  const petal = new THREE.Mesh(fallingPetalGeo, fallingPetalMat);
  petal.scale.set(1.7, 0.42, 0.8);
  petal.position.set((Math.random() - 0.5) * 22, Math.random() * 10, -2 + (Math.random() - 0.5) * 15);
  scene.add(petal);
  petals.push({ mesh: petal, speed: 0.12 + Math.random() * 0.22, phase: Math.random() * 6.28 });
}

const clock = new THREE.Clock();
let targetX = 0;
let targetY = 0;
let entering = false;

function resize() {
  const width = host.clientWidth;
  const height = host.clientHeight;
  camera.aspect = width / height;
  camera.position.z = width < 760 ? 23 : 20;
  camera.position.y = width < 760 ? 6.4 : 6.2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener("resize", resize, { passive: true });
resize();

window.addEventListener("pointermove", event => {
  if (event.pointerType === "touch" || reducedMotion) return;
  targetX = (event.clientX / window.innerWidth - 0.5) * 0.45;
  targetY = (event.clientY / window.innerHeight - 0.5) * 0.18;
}, { passive: true });

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const motion = reducedMotion ? 0 : 1;
  camera.position.x += (targetX + Math.sin(t * 0.1) * 0.1 * motion - camera.position.x) * 0.018;
  camera.position.y += (6.2 + targetY + Math.sin(t * 0.18) * 0.06 * motion - camera.position.y) * 0.018;
  camera.lookAt(1.4, 3.0, -1.3);
  tree.rotation.z = Math.sin(t * 0.16) * 0.004 * motion;
  waterMaterial.roughness = 0.15 + Math.sin(t * 0.65) * 0.025;
  lanterns.forEach(({ group, light, phase }) => {
    group.position.y += Math.sin(t * 0.55 + phase) * 0.0015 * motion;
    group.rotation.z = Math.sin(t * 0.3 + phase) * 0.045 * motion;
    light.intensity = 3.8 + Math.sin(t * 1.5 + phase) * 0.7;
  });
  fireflies.forEach(({ mesh, base, phase, speed }) => {
    mesh.position.x = base.x + Math.sin(t * speed + phase) * 0.35 * motion;
    mesh.position.y = base.y + Math.cos(t * speed * 0.8 + phase) * 0.25 * motion;
    mesh.position.z = base.z + Math.sin(t * speed * 0.5 + phase) * 0.22 * motion;
  });
  petals.forEach(({ mesh, speed, phase }) => {
    if (motion) {
      mesh.position.y -= speed * 0.012;
      mesh.position.x += Math.sin(t * 0.4 + phase) * 0.0025;
      mesh.rotation.z += 0.0015;
      if (mesh.position.y < -0.2) mesh.position.y = 8 + Math.random() * 3;
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
  targetX = entering ? 0.55 : 0;
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
