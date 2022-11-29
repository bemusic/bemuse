/** @jsx jsx */

import { ComponentPropsWithRef } from 'react'
import { css, jsx } from '@emotion/react'

export interface FloatingMobileButtonProps {
  children?: ReactNode
  buttonProps: ComponentPropsWithRef<'button'>
}

const FloatingMobileButton = ({
  children,
  buttonProps,
}: FloatingMobileButtonProps) => (
  <button
    css={css`
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

export default FloatingMobileButton
