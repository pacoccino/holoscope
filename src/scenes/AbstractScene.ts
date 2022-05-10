abstract class AbstractScene {
  source: HTMLCanvasElement | HTMLMediaElement
  async prepare() {}
  async animate(elapsed: number) {}
}

export default AbstractScene
