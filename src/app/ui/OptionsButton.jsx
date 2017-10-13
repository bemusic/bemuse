
import './OptionsButton.scss'
import React from 'react'

const OptionsButton = ({ children, onClick }) => (
  <button className="OptionsButton" onClick={onClick}>
    {children}
  </button>
)
