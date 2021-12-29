import './Button.scss'
import React from 'react'

const Button: React.FC<{
  onClick?: React.DOMAttributes<HTMLButtonElement>['onClick']
}> = ({ children, onClick }) => (
  <button className='Button' onClick={onClick}>
    {children}
  </button>
)

export default Button
