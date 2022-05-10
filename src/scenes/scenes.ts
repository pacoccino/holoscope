import VideoScene from './VideoScene'
import ThreeScene from './ThreeScene'

const ScenesParams = {
  orb: [VideoScene, 'assets/videos/orb.mp4'],
  woodpecker: [ThreeScene, 'assets/3d/woodpecker/scene.gltf'],
}
const defaultSceneParams = ScenesParams[Object.keys(ScenesParams)[0]]

export { ScenesParams, defaultSceneParams }
