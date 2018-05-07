import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'react-emotion'

function FloatingMobileMenu ({ children, visible }) {
  return (
    <nav
      css={`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding-top: 70px;
        padding-bottom: 20px;
        background: rgba(0, 0, 0, 0.75);
        font-size: 18px;
        z-index: 101;
        display: ${visible ? 'block' : 'none'};
        ${!!visible && `animation: 0.3s ${animation}`};

        > a {
          display: block;
          padding: 4px 20px 4px 32px;
          text-decoration: none;
          color: #e9e8e7;
        }
      `}
    >
      {children}
    </nav>
  )
}
FloatingMobileMenu.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool
}

FloatingMobileMenu.Separator = styled.hr`
  height: 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`

const animation = keyframes`
  from {
    opacity: 0;
    transform: translate(0, -50%);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
`

export default FloatingMobileMenu
