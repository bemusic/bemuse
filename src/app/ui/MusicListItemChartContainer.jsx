
import { getGrade }       from 'bemuse/rules/grade'
import withPersonalRecord from './withPersonalRecord'
import MusicListItemChart from './MusicListItemChart'
import mapPropsOnChange   from 'recompose/mapPropsOnChange'
import pure               from 'recompose/pure'
import compose            from 'recompose/compose'

export default compose(
  withPersonalRecord,
  mapPropsOnChange(['record'], (props) => {
    const record = props.record
    const played = !!record
    let grade = played ? getGrade(record) : null
    if (grade === 'F') grade = null
    return Object.assign({ }, props, { played, grade })
  }),
  pure
)(MusicListItemChart)
