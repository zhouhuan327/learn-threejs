import * as Three from "Three";
import { OrbitControls } from "Three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new Three.Scene();

/**
 * Lights
 */
// 环境光
const ambientLight = new Three.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01).name("环境光 强度");
// 定向光
const directionLight = new Three.DirectionalLight(0x00fffc, 0.3);
directionLight.position.set(1, 0.25, 0);
scene.add(directionLight);

//半球光
// 位于场景正上方的光源，颜色从天空颜色渐变到地面颜色。
const hemisphereLight = new Three.HemisphereLight(0xff0000, 0x0000ff, 1);
// scene.add(hemisphereLight)
// 点光源
//从一个点向各个方向发射的光。一个常见的用例是复制从裸灯泡发出的光。
const pointLight = new Three.PointLight(0xff9000, -0.5, 3);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// 矩形区域光
// RectAreaLight 在矩形平面上均匀地发光。这种灯光类型可用于模拟光源，例如明亮的窗户或条形照明。
const rectAreaLight = new Three.RectAreaLight(0x4e00f, 10, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new Three.Vector3(0, 0, 0));
scene.add(rectAreaLight);

// 聚光灯 手电筒
// 这种光从一个方向的单个点发出，沿着一个锥形，距离它越远，它的尺寸就越大。
const spotLight = new Three.SpotLight(
  // 颜色
  "red",
  // 强度
  0.8,
  20,
  Math.PI * 0.1,
  0.3,
  1
);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -1.7
scene.add(spotLight.target)
scene.add(spotLight);



//helpers
const hemisphereLightHelper = new Three.HemisphereLightHelper(hemisphereLight,0.2)
scene.add(hemisphereLightHelper)

const spotLightHelper = new Three.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const directionLightHelper = new Three.DirectionalLightHelper(directionLight,0.2)
scene.add(directionLightHelper)

const pointLightHelper = new Three.PointLightHelper(pointLight,0.2)
scene.add(pointLightHelper)
/**
 * Objects
 */
// Material
const material = new Three.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new Three.Mesh(
  new Three.SphereBufferGeometry(0.5, 32, 32),
  material
);
sphere.position.x = -1.5;

const cube = new Three.Mesh(
  new Three.BoxBufferGeometry(0.75, 0.75, 0.75),
  material
);

const torus = new Three.Mesh(
  new Three.TorusBufferGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new Three.Mesh(new Three.PlaneBufferGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
const camera = new Three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new Three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
