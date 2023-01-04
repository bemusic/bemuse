import React from 'react'

interface VBoxProps {
  padding?: string | number
  gap?: string | number
  children?: ReactNode
}

const VBox = ({ children, padding, gap }: VBoxProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding, gap }}>
    {children}
  </div>
)

export default VBox
