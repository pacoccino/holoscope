import 'normalize.css'

import HoloscopeDisplay from './holoscope'
import AbstractScene from './scenes/AbstractScene'
import VideoScene from './scenes/VideoScene'
import ThreeScene from './scenes/ThreeScene'

async function App() {
  const path = window.location.pathname
  let scene: AbstractScene
  switch (path) {
    case '/video':
      scene = new VideoScene()
      break
    case '/3d':
    default:
      scene = new ThreeScene()
  }

  const holoscope = new HoloscopeDisplay(scene)
  await holoscope.prepare()
  await holoscope.start()
}

App().catch(console.error)
