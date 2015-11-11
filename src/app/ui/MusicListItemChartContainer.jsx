
import React from 'react'

import id             from 'bemuse/online/id'
import online         from 'bemuse/online/instance'
import * as DataStore from 'bemuse/online/data-store'
import { getGrade }   from 'bemuse/rules/grade'
import { connect }    from 'bemuse/flux'

import MusicListItemChart from './MusicListItemChart'

export const MusicListItemChartContainer = React.createClass({

  componentDidMount () {
    online.seen(this.getDescriptor())
  },

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.chart !== nextProps.chart) return true
    if (this.props.selected !== nextProps.selected) return true
    if (this.props.playMode !== nextProps.playMode) return true
    if (this.getRecord(this.props.data) !== this.getRecord(nextProps.data)) return true
    return false
  },

  getRecord (data) {
    return DataStore.get(data, id(this.getDescriptor())).value
  },

  getDescriptor () {
    return { md5: this.props.chart.md5, playMode: this.props.playMode }
  },

  render () {
    let record = this.getRecord(this.props.data)
    let played = !!record
    let grade = played ? getGrade(record) : null
    if (grade === 'F') grade = null
    return <MusicListItemChart {...this.props} played={played} grade={grade} />
  }

})

export default connect({ data: online.records川 }, MusicListItemChartContainer)
