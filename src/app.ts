import 'normalize.css'

import HoloscopeDisplay from './holoscope'
import AbstractScene from './scenes/AbstractScene'
import VideoScene from './scenes/VideoScene'
import ThreeScene from './scenes/ThreeScene'

async function App() {
  let scene: AbstractScene

  const path = window.location.pathname
  switch (path) {
    case '/video':
      scene = new VideoScene('assets/videos/orb.mp4')
      break
    case '/3d':
    default:
      scene = new ThreeScene('assets/3d/woodpecker/scene.gltf')
  }

  const holoscope = new HoloscopeDisplay(scene)
  await holoscope.prepare()
  await holoscope.start()
}

App().catch(console.error)
