import 'style-loader!./style.scss'

import template from './template.jade'

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
