
import { getGrade }       from 'bemuse/rules/grade'
import withPersonalRecord from './withPersonalRecord'
import MusicListItemChart from './MusicListItemChart'
import withPropsOnChange  from 'recompose/withPropsOnChange'
import pure               from 'recompose/pure'
import compose            from 'recompose/compose'

export default compose(
  withPersonalRecord,
  withPropsOnChange(['record'], (props) => {
    const record = props.record
    const played = !!record
    let grade = played ? getGrade(record) : null
    if (grade === 'F') grade = null
    return { played, grade }
  }),
  pure
)(MusicListItemChart)
