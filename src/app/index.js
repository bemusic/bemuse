
import '../polyfill'
import * as Scintillator from '../scintillator'
import co from 'co'
import $ from 'jquery'

export function main() {
  co(function*() {
    let skin      = yield Scintillator.load('/skins/default/skin.xml')
    console.log(skin)
    let instance  = yield Scintillator.instantiate(skin)
    let display   = yield Scintillator.createDisplay(skin.width, skin.height)
    Scintillator.render(instance, display, {})
    showCanvas(display.view)
  })
  .done()

}

function showCanvas(view) {

  var { width, height } = view

  view.style.display = 'block'
  view.style.margin = '0 auto'

  document.body.appendChild(view)
  resize()
  $(window).on('resize', resize)

  function resize() {
    var scale = Math.min(
      window.innerWidth / width,
      window.innerHeight / height,
      1
    )
    view.style.width = Math.round(width * scale) + 'px'
    view.style.height = Math.round(height * scale) + 'px'
  }

}
