
import './MusicInfoTabStats.scss'

import React            from 'react'
import _                from 'lodash'
import { connect }      from 'bemuse/flux'
import * as DataStore   from 'bemuse/online/data-store'
import online           from 'bemuse/online/instance'
import { isWaiting }    from 'bemuse/online/operations'
import id               from 'bemuse/online/id'
import MusicSelectStore from '../stores/music-select-store'

export function withPersonalRecord (Component) {
  const WrappedClass = React.createClass({
    componentDidMount () {
      online.seen(this.getLevel())
    },
    componentDidUpdate () {
      online.seen(this.getLevel())
    },
    render () {
      const recordState = this.getRecordState()
      return (
        <Component
          record={recordState.value}
          loading={isWaiting(recordState)}
          {..._.omit(this.props, 'onlineRecords')}
        />
      )
    },
    getRecordState (data) {
      return DataStore.get(this.props.onlineRecords, id(this.getLevel()))
    },
    getLevel () {
      return { md5: this.props.chart.md5, playMode: this.props.playMode }
    },
  })

  return connect(
    {
      user:          online.user川,
      onlineRecords: online.records川,
      playMode:      MusicSelectStore.map(state => state.playMode),
    },
    WrappedClass
  )
}

export default withPersonalRecord
