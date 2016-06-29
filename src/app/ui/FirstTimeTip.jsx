import React from 'react'
import TipContainer from 'bemuse/ui/TipContainer'
import { connect } from 'react-redux'
import connectIO from '../../impure-react/connectIO'
import { compose } from 'recompose'
import * as OptionsIO from '../io/OptionsIO'

export const FirstTimeTip = compose(
  connectIO({
    onClick: ({ featureKey }) => () => (
      OptionsIO.setOptions({ [`system.ack.${featureKey}`]: '1' })
    )
  }),
  connect((state, { featureKey }) => ({
    tipVisible: state.options[`system.ack.${featureKey}`] !== '1'
  }))
)(({ onClick, ...props }) => (
  <span onClick={onClick}><TipContainer {...props} /></span>
))

export default FirstTimeTip
