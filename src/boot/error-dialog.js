
import './error-dialog.scss'
import template from './error-dialog.jade'

export function show(message, url, line, col, e) {
  var div = document.createElement('div')
  div.className = 'error-dialog'
  div.innerHTML = template({ message, url, line, col, e })
  document.body.appendChild(div)
}
