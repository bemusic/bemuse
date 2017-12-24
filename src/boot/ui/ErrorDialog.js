import './ErrorDialog.scss'
import template from './ErrorDialog.jade'

function show (message, url, line, col, e) {
  var div = document.createElement('div')
  div.className = 'ErrorDialog'
  div.innerHTML = template({ message, url, line, col, e })
  document.body.appendChild(div)
  var close = div.querySelector('.ErrorDialogのclose')
  if (close) {
    close.addEventListener(
      'click',
      function () {
        div.parentNode.removeChild(div)
      },
      false
    )
  }
}

export { show }
