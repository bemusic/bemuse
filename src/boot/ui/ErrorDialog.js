
import './ErrorDialog.scss'
import template from './ErrorDialog.jade'

/* isparta ignore next */
function show(message, url, line, col, e) {
  var div = document.createElement('div')
  div.className = 'ErrorDialog'
  div.innerHTML = template({ message, url, line, col, e })
  document.body.appendChild(div)
  var close = div.querySelector('.ErrorDialogのclose')
  if (close) {
    close.addEventListener('click', function() {
      div.parentNode.removeChild(div)
    }, false)
  }
}

export { show }
