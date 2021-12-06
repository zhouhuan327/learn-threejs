
import * as Three from 'Three'
import { OrbitControls } from 'Three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Textures
const textureLoader = new Three.TextureLoader()
const cubeTextureLoader = new Three.CubeTextureLoader()

const doorColorTexture = textureLoader.load('../static/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('../static/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('../static/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('../static/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('../static/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('../static/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('../static/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('../static/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('../static/textures/gradients/5.jpg')

const environmentMapTexture = cubeTextureLoader.load([
    '../static/textures/environmentMaps/2/px.jpg',
    '../static/textures/environmentMaps/2/nx.jpg',
    '../static/textures/environmentMaps/2/py.jpg',
    '../static/textures/environmentMaps/2/ny.jpg',
    '../static/textures/environmentMaps/2/pz.jpg',
    '../static/textures/environmentMaps/2/nz.jpg'
])

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new Three.Scene()

/**
 * Lights
 */
// 环境光
const ambientLight = new Three.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const light = new Three.PointLight(0xffffff, 0.5)
light.position.x = 2
light.position.y = 3
light.position.z = 4
scene.add(light)

/**
 * Objects
 */
// const material = new Three.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new Three.Color('#ff0000')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// material.side = Three.DoubleSide
// material.flatShading = true

// const material = new Three.MeshNormalMaterial()
// material.flatShading = true

// 光影不会变化的材质
// const material = new Three.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new Three.MeshDepthMaterial()

// 一种用于无光泽表面的材料，没有镜面高光。
// const material = new Three.MeshLambertMaterial()
// 和上面的很像 ,但是有高光
// const material = new Three.MeshPhongMaterial()
// material.shininess = 100 // 光泽度
// material.specular = new Three.Color(0x1188ff) // 高光的颜色
// 实现卡通着色的材质
// const material = new Three.MeshToonMaterial()
// // gradientTexture.generateMipmaps = false
// gradientTexture.minFilter = Three.NearestFilter
// gradientTexture.magFilter = Three.NearestFilter
// material.gradientMap = gradientTexture
// 一种标准的基于物理的材质
const material = new Three.MeshStandardMaterial()
material.metalness = 0.7// 金属性
material.roughness = 0.2
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.1)
// material.map = doorColorTexture

// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1

// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05

// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)

// material.transparent = true
// material.alphaMap = doorAlphaTexture

// const material = new Three.MeshPhysicalMaterial()
// material.metalness = 0
// material.roughness = 1
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// const material = new Three.MeshStandardMaterial()
// material.metalness = 0.7
// material.roughness = 0.2
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
material.envMap = environmentMapTexture

const sphere = new Three.Mesh(
    new Three.SphereBufferGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute('uv2', new Three.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
sphere.position.x = - 1.5

const plane = new Three.Mesh(
    new Three.PlaneBufferGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new Three.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new Three.Mesh(
    new Three.TorusBufferGeometry(0.5, 0.2, 60, 128),
    material
)
torus.geometry.setAttribute('uv2', new Three.BufferAttribute(torus.geometry.attributes.uv.array, 2))
torus.position.x = 1.5
scene.add(sphere, plane, torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new Three.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new Three.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()