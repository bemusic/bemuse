import './ErrorDialog.scss'
import template from './ErrorDialog.jade'

function show(message, e, url, line, col) {
  const div = document.createElement('div')
  div.className = 'ErrorDialog'
  div.innerHTML = template({ message, url, line, col, e })
  document.body.appendChild(div)
  const close = div.querySelector('.ErrorDialogのclose')
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
