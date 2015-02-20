
import $ from 'jquery'

export default function GameScene(display) {
  return function(container) {
    showCanvas(display.view, container)
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
  }

}
