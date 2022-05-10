import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import AbstractScene, { Size } from './AbstractScene'
// const fov = 45
// const aspect = 2 // the canvas default
// const near = 0.1
// const far = 100

const defaultModelUrl = 'assets/3d/woodpecker/scene.gltf'

class ThreeScene implements AbstractScene {
  source: HTMLCanvasElement
  size: Size

  camera: THREE.PerspectiveCamera
  renderer: THREE.Renderer
  objects: Record<string, THREE.Object3D>
  threeScene: THREE.Scene
  mixer: THREE.AnimationMixer
  modelUrl: string

  constructor(modelUrl = defaultModelUrl) {
    this.modelUrl = modelUrl
  }

  async prepare() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    )
    this.camera.position.z = 1

    this.size = {
      width: 800,
      height: 500,
      aspect: 800 / 500,
    }
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.size.width, this.size.height)

    this.objects = {}

    this.source = this.renderer.domElement

    this.createScene()
  }

  async animate(deltaMS: number) {
    this.objects['cube'].rotation.x += 0.01
    this.objects['cube'].rotation.y += 0.02

    this.objects['car'] && (this.objects['car'].rotation.y += 0.01)
    //this.objects['car'].rotation.y = 1.7;

    this.mixer && this.mixer.update(deltaMS / 1000)
    this.renderer.render(this.threeScene, this.camera)
  }

  createScene() {
    this.threeScene = new THREE.Scene()
    this.threeScene.background = new THREE.Color('black')

    {
      const skyColor = 0xb1e1ff // light blue
      const groundColor = 0xb97a20 // brownish orange
      const intensity = 1
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
      this.threeScene.add(light)
    }

    {
      const color = 0xffffff
      const intensity = 2
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-10, 5, 4)
      this.threeScene.add(light)
      this.threeScene.add(light.target)
    }

    {
      const loader = new GLTFLoader()
      loader.load(
        this.modelUrl,
        (gltf) => {
          const root = gltf.scene
          this.objects['car'] = root
          this.threeScene.add(this.objects['car'])

          const box = new THREE.Box3().setFromObject(root)
          const boxSize = box.getSize(new THREE.Vector3()).length()
          const boxCenter = box.getCenter(new THREE.Vector3())
          this.frameArea(boxSize * 1, boxSize, boxCenter)

          if (gltf.animations && gltf.animations.length > 0) {
            const animation = gltf.animations[0]
            this.mixer = new THREE.AnimationMixer(this.objects['car'])
            this.mixer.clipAction(animation).play()
          }
        },
        undefined,
        console.error
      )
    }

    {
      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      const material = new THREE.MeshNormalMaterial()

      this.objects['cube'] = new THREE.Mesh(geometry, material)
      this.threeScene.add(this.objects['cube'])
    }
  }

  frameArea(sizeToFitOnScreen, boxSize, boxCenter) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
    const halfFovY = THREE.MathUtils.degToRad(this.camera.fov * 0.5)
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(this.camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize()

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    this.camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))

    // pick some near and far values for the frustum that
    // will contain the box.
    this.camera.near = boxSize / 100
    this.camera.far = boxSize * 100

    this.camera.updateProjectionMatrix()

    // point the camera to look at the center of the box
    this.camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
  }
}

export default ThreeScene
