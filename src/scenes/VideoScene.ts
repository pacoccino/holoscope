import AbstractScene from './AbstractScene'

const defaultVideoUrl = 'assets/videos/ColorOrb_1.mp4'

interface Size {
  width: number
  height: number
}

class VideoScene implements AbstractScene {
  size: Size
  source: HTMLVideoElement
  videoUrl: string

  constructor(videoUrl = defaultVideoUrl) {
    this.videoUrl = videoUrl
  }

  async prepare() {
    return new Promise<void>((resolve) => {
      const video = document.createElement('video')
      video.src = this.videoUrl
      video.muted = true
      video.loop = true

      video.addEventListener('loadedmetadata', () => {
        this.size = {
          width: video.videoWidth,
          height: video.videoHeight,
        }
        this.source = video
        video.play()
        resolve()
      })
    })
  }
  async animate() {}
}

export default VideoScene
