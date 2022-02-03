import ThreeBase from "./class/ThreeBase";
import type { BufferGeometry, PointsMaterial, Points } from "three";
import * as Three from "three";

class Galaxy extends ThreeBase {
  params = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1, // 自旋
    randomness: 0.02,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  };
  geometry: BufferGeometry;
  material: PointsMaterial;
  points: Points;
  constructor() {
    super();

    this.genGalaxy();
    this.setGuiParam();
  }
  genGalaxy() {
    const params = this.params;
    if (this.points) {
      // 清除旧的银河系
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.points);
    }
    this.geometry = new Three.BufferGeometry();
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);
    const insideColor = new Three.Color(params.insideColor);
    const outsideColor = new Three.Color(params.outsideColor);

    for (let i = 0; i < params.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * params.radius;
      const spinAngle = radius * params.spin;
      const branchAngel =
        ((i % params.branches) / params.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), params.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), params.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), params.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = Math.cos(branchAngel + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngel + spinAngle) * radius + randomZ;

      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / params.radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    this.geometry.setAttribute(
      "position",
      new Three.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute("color", new Three.BufferAttribute(colors, 3));
    this.material = new Three.PointsMaterial({
      size: params.size,
      sizeAttenuation: true,
      depthWrite: true,
      blending: Three.AdditiveBlending,
      vertexColors: true, // 使用点的颜色
    });

    this.points = new Three.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }
  setGuiParam() {
    const params = this.params;
    const update = this.genGalaxy.bind(this);
    this.gui
      .add(params, "count")
      .name("数量")
      .min(100)
      .max(100000)
      .step(100)
      .onFinishChange(update);
    this.gui
      .add(params, "size")
      .name("大小")
      .min(0.001)
      .max(0.05)
      .step(0.001)
      .onFinishChange(update);
    this.gui
      .add(params, "radius")
      .name("银河半径")
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(update);
    this.gui
      .add(params, "branches")
      .name("旋臂数")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(update);
    this.gui
      .add(params, "spin")
      .name("旋臂自旋角度")
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(update);
    this.gui
      .add(params, "randomness")
      .name("随机量")
      .min(0)
      .max(2)
      .step(0.02)
      .onFinishChange(update);
    this.gui
      .add(params, "randomnessPower")
      .min(0)
      .max(10)
      .step(0.001)
      .onFinishChange(update);
    this.gui.addColor(params, "insideColor").onFinishChange(update);
    this.gui.addColor(params, "outsideColor").onFinishChange(update);
  }
}

new Galaxy();
