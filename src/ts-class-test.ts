import ThreeBase from "./class/ThreeBase";
import type { Mesh } from "three";
import * as Three from "three";

class Galaxy extends ThreeBase {
  constructor() {
    super();
    const cube1: Mesh = new Three.Mesh(
      new Three.BoxGeometry(1, 1, 1), // 立方体
      new Three.MeshBasicMaterial({ color: "red" }) // 材质
    );
    this.scene.add(cube1);
  }
}

const g = new Galaxy();
console.log(g);
