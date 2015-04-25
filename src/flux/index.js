
import Bacon from 'baconjs'
import React from 'react'

export { Bacon }

let lock = false

export function Action(transform=x => x) {
  var bus = new Bacon.Bus()
  var action = function() {
    if (lock) {
      throw new Error('An action should not fire another action!')
    }
    try {
      lock = true
      bus.push(transform.apply(null, arguments))
    } finally {
      lock = false
    }
  }
  action.bus = bus
  action.debug = function(prefix) {
    bus.map(value => [prefix, value]).log()
    return action
  }
  return action
}

export function Store(store) {
  store = toProperty(store)
  store.get = () => {
    let data
    let unsubscribe = store.onValue(_data => data = _data)
    setTimeout(unsubscribe)
    return data
  }
  return store
}

function toProperty(store) {
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

export class Binding extends React.Component {
  render() {
    return null
  }
  componentDidMount() {
    this._unsubscribe = this.props.store.onValue(value =>
        this.props.onChange(value))
  }
  componentWillUnmount() {
    this._unsubscribe()
  }
}
