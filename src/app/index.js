
import '../polyfill'
import * as Scintillator from '../scintillator'
import co from 'co'
import $ from 'jquery'

export function main() {
  co(function*() {
    console.log(Scintillator)
    let skin      = yield Scintillator.load('/skins/default/skin.xml')
    let context   = new Scintillator.Context(skin)

    let data = { }

    data['note_sc'] = [ { key: 1, y: 10 }, { key: 2, y: 160 } ]
    data['note_1']  = [ { key: 1, y: 20 }, { key: 2, y: 150 } ]
    data['note_2']  = [ { key: 1, y: 30 }, { key: 2, y: 140 } ]
    data['note_3']  = [ { key: 1, y: 40 }, { key: 2, y: 130 } ]
    data['note_4']  = [ { key: 1, y: 50 }, { key: 2, y: 120 } ]
    data['note_5']  = [ { key: 1, y: 60 }, { key: 2, y: 110 } ]
    data['note_6']  = [ { key: 1, y: 70 }, { key: 2, y: 90 } ]
    data['note_7']  = [ { key: 1, y: 80 } ]

    data['longnote_sc'] = [ { key: 1, y: 210, height: 0  } ]
    data['longnote_1']  = [ { key: 1, y: 220, height: 10 } ]
    data['longnote_2']  = [ { key: 1, y: 230, height: 20 } ]
    data['longnote_3']  = [ { key: 1, y: 240, height: 40 } ]
    data['longnote_4']  = [ { key: 1, y: 250, height: 60 } ]
    data['longnote_5']  = [ { key: 1, y: 260, height: 80 } ]
    data['longnote_6']  = [ { key: 1, y: 270, height: 70 } ]
    data['longnote_7']  = [ { key: 1, y: 280, height: 60 } ]

    for (let i of ['longnote_sc', 'longnote_1', 'longnote_2', 'longnote_3',
                    'longnote_4', 'longnote_5', 'longnote_6', 'longnote_7', ]) {
      let y = data[i][0].y + data[i][0].height + 50
      let height = 450 - y
      data[i].push({ key: 2, y, height, active: true })
    }

    let started = new Date().getTime()
    let draw = () => {
      data.t = (new Date().getTime() - started) / 1000
      context.render(data)
    }
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
