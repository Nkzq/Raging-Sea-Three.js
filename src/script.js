import './style.css'
import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
  width: 340
})
const debugObject = {}
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'
debugObject.sceneBgColor = '#6c95e1'
debugObject.sceneFogColor = '#5a8ceb'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(debugObject.sceneBgColor)
scene.fog = new THREE.Fog(debugObject.sceneFogColor, 2.5, 4)

console.log(scene.fog)

gui.add(scene.fog, 'far').min(0).max(20).step(0.001)
gui.add(scene.fog, 'near').min(0).max(20).step(0.001)

gui.addColor(debugObject, 'sceneBgColor').name('sceneBgColor').onChange(() => {
  scene.background = new THREE.Color(debugObject.sceneBgColor)
})

gui.addColor(debugObject, 'sceneFogColor').name('sceneFogColor').onChange(() => {
  scene.fog.color = new THREE.Color(debugObject.sceneFogColor)
})

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(10, 10, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: {
      value: 0
    },
    uBigWavesElevation: {
      value: 0.2
    },
    uBigWavesFrequency: {
      value: new THREE.Vector2(4, 1.5)
    },
    uBigWavesSpeed: {
      value: 0.5
    },
    uDepthColor: {
      value: new THREE.Color(debugObject.depthColor)
    },
    uSurfaceColor: {
      value: new THREE.Color(debugObject.surfaceColor)
    },
    uColorOffset: {
      value: 0
    },
    uColorMultiplier: {
      value: 5
    },
    uSmallWavesElevation: {
      value: 0.15
    },
    uSmallWavesFrequency: {
      value: 3
    },
    uSmallWavesSpeed: {
      value: 0.2
    },
    uSmallWavesIterations: {
      value: 4
    },
    fogColor: {
      type: "c",
      value: scene.fog.color
    },
    fogNear: {
      type: "f",
      value: scene.fog.near
    },
    fogFar: {
      type: "f",
      value: scene.fog.far
    }
  },
  fog: true,
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequency.x')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequency.y')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')
gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(5).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(1).name('uSmallWavesIterations')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// to disable zoom
controls.enableZoom = false
// to disable rotation
controls.minPolarAngle = Math.PI / 3
controls.maxPolarAngle = Math.PI / 3
// to disable pan
controls.enablePan = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update water
  waterMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()