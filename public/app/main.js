
import _ from 'lodash'
import co from 'npm:co'

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}


co(function *() {
  console.log("1")
  yield sleep(1000)
  console.log("2")
  yield sleep(1000)
  console.log("3")
  yield sleep(1000)
  console.log("4")
})

