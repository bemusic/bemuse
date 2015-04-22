
import Bacon from 'baconjs'
import React from 'react'

export function Action(transform=x => x) {
  var bus = new Bacon.Bus()
  var action = function() {
    bus.push(transform.apply(null, arguments))
  }
  action.bus = bus
  return action
}

export function Store(template) {
  let store = Bacon.combineTemplate(template)
  store.get = () => {
    let data
    store.onValue(_data => data = _data)()
    return data
  }
  return store
}

export class Binding extends React.Component {
  render() {
    return null
  }
  componentDidMount() {
    this._unsubscribe = this.props.store.onValue(value =>
        this.props.onChange(value))
  }
  componentDidUnmount() {
    this._unsubscribe()
  }
}
