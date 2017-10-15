
import Bacon        from 'baconjs'
import React        from 'react'

export { Bacon }

let lock = false

export function Action (transform = x => x) {
  var bus = new Bacon.Bus()
  var action = function () {
    if (lock) {
      throw new Error('An action should not fire another action! (' + lock.stack + ')')
    }
    try {
      let payload = transform.apply(null, arguments)
      lock = new Error('Previous lock:')
      bus.push(payload)
    } finally {
      lock = false
    }
  }
  action.bus = bus
  action.debug = function (prefix) {
    bus.map(value => [prefix, value]).log()
    return action
  }
  return action
}

export function Store (store, options = {}) {
  let lazy = !!options.lazy
  store = toProperty(store)
  store.get = () => {
    let data
    let unsubscribe = store.onValue(_data => (data = _data))
    setTimeout(unsubscribe)
    return data
  }
  if (!lazy) {
    store.onValue(() => {})
  }
  return store
}

function toProperty (store) {
  if (store instanceof Bacon.Property) {
    return store
  } else if (store instanceof Bacon.EventStream) {
    throw new Error('Please convert Bacon.EventStream to Bacon.Property first.')
  } else if (store && typeof store === 'object') {
    return Bacon.combineTemplate(store)
  } else {
    throw new Error('Expected a Bacon.Property or a template.')
  }
}

export const connect = (props川) => (Component) => {
  let propsProperty = toProperty(props川)
  return class extends React.Component {
    constructor (props) {
      super(props)
      this._unsubscribe = propsProperty.onValue(this.handleValue)
      let initialValue
      const initialUnsubscribe = propsProperty.onValue(value => (initialValue = value))
      initialUnsubscribe()
      this.state = { value: initialValue }
    }

    componentWillUnmount () {
      this._mounted = false
      if (this._unsubscribe) this._unsubscribe()
    }

    componentDidMount () {
      this._mounted = true
    }

    handleValue = (value) => {
      if (this._mounted) this.setState({ value })
    }

    render () {
      return <Component {...(this.state.value || { })} {...this.props} />
    }
  }
}
