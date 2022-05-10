const videoUrl = new URL('../../assets/videos/ColorOrb_1.mp4', import.meta.url);

interface Size {
  width: number;
  height: number;
}

export class Scene {
  size:Size
  source: any

  constructor() {

  }

  async prepare() {
    return new Promise(resolve => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;
      video.loop = true;

      video.addEventListener('loadedmetadata', () => {
        this.size = {
          width: video.videoWidth,
          height: video.videoHeight,
        }
        this.source = video
        video.play();
        resolve();
      });
    })
  }
}
