import 'style-loader!./style.scss'

import template from './template.jade'

/* eslint import/no-webpack-loader-syntax: off */

export function main () {
  var div = document.createElement('div')
  div.className = 'coming-soon'
  div.innerHTML = template()

  require.ensure(['./demo'], function (require) {
    var button = div.querySelector('.coming-soon--demo')
    require('./demo').main(button)
  }, 'comingSoonDemo')

  document.body.appendChild(div)
}
