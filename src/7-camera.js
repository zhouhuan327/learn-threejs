import * as Three from "Three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new Three.Scene();

// Object
const mesh = new Three.Mesh(
  new Three.BoxGeometry(1, 1, 1, 5, 5, 5),
  new Three.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
const camera = new Three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// 正交相机,无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。
// const aspectRatio = sizes.width / sizes.height;
// console.log(aspectRatio)
// const camera = new Three.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
scene.add(camera);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new Three.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// 鼠标拖动
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  // x , y 相对于场景中心
  // [0,1] - 0.5 = [-0.5,+0.5]
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

// controls
const controls = new OrbitControls(camera, renderer.domElement);
// 增加 阻尼惯性
controls.enableDamping = true

const tick = () => {
  //   手动更新相机
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * 5;
  //   camera.lookAt(mesh.position);

  // update controls
  controls.update()
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
