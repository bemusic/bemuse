import './Ranking.scss'

import RankingTable, { Message, Row } from './RankingTable'
import React, { useState } from 'react'

import AuthenticationPopup from 'bemuse/online/ui/AuthenticationPopup'
import { RankingState } from 'bemuse/online'
import { isWaiting } from 'bemuse/online/operations'

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
}) => {
  let tableBody: ReactNode
  if (state.data?.length) {
    tableBody = state.data.map((record, index) => (
      <Row key={index} record={record} />
    ))
  } else if (isWaiting(state.meta.scoreboard)) {
    tableBody = <Message>Loading...</Message>
  } else if (state.meta.scoreboard.status === 'error') {
    tableBody = (
      <Message>
        <Error
          text='Sorry, we are unable to fetch the scoreboard.'
          error={state.meta.scoreboard.error}
          retry={onReloadScoreboardRequest}
        />
      </Message>
    )
  } else {
    tableBody = <Message>No Data</Message>
  }
  return (
    <div className='Rankingのleaderboard'>
      <div className='Rankingのtitle'>Leaderboard</div>
      <RankingTable>{tableBody}</RankingTable>
    </div>
  )
}

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
  let tableBody: ReactNode
  if (submission.status === 'completed' && submission.value) {
    tableBody = <Row record={submission.value} />
  } else if (submission.status === 'unauthenticated') {
    tableBody = (
      <Message>
        Please <a onClick={showPopup}>log in or create an account</a> to submit
        scores.
      </Message>
    )
  } else if (submission.status === 'error') {
    tableBody = (
      <Message>
        <Error
          text='Unable to submit score'
          error={submission.error}
          retry={onResubmitScoreRequest}
        />
      </Message>
    )
  } else if (isWaiting(submission)) {
    tableBody = <Message>Please wait...</Message>
  } else {
    tableBody = <Message>No record. Let’s play!</Message>
  }
  return (
    <div className='Rankingのyours'>
      <div className='Rankingのtitle'>Your Ranking</div>
      <RankingTable>{tableBody}</RankingTable>
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
