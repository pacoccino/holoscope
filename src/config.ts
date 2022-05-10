const defaultConfig = {
  squareWidth: 320,
  squareHeight: 300,
  contrast: 130,
  brightness: 1.2,
  scaleHeight: 0.99, // 0-1: reduce and have border in the middle, 1-2 scale to fit screen width
}

const Config = {
  defaultConfig,
  loadStorage() {
    return JSON.parse(localStorage.getItem('holo_conf') || '{}')
  },
  writeStorage(conf, cb) {
    localStorage.setItem('holo_conf', JSON.stringify(conf))
    cb && cb()
  },
}
export default Config
