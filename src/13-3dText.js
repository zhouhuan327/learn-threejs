import * as Three from "Three";
import { OrbitControls } from "Three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "Three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "Three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "dat.gui";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new Three.Scene();
// axes helper
const axesHelper = new Three.AxesHelper();
scene.add(axesHelper);
/**
 * Textures
 */
const textureLoader = new Three.TextureLoader();
const matcapTexture = textureLoader.load("../static/textures/matcaps/3.png");
console.log(typefaceFont);

// 加载font
const fontLoader = new FontLoader();
fontLoader.load(
  "static/fonts/helvetiker_regular.typeface.json",
  // onLoad callback
  function (font) {
    // font — THREE.Font 的一个实例。
    // 大小 - 浮动。文本的大小。默认值为 100。
    // 高度 - 浮动。挤出文本的厚度。默认值为 50。
    // curveSegments — 整数。曲线上的点数。默认值为 12。
    // bevelEnabled — 布尔值。打开斜角。默认值为假。
    // bevelThickness — 浮动。文本斜角的深度。默认值为 10。
    // bevelSize — 浮动。斜角距文本轮廓多远。默认值为 8。
    // bevelOffset — 浮动。从文本轮廓斜角开始的距离。默认值为 0。
    // bevelSegments — 整数。倒角段数。默认值为 3。
    const textGeometry = new TextGeometry("Hello  Three.js", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometry.center();
    // textGeometry.computeBoundingBox()
    // console.log(textGeometry.boundingBox)
    // // 使字体到中心
    // textGeometry.translate(
    //     - textGeometry.boundingBox.max.x * 0.5,
    //     - textGeometry.boundingBox.max.y * 0.5,
    //     - textGeometry.boundingBox.max.z * 0.5,

    // )
    const textMaterial = new Three.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const textMesh = new Three.Mesh(textGeometry, textMaterial);
    // textMesh.position.x = -0.5\
    scene.add(textMesh);

    console.time("donut");
    const texture1 = textureLoader.load("../static/textures/matcaps/1.png");
    const texture2 = textureLoader.load("../static/textures/matcaps/2.png");
    const texture3 = textureLoader.load("../static/textures/matcaps/3.png");
    const texture4 = textureLoader.load("../static/textures/matcaps/4.png");
    const texture5 = textureLoader.load("../static/textures/matcaps/5.png");
    const textureList = [texture1, texture2, texture3, texture4, texture5];
    const donutGeometry = new Three.TorusBufferGeometry(0.3, 0.2, 20, 45);
    const boxGeometry = new Three.BoxBufferGeometry(0.3, 0.3, 0.3);
    // 生成小球
    for (let i = 0; i < 600; i++) {
      const donutMaterial = new Three.MeshMatcapMaterial({
        matcap: textureList[Math.floor(Math.random()*(4-1+1)+1)],
      });
      donutMaterial.metalness = 1; // 金属性
      donutMaterial.roughness = 0.2;
      const donut = new Three.Mesh(
        i % 2 ? donutGeometry : boxGeometry,
        donutMaterial
      );
      donut.position.x = (Math.random() - 0.5) * 20;
      donut.position.y = (Math.random() - 0.5) * 20;
      donut.position.z = (Math.random() - 0.5) * 20;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      const scaleRandom = Math.random();
      donut.scale.set(scaleRandom, scaleRandom, scaleRandom);
      scene.add(donut);
    }
    console.timeEnd("donut");
  },

  // onProgress callback
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  // onError callback
  function (err) {
    console.log("An error happened");
  }
);
/**
 * Object
 */
// const cube = new Three.Mesh(
//   new Three.BoxBufferGeometry(1, 1, 1),
//   new Three.MeshBasicMaterial()
// );

// scene.add(cube);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
