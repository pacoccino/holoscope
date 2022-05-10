import 'normalize.css'

import HoloscopeDisplay from './holoscope'
import AbstractScene from './scenes/AbstractScene'
import VideoScene from './scenes/VideoScene'
import ThreeScene from './scenes/ThreeScene'

const ScenesParams = {
  orb: [VideoScene, 'assets/videos/orb.mp4'],
  woodpecker: [ThreeScene, 'assets/3d/woodpecker/scene.gltf'],
}
async function App() {
  const defaultSceneParams = ScenesParams[Object.keys(ScenesParams)[0]]
  const sceneId = window.location.hash.replace('#', '')
  const sceneParams = ScenesParams[sceneId] || defaultSceneParams

  const scene: AbstractScene = new sceneParams[0](sceneParams[1])

  const holoscope = new HoloscopeDisplay(scene)
  await holoscope.prepare()
  await holoscope.start()

  window.addEventListener('hashchange', (e) => window.location.reload())
}

App().catch(console.error)
