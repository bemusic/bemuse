
import '../polyfill'

import $ from 'jquery'
import BemuseLoader from '../bemuse-loader'

export function main() {

  let loader = new BemuseLoader('/music/nora2r_bbkkbkk/bbkkbkk.bemuse')
  loader.list()
  .then(function(x) {
    console.log(x)
    button('File has been loaded!')
  })
  .done()

}

function button(text, cb) {
  $('<button></button>').text(text).click(cb).appendTo('body')
}

