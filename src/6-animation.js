import * as Three from 'Three'
import gsap from "gsap";

// 创建场景
const scene = new Three.Scene();
const cube = new Three.Mesh(
    new Three.BoxGeometry(1, 1, 1), // 立方体
    new Three.MeshBasicMaterial({ color: 'red' }) // 材质
)
scene.add(cube)
const camera = new Three.PerspectiveCamera(
    75, // 视野角度（FOV）
    window.innerWidth / window.innerHeight, // 长宽比（aspect ratio）
    0.1,
    1000
  );
camera.position.set(1,1,5)
const axesHelper = new Three.AxesHelper( 3 );
scene.add( axesHelper );
// render
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

// clock
const clock = new Three.Clock()
const tick = () => {    
    const elapsedTime = clock.getElapsedTime()

    camera.position.x = Math.sin(elapsedTime)
    camera.position.y = Math.cos(elapsedTime)
    // camera.lookAt(cube.position)

    // cube.position.z = Math.cos(elapsedTime)
    renderer.render(scene, camera);
    requestAnimationFrame(tick)
}
tick()
console.log(gsap.to)
gsap.to(cube.position,{
    x:2,
    duration:1,
    delay:2
})
gsap.to(cube.position,{
    x:0,
    duration:1,
    delay:3
})