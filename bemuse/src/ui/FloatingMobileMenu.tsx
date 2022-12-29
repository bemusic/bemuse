import type { ReactNode } from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

export interface FloatingMobileMenuProps {
  children?: ReactNode
  visible: boolean
}

const FloatingMobileMenu = styled('nav')<FloatingMobileMenuProps>(
  {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: '70px',
    paddingBottom: '20px',
    background: 'rgba(0, 0, 0, 0.75)',
    fontSize: '18px',
    zIndex: 101,

    '> a': {
      display: 'block',
      padding: '4px 20px 4px 32px',
      textDecoration: 'none',
      color: '#e9e8e7',
    },
  },
  ({ visible }) => ({
    display: visible ? 'block' : 'none',
    animation: `0.3s ${animation}`,
  })
)

export const FloatingMobileMenuSeparator = styled('hr')({
  height: 0,
  border: 0,
  borderTop: '1px solid rgba(255, 255, 255, 0.3)',
})

const animation = keyframes({
  from: {
    opacity: 0,
    transform: 'translate(0, -50%)',
  },
  to: {
    opacity: 1,
    transform: 'translate(0, 0)',
  },
})

export default FloatingMobileMenu
