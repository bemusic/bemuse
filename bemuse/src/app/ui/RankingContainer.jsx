import PropTypes from 'prop-types'
import React from 'react'
import online from 'bemuse/online/instance'

import Ranking from './Ranking'

export default class RankingContainer extends React.Component {
  static propTypes = {
    chart: PropTypes.object,
    playMode: PropTypes.any,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      meta: {
        scoreboard: { status: 'loading' },
        submission: { status: 'loading' },
      },
    }
  }

  getParams(props) {
    const params = {}
    Object.assign(params, {
      md5: props.chart.md5,
      playMode: props.playMode,
    })
    const result = props.result
    if (result) {
      Object.assign(params, {
        score: result.score,
        combo: result.maxCombo,
        total: result.totalCombo,
        count: [
          result['1'],
          result['2'],
          result['3'],
          result['4'],
          result.missed,
        ],
        log: result.log,
      })
    }
    return params
  }

  componentDidMount() {
    this.model = online.Ranking(this.getParams(this.props))
    this.unsubscribe = this.model.state川.subscribe(this.onStoreTrigger)
    this.mounted = true
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.chart.md5 !== nextProps.chart.md5 ||
      this.props.playMode !== nextProps.playMode
    ) {
      if (this.unsubscribe) this.unsubscribe.unsubscribe()
      this.model = online.Ranking(this.getParams(nextProps))
      this.unsubscribe = this.model.state川.subscribe(this.onStoreTrigger)
    }
  }

  componentWillUnmount() {
    this.mounted = false
    if (this.unsubscribe) this.unsubscribe.unsubscribe()
  }

  onStoreTrigger = (state) => {
    if (this.mounted) this.setState(state)
  }

  onReloadScoreboardRequest() {
    this.model.reloadScoreboard()
  }

  onResubmitScoreRequest() {
    this.model.resubmit()
  }

  render() {
    return (
      <Ranking
        state={this.state}
        onReloadScoreboardRequest={this.onReloadScoreboardRequest}
        onResubmitScoreRequest={this.onResubmitScoreRequest}
      />
    )
  }
}
