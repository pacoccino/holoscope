export interface Size {
  width: number
  height: number
  aspect: number
}

abstract class AbstractScene {
  source: HTMLCanvasElement | HTMLMediaElement
  size: Size

  async prepare() {}
  async animate(deltaMs: number) {}
}

export default AbstractScene
