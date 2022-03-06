import type { Mesh, Raycaster, Vector2 } from "three";
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
  container: HTMLElement;
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  axesHelper: AxesHelper;
  controls;
  gui;
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
    //  this.setAnimate();
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
    this.camera.position.x = 3;
    this.camera.position.y = 3;
    this.camera.position.z = 3;
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

class RayCaster extends ThreeBase {
  object1: Mesh;
  object2: Mesh;
  object3: Mesh;
  mouse: Vector2;

  currentIntersect = null;
  constructor() {
    super();
    this.setMouse();
    this.setObject();
    this.setAnimate();
  }
  setObject() {
    this.object1 = new Three.Mesh(
      new Three.SphereBufferGeometry(0.5, 16, 16),
      new Three.MeshBasicMaterial({ color: "#ff0000" })
    );
    this.object1.position.x = -2;

    this.object2 = new Three.Mesh(
      new Three.SphereBufferGeometry(0.5, 16, 16),
      new Three.MeshBasicMaterial({ color: "#ff0000" })
    );

    this.object3 = new Three.Mesh(
      new Three.SphereBufferGeometry(0.5, 16, 16),
      new Three.MeshBasicMaterial({ color: "#ff0000" })
    );
    this.object3.position.x = 2;

    this.scene.add(this.object1, this.object2, this.object3);
  }
  setAnimate() {
    const clock = new Three.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      this.object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      this.object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
      this.object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

      const raycaster = new Three.Raycaster();
      // 固定的射线
      // const rayOrigin = new Three.Vector3(-3, 0, 0);
      // const rayDirection = new Three.Vector3(10, 0, 0);
      // // 将该向量转换为单位向量,变成长度为1的
      // rayDirection.normalize();

      // raycaster.set(rayOrigin, rayDirection);

      // 和跟随鼠标的射线
      raycaster.setFromCamera(this.mouse, this.camera);
      const objects = [this.object1, this.object2, this.object3];
      const intersects = raycaster.intersectObjects<Mesh>(objects);
      // console.log(intersects);
      for (const item of objects) {
        // 这里material的类型有点问题
        (item.material as any).color.set("#ff0000");
      }
      // 和射线相交的对象 变成蓝色
      for (const item of intersects) {
        // 这里material的类型有点问题
        (item.object.material as any).color.set("#0000ff");
      }
      // 实现mouseleave和mouseenter
      if (intersects.length) {
        if (!this.currentIntersect) {
          console.log("mouse enter");
        }
        this.currentIntersect = intersects[0];
      } else {
        if (this.currentIntersect) {
          console.log("mouse leave");
        }
        this.currentIntersect = null;
      }

      // Update controls
      this.controls.update();

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
  setMouse() {
    this.mouse = new Three.Vector2();
    window.addEventListener("mousemove", (e) => {
      // clientX clientY 以左上角为0 ,0
      // 换算成以中央为 0, 0
      this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
      // console.log(this.mouse);
    });
    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        console.log("click", this.currentIntersect);
      }
    });
  }
}

new RayCaster();
