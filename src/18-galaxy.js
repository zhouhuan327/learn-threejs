import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/static/textures/particles/1.png");
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// 生成银河系
const params = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1, // 自旋
  randomness: 0.02,
  randomnessPower: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};
let geometry = null;
let material = null;
let points = null;
const genGalaxy = () => {
  if (points) {
    // 清除旧的银河系
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const insideColor = new THREE.Color(params.insideColor);
  const outsideColor = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngel = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngel + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngel + spinAngle) * radius + randomZ;

    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / params.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true, // 使用点的颜色
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
genGalaxy();
gui
  .add(params, "count")
  .name("数量")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(genGalaxy);
gui
  .add(params, "size")
  .name("大小")
  .min(0.001)
  .max(0.05)
  .step(0.001)
  .onFinishChange(genGalaxy);
gui
  .add(params, "radius")
  .name("银河半径")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(genGalaxy);
gui
  .add(params, "branches")
  .name("旋臂数")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(genGalaxy);
gui
  .add(params, "spin")
  .name("旋臂自旋角度")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(genGalaxy);
gui
  .add(params, "randomness")
  .name("随机量")
  .min(0)
  .max(2)
  .step(0.02)
  .onFinishChange(genGalaxy);
gui
  .add(params, "randomnessPower")
  .min(0)
  .max(10)
  .step(0.001)
  .onFinishChange(genGalaxy);
gui.addColor(params, "insideColor").onFinishChange(genGalaxy);
gui.addColor(params, "outsideColor").onFinishChange(genGalaxy);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
