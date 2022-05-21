import Config from './config'
import AbstractScene from './scenes/AbstractScene'

import * as dat from 'dat.gui'

const viewsParams = [
  {
    id: 'view-top',
    position: 'top',
  },
  {
    id: 'view-right',
    position: 'right',
  },
  {
    id: 'view-bottom',
    position: 'bottom',
  },
  {
    id: 'view-left',
    position: 'left',
  },
]

interface View {
  id: string
  container: HTMLElement
  canvas: HTMLCanvasElement
  isHorizontal: boolean
  width: number
  height: number
}

class HoloscopeDisplay {
  views: any[]
  scene: AbstractScene
  aspectRatio: number
  maxHeight: number
  startTimestamp: number
  lastTimestamp: number
  config: typeof Config.defaultConfig
  gui: dat.gui

  constructor(scene: AbstractScene) {
    this.scene = scene
    this.config = Object.assign({}, Config.defaultConfig, Config.loadStorage())
  }

  prepareGUI() {
    this.gui = new dat.GUI()

    const changeHandler = (cb) => () =>
      Config.writeStorage(this.config, cb.bind(this))

    const squareFolder = this.gui.addFolder('Square')
    squareFolder
      .add(this.config, 'squareWidth', 0, 800)
      .onChange(changeHandler(this.rescale))
    squareFolder
      .add(this.config, 'squareHeight', 0, 800)
      .onChange(changeHandler(this.rescale))
    squareFolder.open()

    const scaleFolder = this.gui.addFolder('Scale')
    scaleFolder
      .add(this.config, 'scaleHeight', 0.5, 2)
      .onChange(changeHandler(this.rescale))
    scaleFolder.open()

    const postFolder = this.gui.addFolder('Post-Processing')
    postFolder
      .add(this.config, 'brightness', 0.5, 3)
      .onChange(changeHandler(this.adjustPostProcess))
    postFolder
      .add(this.config, 'contrast', 50, 200)
      .onChange(changeHandler(this.adjustPostProcess))
    postFolder.open()

    this.gui.hide()
  }

  prepareViews() {
    this.views = viewsParams.map((viewParam, viewIndex) => {
      const isHorizontal = viewIndex % 2 === 0

      const view: View = {
        id: viewParam.id,
        isHorizontal,
        container: document.getElementById(viewParam.id),
        width: 0,
        height: 0,
        canvas: document.createElement('canvas'),
      }
      view.container.appendChild(view.canvas)

      view.canvas.style.transform = `rotate(${viewIndex * 90}deg)`

      return view
    })
    this.rescale()
    window.addEventListener('resize', this.rescale.bind(this))
  }

  rescale() {
    const root = document.getElementById('root')

    const screenWidth = root.clientWidth
    const screenHeight = root.clientHeight
    this.aspectRatio = screenWidth / screenHeight

    const center = document.getElementById('center')
    center.style.width = this.config.squareWidth + 'px'
    center.style.height = this.config.squareHeight + 'px'

    this.views.forEach((view) => {
      view.width = view.isHorizontal ? screenWidth : screenHeight
      view.height = view.isHorizontal
        ? (screenHeight - this.config.squareHeight) / 2
        : (screenWidth - this.config.squareWidth) / 2

      view.canvas.height = view.height
      view.canvas.width = view.width

      if (view.isHorizontal) {
        view.container.style.width = view.width + 'px'
        view.container.style.height = view.height + 'px'

        const cpw = (this.config.squareWidth * 100) / 2 / screenWidth
        view.canvas.style.clipPath = `polygon(0% 0%, 100% 0%, ${
          50 + cpw
        }% 100%, ${50 - cpw}% 100%, 0% 0%)`

        this.maxHeight = view.height
      } else {
        view.container.style.width = view.height + 'px'
        view.container.style.height = view.width + 'px'

        const cph = ((this.config.squareHeight / screenHeight) * 100) / 2
        view.canvas.style.clipPath = `polygon(0% 0%, 100% 0%, ${
          50 + cph
        }% 100%, ${50 - cph}% 100%, 0% 0%)`
      }
    })
  }

  adjustPostProcess() {
    document.documentElement.style.setProperty(
      '--brightness',
      this.config.brightness.toString()
    )
    document.documentElement.style.setProperty(
      '--contrast',
      this.config.contrast + '%'
    )
  }

  async prepare() {
    this.prepareViews()
    this.prepareGUI()
    this.adjustPostProcess()
    await this.scene.prepare()
  }

  async animate(timestamp: number) {
    if (this.startTimestamp === undefined) {
      this.startTimestamp = timestamp
    }
    if (this.lastTimestamp === undefined) {
      this.lastTimestamp = timestamp
    }
    // const elapsedMs = timestamp - this.startTimestamp
    const deltaMs = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    // console.log(`${Math.round(deltaMs)} ms`)

    await this.scene.animate(deltaMs)

    this.views.forEach((view) => {
      const dHeight = this.maxHeight * this.config.scaleHeight
      const offsetBottom =
        (this.maxHeight * Math.max(1 - this.config.scaleHeight, 0)) / 2
      const dy = view.height - dHeight - offsetBottom
      const dWidth = dHeight * this.scene.size.aspect
      const dx = (view.width - dWidth) / 2

      const ctx = view.canvas.getContext('2d')
      ctx.drawImage(this.scene.source, dx, dy, dWidth, dHeight)
    })

    requestAnimationFrame(this.animate.bind(this))
  }

  listen() {
    window.addEventListener('keypress', (e) => {
      if (e.key === 'f') {
        if (document.fullscreen) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
      }
    })
  }

  async start() {
    this.listen()
    requestAnimationFrame(this.animate.bind(this))
  }
}

export default HoloscopeDisplay
