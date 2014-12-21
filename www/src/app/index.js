
import $ from 'jquery'
import '6to5/polyfill'

console.log(x => x + 1)

function wait() {
  return new Promise(resolve => setTimeout(resolve, 3000))
}

let lol = co.wrap(function* lol() {
  yield wait()
  $('body').append('AWESOME')
})

lol()

