import React from 'react'
import PropTypes from 'prop-types'

import './FloatingMobileButton.scss'

function FloatingMobileButton ({ children, buttonProps }) {
  return (
    <button className='FloatingMobileButton' {...buttonProps}>
      {children}
    </button>
  )
}
FloatingMobileButton.propTypes = {
  children: PropTypes.node,
  buttonProps: PropTypes.object
}

export default FloatingMobileButton
