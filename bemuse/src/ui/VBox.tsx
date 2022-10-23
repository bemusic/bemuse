import React from 'react'

interface VBox {
  padding?: string | number
  gap?: string | number
}

const VBox: FC<VBox> = ({ children, padding, gap }) => (
  <div style={{ display: 'flex', flexDirection: 'column', padding, gap }}>
    {children}
  </div>
)

export default VBox
