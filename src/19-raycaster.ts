import ThreeBase from "./class/ThreeBase";
import type { Mesh, Raycaster, Vector2 } from "three";
import * as Three from "three";
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
