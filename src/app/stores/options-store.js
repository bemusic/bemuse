
import { Store }    from 'bemuse/flux'
import reduxState川 from '../redux/reduxState川'

const options川 = reduxState川.map(state => state.options)
const mode川 = options川.map(options => options['player.P1.mode'])

const scratch川 = options川.map(options => {
  if (options['player.P1.mode'] === 'KB') {
    return 'off'
  } else {
    return options['player.P1.scratch']
  }
})

export default new Store({
  options:   options川,
  mode:      mode川,
  scratch:   scratch川,
})
