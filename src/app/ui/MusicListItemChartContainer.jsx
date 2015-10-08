
import React from 'react'

import id from 'bemuse/online/id'
import online from 'bemuse/online/instance'
import { getState } from 'bemuse/online/data-store'
import { getGrade } from 'bemuse/rules/grade'

import MusicListItemChart from './MusicListItemChart'

export default React.createClass({

  getInitialState() {
    return { data: { } }
  },

  componentDidMount() {
    online.seen(this.getDescriptor())
    this.unsubscribe = online.records川.onValue(data => this.setState({ data }))
  },

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.chart !== nextProps.chart) return true
    if (this.props.playMode !== nextProps.playMode) return true
    if (this.getRecord(this.state) !== this.getRecord(nextState)) return true
    return false
    return true
  },

  getRecord(state) {
    return getState(state.data, id(this.getDescriptor())).value
  },

  getDescriptor() {
    return { md5: this.props.chart.md5, playMode: this.props.playMode }
  },

  render() {
    let record = this.getRecord(this.state)
    let played = !!record
    let grade = played ? getGrade(record) : null
    if (grade === 'F') grade = null
    return <MusicListItemChart {...this.props} played={played} grade={grade} />
  }

})
