
import $ from 'jquery'

export default function GameScene(display) {
  return function(container) {
    let handler = () => false
    $(window).on('touchstart', handler)
    showCanvas(display.view, container)
    return function() {
      $(window).off('touchstart', handler)
    }
  }
}

function showCanvas(view, container) {

  var { width, height } = view

  view.style.display = 'block'
  view.style.margin = '0 auto'

  container.appendChild(view)
  resize()
  $(window).on('resize', resize)

  function resize() {
    var scale = Math.min(
      window.innerWidth / width,
      window.innerHeight / height
    )
    view.style.width = Math.round(width * scale) + 'px'
    view.style.height = Math.round(height * scale) + 'px'
    var yOffset = (window.innerHeight - height * scale) / 2
    view.style.marginTop = Math.round(yOffset) + 'px'
  }

}
