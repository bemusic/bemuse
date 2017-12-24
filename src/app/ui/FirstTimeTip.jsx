import * as Options from '../entities/Options'
import * as OptionsIO from '../io/OptionsIO'

import React from 'react'
import TipContainer from 'bemuse/ui/TipContainer'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import connectIO from '../../impure-react/connectIO'

export const FirstTimeTip = compose(
  connectIO({
    onClick: ({ featureKey }) => () =>
      OptionsIO.updateOptions(Options.acknowledge(featureKey))
  }),
  connect((state, { featureKey }) => ({
    tipVisible: !Options.hasAcknowledged(featureKey)(state.options)
  }))
)(({ onClick, ...props }) => (
  <span onClick={onClick}>
    <TipContainer {...props} />
  </span>
))

export default FirstTimeTip
