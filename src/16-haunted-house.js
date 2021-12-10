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
// 雾气
const fog = new Three.Fog("#262837", 1, 15);
scene.fog = fog;
/**
 * Textures
 */
const textureLoader = new Three.TextureLoader();
const doorColorTexture = textureLoader.load("/static/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/static/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/static/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load(
  "/static/textures/door/height.jpg"
);
const doorNormalTexture = textureLoader.load(
  "/static/textures/door/normal.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "/static/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/static/textures/door/roughness.jpg"
);

const bricksColorTexture = textureLoader.load(
  "/static/textures/bricks/color.jpg"
);
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/static/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load(
  "/static/textures/bricks/normal.jpg"
);
const bricksRoughnessTexture = textureLoader.load(
  "/static/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load(
  "/static/textures/grass/color.jpg"
);
const grassAmbientOcclusionTexture = textureLoader.load(
  "/static/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load(
  "/static/textures/grass/normal.jpg"
);
const grassRoughnessTexture = textureLoader.load(
  "/static/textures/grass/roughness.jpg"
);
// 改变贴图属性
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = Three.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = Three.RepeatWrapping;
grassNormalTexture.wrapS = Three.RepeatWrapping;
grassRoughnessTexture.wrapS = Three.RepeatWrapping;

grassColorTexture.wrapT = Three.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = Three.RepeatWrapping;
grassNormalTexture.wrapT = Three.RepeatWrapping;
grassRoughnessTexture.wrapT = Three.RepeatWrapping;
/**
 * House
 */
// 创建分组
const house = new Three.Group();
scene.add(house);

// 墙壁
const walls = new Three.Mesh(
  new Three.BoxBufferGeometry(4, 2.5, 4),
  new Three.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
// 和aoMap相关
walls.geometry.setAttribute(
  "uv2",
  new Three.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);
// 屋顶
const roof = new Three.Mesh(
  new Three.ConeBufferGeometry(3.5, 1, 4),
  new Three.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);
// 门
const door = new Three.Mesh(
  new Three.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new Three.MeshStandardMaterial({
    // 材质
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    // 不是很清楚是啥
    aoMap: doorAmbientOcclusionTexture,
    // 位移贴图会影响网格顶点的位置
    displacementMap: doorHeightTexture,
    displacementScale: 0.2,
    // 法线贴图的纹理
    normalMap: doorNormalTexture,
    // 改变材质的金属度。
    metalnessMap: doorMetalnessTexture,
    // 改变粗糙度
    roughnessMap: doorRoughnessTexture,
  })
);
// 和aoMap相关
door.geometry.setAttribute(
  "uv2",
  new Three.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);
// 灌木丛
const bushGeometry = new Three.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new Three.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new Three.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new Three.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new Three.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-1.8, 0.1, 2.1);
const bush4 = new Three.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);

// 坟墓
const graves = new Three.Group();
scene.add(graves);

const gravesGeometry = new Three.BoxBufferGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new Three.MeshStandardMaterial({ color: "#b2b6b1" });
// 随机生成坟墓
for (let i = 0; i < 50; i++) {
  // 内圈的圆
  const angle = Math.PI * Math.random() * 2 + 0.5;
  // 随机的范围
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // 创建坟墓
  const grave = new Three.Mesh(gravesGeometry, gravesMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.set(
    0,
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4
  );
  graves.castShadow = true
  graves.add(grave);
}

// 地板
const floor = new Three.Mesh(
  new Three.PlaneBufferGeometry(20, 20),
  new Three.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

// 和aoMap相关
floor.geometry.setAttribute(
  "uv2",
  new Three.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new Three.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new Three.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

scene.add(moonLight);
// 门上的光
const doorLight = new Three.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// 鬼混
const ghost1 = new Three.PointLight("#ff00ff", 2, 3);
const ghost2 = new Three.PointLight("#00ffff", 2, 3);
const ghost3 = new Three.PointLight("#fff00", 2, 3);
scene.add(ghost1, ghost2, ghost3);
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
camera.position.x = 2;
camera.position.y = 3;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const axesHelper = new Three.AxesHelper(10);
scene.add(axesHelper);
/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// 消除黑边
renderer.setClearColor("#262837");
// 激活阴影
renderer.shadowMap.enabled  = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
// !! 接收阴影
floor.receiveShadow = true


/**
 * Animate
 */
const clock = new Three.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // 鬼魂移动
  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
