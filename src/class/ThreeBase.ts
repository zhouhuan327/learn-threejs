import * as Three from "three";
import type {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
class ThreeBase {
  container: HTMLElement = null;
  scene: Scene = null;
  renderer: WebGLRenderer = null;
  camera: PerspectiveCamera = null;
  axesHelper: AxesHelper = null;
  controls = null;
  gui = null;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  constructor(targetClassName = "canvas.webgl") {
    this.container = document.querySelector(targetClassName);
    this.init();
  }
  private init() {
    // 初始化场景
    this.scene = new Three.Scene();
    // 相机
    this.setCamera();
    // 控制器
    this.setControls();
    // 渲染器
    this.setRenderer();
    // 动画相关
    this.setAnimate();
    // 响应式
    this.setResponsive();
    // 辅助工具
    this.setTools();
  }
  setCamera() {
    this.camera = new Three.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.x = 1;
    this.camera.position.y = 1;
    this.camera.position.z = 1;
    this.scene.add(this.camera);
  }
  setControls() {
    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
  }
  setRenderer() {
    this.renderer = new Three.WebGLRenderer({
      canvas: this.container,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  setAnimate() {
    const clock = new Three.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      this.controls.update();

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
  setResponsive() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }
  setTools() {
    // xyz轴显示
    this.axesHelper = new Three.AxesHelper(3);
    this.scene.add(this.axesHelper);
    // 属性控制
    this.gui = new dat.GUI({ width: 400 });
  }
}
export default ThreeBase;
