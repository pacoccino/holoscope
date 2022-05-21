import VideoScene from './VideoScene'
import ThreeScene from './ThreeScene'

const ScenesParams = {
  video: [VideoScene, window.location.search.replace('?n=', '')],
  orb: [VideoScene, 'orb.mp4'],
  woodpecker: [ThreeScene, 'woodpecker/scene.gltf'],
  // plume: [VideoScene, 'local/plume.mp4'],
  // pac: [VideoScene, 'local/pac.mp4'],
  // mitch: [VideoScene, 'local/mitch.mp4'],
  // ml: [VideoScene, 'local/ml.mp4'],
}
const defaultSceneParams = ScenesParams[Object.keys(ScenesParams)[0]]

export { ScenesParams, defaultSceneParams }
