
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { compose, getContext, mapProps, withHandlers } from 'recompose'

export const connectIO = (handlers) => compose(
  getContext({
    runIO: PropTypes.func
  }),
  withHandlers(_.mapValues(handlers, (handler) => {
    return ({ runIO, ...props }) => (...args) => {
      return runIO(handler(props)(...args))
    }
  })),
  mapProps(({ runIO, ...props }) => props)
)

export default connectIO
