// 粒子
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/static/textures/particles/2.png");
// 粒子
// 随机的几何体
const particlesGeometry = new THREE.BufferGeometry();
const count = 10000;
// 500个点,每个点有三个坐标 xyzxyzxyz依次存放
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  // 随机坐标
  positions[i] = (Math.random() - 0.5) * 10;
  // 随机rgb
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  // color: new THREE.Color("#ff88cc"),
  vertexColors: true, // 使用点的颜色
  size: 0.1,
  sizeAttenuation: true,
  // 不显示黑边
  alphaMap: particlesTexture,
  transparent: true,

  // alphaTest: 0.001, // 修复前面粒子会遮挡后面的的问题

  // depthTest: false, // 让gpu只管绘制,忽略前后遮挡的关系

  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
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

  // 粒子动画
  // particles.rotation.y = elapsedTime * 0.2;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // 所有粒子的坐标
    const x = particlesGeometry.attributes.position.array[i3];
    // i3 + 1  = 每个坐标的y
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  // 通知这个属性需要更新
  particlesGeometry.attributes.position.needsUpdate = true;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
