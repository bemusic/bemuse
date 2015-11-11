
import './MusicInfoTabStats.scss'

import React            from 'react'
import _                from 'lodash'
import { connect }      from 'bemuse/flux'
import * as DataStore   from 'bemuse/online/data-store'
import online           from 'bemuse/online/instance'
import id               from 'bemuse/online/id'
import MusicSelectStore from '../stores/music-select-store'

export function withPersonalRecord (Component) {
  const WrappedClass = React.createClass({
    componentDidMount () {
      online.seen(this.getLevel())
    },
    render () {
      return (
        <Component
          record={this.getRecord()}
          {..._.omit(this.props, 'onlineRecords')}
        />
      )
    },
    getRecord (data) {
      return DataStore.get(this.props.onlineRecords, id(this.getLevel())).value
    },
    getLevel () {
      return { md5: this.props.chart.md5, playMode: this.props.playMode }
    },
  })

  return connect(
    {
      onlineRecords: online.records川,
      playMode:      MusicSelectStore.map(state => state.playMode),
    },
    WrappedClass
  )
}

export default withPersonalRecord
