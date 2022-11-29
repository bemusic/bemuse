/** @jsx jsx */

import styled from '@emotion/styled'
import { css, jsx, keyframes } from '@emotion/react'

export interface FloatingMobileMenuProps {
  children?: ReactNode
  visible: boolean
}

const FloatingMobileMenu = ({ children, visible }: FloatingMobileMenuProps) => (
  <nav
    css={css`
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
