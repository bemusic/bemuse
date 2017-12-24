import './OptionsButton.scss'
import React from 'react'
import PropTypes from 'prop-types'

const OptionsButton = ({ children, onClick }) => (
  <button className='OptionsButton' onClick={onClick}>
    {children}
  </button>
)

OptionsButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
}

export default OptionsButton
