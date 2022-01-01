import React from 'react'

const VBox: React.FC<{
  padding?: string | number
  gap?: string | number
}> = ({ children, padding, gap }) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding, gap }}>
    {children}
  </div>
)

export default VBox
