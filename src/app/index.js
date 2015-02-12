
import 'bemuse/polyfill'
import * as Scintillator from 'bemuse/scintillator'

import co from 'co'
import $ from 'jquery'
import Chance from 'chance'

import NoteArea from 'bemuse/game/note-area'

export function main() {
  co(function*() {
    let skin      = yield Scintillator.load('/skins/default/skin.xml')
    let context   = new Scintillator.Context(skin)

    let notes     = generateRandomNotes()
    let area      = new NoteArea(notes)

    let data = { }
    let columns = ['SC', '1', '2', '3', '4', '5', '6', '7']

    function updateNotes() {
      let p = data.t * 180 / 60
      let entities = area.getVisibleNotes(p, p + (5 / 3), 550)
      for (let column of columns) {
        data[`note_${column}`] = entities.filter(entity =>
          !entity.height && entity.column === column)
        data[`longnote_${column}`] = entities.filter(entity =>
          entity.height && entity.column === column)
        .map(entity => Object.assign({ }, entity, {
          active: entity.y + entity.height > 550
        }))
      }
    }

    for (let column of columns) {
      data[`note_${column}`] = []
      data[`longnote_${column}`] = []
    }

    let started = new Date().getTime()
    let draw = () => {
      data.t = (new Date().getTime() - started) / 1000
      updateNotes()
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

function generateRandomNotes() {
  let notes = []
  let chance = new Chance(1234)
  let columns = ['SC', '1', '2', '3', '4', '5', '6', '7']
  let nextId = 1
  for (let column of columns) {
    let position = 4
    for (let j = 0; j < 2000; j ++) {
      position += chance.integer({ min: 1, max: 6 }) / 8
      let length = chance.bool({ likelihood: 20 }) ?
                      chance.integer({ min: 1, max: 8 }) / 8 : 0
      let id = nextId++
      if (length > 0) {
        let end = { position: position + length }
        notes.push({ position: position, end, column, id })
        position = end.position
      } else {
        notes.push({ position: position, column, id })
      }
    }
  }
  return notes
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
