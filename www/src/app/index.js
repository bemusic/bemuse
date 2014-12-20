
import $ from 'jquery'
import '6to5/polyfill'

console.log(x => x + 1)

function wait() {
  return new Promise(resolve => setTimeout(resolve, 3000))
}

async function lol() {
  await wait()
  $('body').append('AWESOME')
}

lol()

