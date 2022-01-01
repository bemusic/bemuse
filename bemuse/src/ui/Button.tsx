import './Button.scss'
import React, { forwardRef } from 'react'

const Button = forwardRef<
  HTMLButtonElement,
  {
    children?: React.ReactNode
    onClick?: React.DOMAttributes<HTMLButtonElement>['onClick']
  }
>(({ children, onClick }, ref) => (
  <button className='Button' onClick={onClick} ref={ref}>
    {children}
  </button>
))

export default Button
