import './style.scss'

import template from './template.jade'

export function main() {
  const div = document.createElement('div')
  div.className = 'coming-soon'
  div.innerHTML = template()

  import(/* webpackChunkName: 'comingSoonDemo' */ './demo').then(
    (loadedModule) => {
      const button = div.querySelector('.coming-soon--demo')
      loadedModule.main(button)
    }
  )

  document.body.appendChild(div)
}
