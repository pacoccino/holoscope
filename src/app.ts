import 'normalize.css'

import HoloscopeDisplay from './holoscope'
import AbstractScene from './scenes/AbstractScene'
import { ScenesParams, defaultSceneParams } from './scenes/scenes'
import { selectorUI } from './sceneSelector'

async function App() {
  const sceneId = window.location.hash.replace('#', '')
  if (sceneId) {
    const sceneParams = ScenesParams[sceneId] || defaultSceneParams

    const scene: AbstractScene = new sceneParams[0](sceneParams[1])

    const holoscope = new HoloscopeDisplay(scene)
    await holoscope.prepare()
    await holoscope.start()
  } else {
    selectorUI()
  }

  window.addEventListener('hashchange', (e) => window.location.reload())
}

App().catch(console.error)
