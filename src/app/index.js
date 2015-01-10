
import '../polyfill'

import $ from 'jquery'
import BemuseLoader from '../bemuse-loader'
import SamplingMaster from '../sampling-master'
import ctx from 'audio-context'

export function main() {

  let loader = new BemuseLoader('/music/nora2r_bbkkbkk/bbkkbkk.bemuse')
  let master = new SamplingMaster(ctx)
  loader.file('E5.mp3').then(function(x) {
    return master.sample(x).then(function(s) {
      s.play()
      button('played')
    })
  })
  .done()

}

function button(text, cb) {
  $('<button></button>').text(text).click(cb).appendTo('body')
}

