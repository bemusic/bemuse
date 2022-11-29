import './Ranking.scss'

import AuthenticationPopup from 'bemuse/online/ui/AuthenticationPopup'
import React, { useState } from 'react'
import { RankingState } from 'bemuse/online'
import { isWaiting } from 'bemuse/online/operations'

import RankingTable, { Message, Row } from './RankingTable'

const Error = ({
  text,
  error,
  retry,
}: {
  text: string
  error?: Error
  retry?: () => void
}) => (
  <span className='Rankingのerror'>
    <strong>
      {text}{' '}
      <a onClick={retry} className='RankingのerrorRetry'>
        (click to retry)
      </a>
    </strong>
    <br />
    <span className='RankingのerrorDescription'>
      {error && error.message ? '' + error.message : '(unknown error)'}
    </span>
  </span>
)

const Leaderboard = ({
  state,
  onReloadScoreboardRequest,
}: {
  state: RankingState
  onReloadScoreboardRequest?: () => void
}) => (
  <div className='Rankingのleaderboard'>
    <div className='Rankingのtitle'>Leaderboard</div>
    <RankingTable>
      {state.data ? (
        state.data.map((record, index) => <Row key={index} record={record} />)
      ) : isWaiting(state.meta.scoreboard) ? (
        <Message>Loading...</Message>
      ) : state.meta.scoreboard.status === 'error' ? (
        <Message>
          <Error
            text='Sorry, we are unable to fetch the scoreboard.'
            error={state.meta.scoreboard.error}
            retry={onReloadScoreboardRequest}
          />
        </Message>
      ) : (
        <Message>No Data</Message>
      )}
    </RankingTable>
  </div>
)

const Yours = ({
  state,
  onResubmitScoreRequest,
  showPopup,
}: {
  state: RankingState
  onResubmitScoreRequest?: () => void
  showPopup: () => void
}) => {
  const submission = state.meta.submission
  return (
    <div className='Rankingのyours'>
      <div className='Rankingのtitle'>Your Ranking</div>
      <RankingTable>
        {submission.status === 'completed' && submission.value ? (
          <Row record={submission.value} />
        ) : submission.status === 'unauthenticated' ? (
          <Message>
            Please <a onClick={showPopup}>log in or create an account</a> to
            submit scores.
          </Message>
        ) : submission.status === 'error' ? (
          <Message>
            <Error
              text='Unable to submit score'
              error={submission.error}
              retry={onResubmitScoreRequest}
            />
          </Message>
        ) : isWaiting(submission) ? (
          <Message>Please wait...</Message>
        ) : (
          <Message>No record. Let’s play!</Message>
        )}
      </RankingTable>
    </div>
  )
}

export interface RankingProps {
  state: RankingState
  onReloadScoreboardRequest?: () => void
  onResubmitScoreRequest?: () => void
}

const Ranking = ({
  state,
  onReloadScoreboardRequest,
  onResubmitScoreRequest,
}: RankingProps) => {
  const [authenticationPopupVisible, setAuthenticationPopupVisible] =
    useState(false)

  const hidePopup = () => setAuthenticationPopupVisible(false)

  return (
    <div className='Ranking'>
      <AuthenticationPopup
        visible={authenticationPopupVisible}
        onFinish={hidePopup}
        onBackdropClick={hidePopup}
      />
      <Yours
        state={state}
        onResubmitScoreRequest={onResubmitScoreRequest}
        showPopup={() => setAuthenticationPopupVisible(true)}
      />
      <Leaderboard
        state={state}
        onReloadScoreboardRequest={onReloadScoreboardRequest}
      />
    </div>
  )
}

export default Ranking
