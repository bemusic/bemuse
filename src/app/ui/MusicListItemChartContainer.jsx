
import React from 'react'

import { getGrade }       from 'bemuse/rules/grade'
import withPersonalRecord from './withPersonalRecord'
import MusicListItemChart from './MusicListItemChart'

export const MusicListItemChartContainer = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render () {
    let record = this.props.record
    let played = !!record
    let grade = played ? getGrade(record) : null
    if (grade === 'F') grade = null
    return <MusicListItemChart {...this.props} played={played} grade={grade} />
  }

})

export default withPersonalRecord(MusicListItemChartContainer)
