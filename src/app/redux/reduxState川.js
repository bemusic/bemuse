
import store from './instance'
import Bacon from 'baconjs'

export default Bacon.fromBinder((sink) => {
  store.subscribe(() => sink({ }))
})
.toProperty({ })
.map(() => store.getState())
