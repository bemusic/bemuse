import MusicListItemChart from './MusicListItemChart'
import compose from 'recompose/compose'
import { getGrade } from 'bemuse/rules/grade'
import pure from 'recompose/pure'
import withPropsOnChange from 'recompose/withPropsOnChange'

export default compose(
  withPropsOnChange(['record'], (props) => {
    const record = props.record
    const played = !!record
    let grade = played ? getGrade(record) : null
    if (grade === 'F') grade = null
    return { played, grade }
  }),
  pure
)(MusicListItemChart)
