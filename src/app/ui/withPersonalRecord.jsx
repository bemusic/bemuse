import './MusicInfoTabStats.scss'

import React from 'react'
import _ from 'lodash'
import * as ReduxState from '../redux/ReduxState'
import * as DataStore from 'bemuse/online/data-store'
import online from 'bemuse/online/instance'
import { isWaiting } from 'bemuse/online/operations'
import id from 'bemuse/online/id'

import { connect } from 'react-redux'
import { connect as legacyConnect } from 'bemuse/flux'
import { compose } from 'recompose'

export function withPersonalRecord (Component) {
  const enhance = compose(
    legacyConnect({
      user: online.user川,
      onlineRecords: online.records川
    }),
    connect(state => ({
      playMode: ReduxState.selectPlayMode(state)
    }))
  )

  class WrappedClass extends React.Component {
    componentDidMount () {
      online.seen(this.getLevel())
    }
    componentDidUpdate () {
      online.seen(this.getLevel())
    }
    render () {
      const recordState = this.getRecordState()
      return (
        <Component
          record={recordState.value}
          loading={isWaiting(recordState)}
          {..._.omit(this.props, 'onlineRecords')}
        />
      )
    }
    getRecordState (data) {
      return DataStore.get(this.props.onlineRecords, id(this.getLevel()))
    }
    getLevel () {
      return { md5: this.props.chart.md5, playMode: this.props.playMode }
    }
  }

  return enhance(WrappedClass)
}

export default withPersonalRecord
