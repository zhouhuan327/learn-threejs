import * as Three from 'Three'
// 创建场景
const scene = new Three.Scene();

const group = new Three.Group();

const cube1 = new Three.Mesh(
    new Three.BoxGeometry(1, 1, 1), // 立方体
    new Three.MeshBasicMaterial({ color: 'red' }) // 材质
)
const cube2 = new Three.Mesh(
    new Three.BoxGeometry(1, 1, 1), // 立方体
    new Three.MeshBasicMaterial({ color: 'green' }) // 材质
)
const cube3 = new Three.Mesh(
    new Three.BoxGeometry(1, 1, 1), // 立方体
    new Three.MeshBasicMaterial({ color: 'green' }) // 材质
)
cube2.position.x = -2
cube3.position.x = 2
group.add(cube1);
group.add(cube2);
group.add(cube3);

group.position.y = 2
group.rotation.y = 1
// 用于简单模拟3个坐标轴的对象.
const axesHelper = new Three.AxesHelper( 3 );
scene.add( axesHelper );

// mesh.position.set(0,0,0)
// // 缩放
// mesh.scale.set(2,1,1)
// 旋转
// mesh.rotation.reorder('YXZ')
// mesh.rotation.set(1,1.3,0.6)
// console.log(mesh.position.length())
// mesh.position.normalize()
// console.log(mesh.position.length())

const camera = new Three.PerspectiveCamera(
  75, // 视野角度（FOV）
  window.innerWidth / window.innerHeight, // 长宽比（aspect ratio）
  0.1,
  1000
);
camera.position.set(1,1,5)
// camera.lookAt(mesh.position)
scene.add(group);

const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);



