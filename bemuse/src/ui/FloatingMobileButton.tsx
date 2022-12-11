import { ComponentPropsWithRef } from 'react'
import styled from '@emotion/styled'

export interface FloatingMobileButtonProps {
  children?: ReactNode
  buttonProps: ComponentPropsWithRef<'button'>
}

const FloatingMobileButton = styled('button')<FloatingMobileButtonProps>({
  position: 'fixed',
  zIndex: 102,
  top: '20px',
  left: '20px',
  width: '40px',
  height: '40px',
  border: 0,
  padding: 0,
  margin: 0,
  color: '#e9e8e7',
  font: 'inherit',
  fontSize: '24px',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
})

export default FloatingMobileButton
