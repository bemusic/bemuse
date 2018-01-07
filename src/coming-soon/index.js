import 'style-loader!./style.scss'

import template from './template.jade'

/* eslint import/no-webpack-loader-syntax: off */

export function main () {
  const div = document.createElement('div')
  div.className = 'coming-soon'
  div.innerHTML = template()

  import(/* webpackChunkName: 'comingSoonDemo' */ './demo')
    .then(loadedModule => {
      const button = div.querySelector('.coming-soon--demo')
      loadedModule.main(button)
    })

  document.body.appendChild(div)
}
