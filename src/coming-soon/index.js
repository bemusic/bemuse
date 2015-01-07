
import template from './template.jade'
import 'style!./style.scss'

export function main() {

  var div = document.createElement('div')
  div.className = 'coming-soon'
  div.innerHTML = template()

  document.body.appendChild(div)

}
