import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'

import './FloatingMobileMenu.scss'

function FloatingMobileMenu ({ children, visible }) {
  return (
    <nav className={c('FloatingMobileMenu', !visible && 'is-hidden')}>
      {children}
    </nav>
  )
}
FloatingMobileMenu.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool
}

FloatingMobileMenu.Separator = (props) => {
  return (
    <hr className='FloatingMobileMenuのseparator' />
  )
}

export default FloatingMobileMenu
