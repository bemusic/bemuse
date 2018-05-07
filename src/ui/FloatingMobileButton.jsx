import React from 'react'
import PropTypes from 'prop-types'

function FloatingMobileButton ({ children, buttonProps }) {
  return (
    <button
      css={`
        position: fixed;
        z-index: 102;
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border: 0;
        padding: 0;
        margin: 0;
        display: block;
        color: #e9e8e7;
        font: inherit;
        font-size: 24px;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      `}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
FloatingMobileButton.propTypes = {
  children: PropTypes.node,
  buttonProps: PropTypes.object
}

export default FloatingMobileButton
