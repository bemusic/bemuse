
import '../polyfill'
import * as Scintillator from '../scintillator'
import co from 'co'
import $ from 'jquery'

export function main() {
  co(function*() {
    console.log(Scintillator)
    let skin      = yield Scintillator.load('/skins/default/skin.xml')
    let context   = new Scintillator.Context(skin)
    let draw = () => { context.render({ lol: 50 }) }
    draw()
    requestAnimationFrame(function f() {
      draw()
      requestAnimationFrame(f)
    })
    showCanvas(context.view)
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
