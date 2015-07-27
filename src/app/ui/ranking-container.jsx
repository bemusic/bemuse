
import React    from 'react'
import Ranking  from './ranking'
import online   from 'bemuse/online/instance'

export default React.createClass({

  getInitialState() {
    return {
      data: null,
      meta: {
        scoreboard: { status: 'loading' },
        submission: { status: 'loading' },
      }
    }
  },

  getParams(props) {
    let params = { }
    Object.assign(params, {
      md5:      props.chart.md5,
      playMode: props.playMode,
    })
    let result = props.result
    if (result) {
      Object.assign(params, {
        score:    result.score,
        combo:    result.maxCombo,
        total:    result.totalCombo,
        count:    [result['1'], result['2'], result['3'], result['4'], result.missed],
        log:      result.log,
      })
    }
    return params
  },

  componentDidMount() {
    this.model        = online.Ranking(this.getParams(this.props))
    this.unsubscribe  = this.model.state川.onValue(this.onStoreTrigger)
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.chart.md5 !== nextProps.chart.md5 || this.props.playMode !== nextProps.playMode) {
      this.unsubscribe()
      this.model        = online.Ranking(this.getParams(nextProps))
      this.unsubscribe  = this.model.state川.onValue(this.onStoreTrigger)
    }
  },

  onStoreTrigger(state) {
    this.setState(state)
  },

  onReloadScoreboardRequest() {
    this.model.reloadScoreboard()
  },

  onResubmitScoreRequest() {
    this.model.resubmit()
  },

  render() {
    return <Ranking
        state={this.state}
        onReloadScoreboardRequest={this.onReloadScoreboardRequest}
        onResubmitScoreRequest={this.onResubmitScoreRequest}
        />
    // void RankingTable
    // return <div style={{ textAlign: 'center', padding: '10px' }}>
    //   Ranking is coming soon...
    // </div>
  },
})
