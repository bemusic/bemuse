
import './error-dialog.scss'
import template from './error-dialog.jade'

/* isparta ignore next */
function show(message, url, line, col, e) {
  var div = document.createElement('div')
  div.className = 'error-dialog'
  div.innerHTML = template({ message, url, line, col, e })
  document.body.appendChild(div)
  var close = div.querySelector('.error-dialog--close')
  if (close) {
    close.addEventListener('click', function() {
      div.parentNode.removeChild(div)
    }, false)
  }
}

export { show }
