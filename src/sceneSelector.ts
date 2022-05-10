import { ScenesParams } from './scenes/scenes'

export function selectorUI() {
  const root = document.getElementById('root')
  const ul = document.createElement('ul')
  ul.className = 'selector'

  Object.keys(ScenesParams).forEach((key) => {
    const li = document.createElement('li')
    li.innerHTML = `<a href="#${key}">${key}</a>`
    ul.appendChild(li)
  })

  root.appendChild(ul)
}
