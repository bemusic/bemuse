
import './ranking.scss'
import React from 'react'
import RankingTable from './ranking-table'
import AuthenticationPopup from 'bemuse/online/ui/authentication-popup'

export default React.createClass({
  getInitialState() {
    return {
      authenticationPopupVisible: false,
    }
  },
  handleAuthenticate() {
    this.setState({ authenticationPopupVisible: true })
  },
  handleAuthenticationClose() {
    this.setState({ authenticationPopupVisible: false })
  },
  handleAuthenticationFinish() {
    this.setState({ authenticationPopupVisible: false })
  },
  render() {
    return <div className="ranking">
      <AuthenticationPopup
          visible={this.state.authenticationPopupVisible}
          onFinish={this.handleAuthenticationFinish}
          onBackdropClick={this.handleAuthenticationClose} />
      {this.renderYours()}
      {this.renderLeaderboard()}
    </div>
  },
  renderYours() {
    const state = this.props.state
    const submission = state.meta.submission
    return <div className="ranking--yours">
      <div className="ranking--title">
        Your Ranking
      </div>
      <RankingTable>
        {
          submission.record
          ? <RankingTable.Row
                record={submission.record}
                rank={submission.rank}
            />
          : (
            submission.status === 'unauthenticated'
            ? <RankingTable.Message>
                Please <a href="javascript://online/auth" onClick={this.handleAuthenticate}>log in or create an account</a> to submit scores.
              </RankingTable.Message>
            : (
              submission.status === 'error'
              ? <RankingTable.Message>
                  {this.renderError(
                    'Unable to submit score',
                    submission.error,
                    this.props.onResubmitScoreRequest
                  )}
                </RankingTable.Message>
              : (
                submission.status === 'loading'
                ? <RankingTable.Message>
                    Please wait...
                  </RankingTable.Message>
                : <RankingTable.Message>
                    No record. Let’s play!
                  </RankingTable.Message>
              )
            )
          )
        }
      </RankingTable>
    </div>
  },
  renderLeaderboard() {
    const state = this.props.state
    return <div className="ranking--leaderboard">
      <div className="ranking--title">
        Leaderboard
      </div>
      <RankingTable>
        {
          state.data && state.data.length
          ? state.data.map((record, index) =>
              <RankingTable.Row
                  key={index}
                  record={record}
                  rank={index + 1}
              />
            )
          : (
            state.meta.scoreboard.status === 'loading'
            ? <RankingTable.Message>Loading...</RankingTable.Message>
            : (
              state.meta.scoreboard.status === 'error'
              ? <RankingTable.Message>
                  {this.renderError(
                    'Sorry, we are unable to fetch the scoreboard.',
                    state.meta.scoreboard.error,
                    this.props.onReloadScoreboardRequest
                  )}
                </RankingTable.Message>
              : <RankingTable.Message>
                  No Data
                </RankingTable.Message>
            )
          )
        }
      </RankingTable>
    </div>
  },
  renderError(text, error, retry) {
    return <span className="ranking--error">
      <strong>
        {text}
        {' '}
        <a onClick={retry} className="ranking--error-retry" href="javascript://retry">
          (click to retry)
        </a>
      </strong>
      <br />
      <span className="ranking--error-description">
        {
          error && error.message
          ? '' + error.message
          : '(unknown error)'
        }
      </span>
    </span>
  }
})
