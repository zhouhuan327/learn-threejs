import * as Three from "Three";
import { OrbitControls } from "Three/examples/jsm/controls/OrbitControls.js";

// 纹理
// const image = new Image()
// image.src = '../static/textures/door/color.jpg'
// const texture = new Three.Texture(image)
// image.onload = () => {
//     texture.needsUpdate = true
// }
const manager = new Three.LoadingManager();
const textureLoader = new Three.TextureLoader(manager);
const texture = textureLoader.load(
  "../static/textures/checkerboard-8x8.png",
  () => {
    console.log("load");
  },
  () => {
    console.log("progress");
  },
  (err) => {
    console.log("error", err);
  }
);
// 让材质变清晰
texture.magFilter = Three.NearestFilter
const texture2 = textureLoader.load("../static/textures/door/color.jpg");
// texture2.repeat.x = 2
// texture2.repeat.y = 3
// texture2.wrapS = Three.MirroredRepeatWrapping;
// texture2.wrapT = Three.MirroredRepeatWrapping;
// texture2.rotation = Math.PI / 4
// texture2.center.x = 0.5
// texture2.center.y =  0.5
texture2.minFilter = Three.NearestFilter
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Started loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

manager.onLoad = function () {
  console.log("Loading complete!");
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

manager.onError = function (url) {
  console.log("There was an error loading " + url);
};
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new Three.Scene();

/**
 * Object
 */
const geometry = new Three.BoxBufferGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({ map: texture });
const mesh = new Three.Mesh(geometry, material);
scene.add(mesh);

console.log(geometry.attributes.uv);

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
camera.position.z = 1;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
