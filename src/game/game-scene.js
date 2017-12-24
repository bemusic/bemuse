import $ from 'jquery'

export default function GameScene (display) {
  return function (container) {
    let handler = () => false
    $(window).on('touchstart', handler)
    showCanvas(display, container)
    return {
      teardown () {
        $(window).off('touchstart', handler)
      }
    }
  }
}

function showCanvas (display, container) {
  var { view, wrapper } = display
  var { width, height } = view
  container.appendChild(wrapper)

  resize()
  $(window).on('resize', resize)

  function resize () {
    var scale = Math.min(window.innerWidth / width, window.innerHeight / height)
    view.style.width = Math.round(width * scale) + 'px'
    view.style.height = Math.round(height * scale) + 'px'
    wrapper.style.width = Math.round(width * scale) + 'px'
    wrapper.style.height = Math.round(height * scale) + 'px'
    var yOffset = (window.innerHeight - height * scale) / 2
    wrapper.style.marginTop = Math.round(yOffset) + 'px'
  }

  return wrapper
}
