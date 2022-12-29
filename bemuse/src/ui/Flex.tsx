import React, { CSSProperties } from 'react'

export interface FlexProps {
  grow?: number | string
}

const Flex = ({ grow }: FlexProps) => {
  const style: CSSProperties = {}
  if (grow !== undefined) style.flex = grow
  return <div style={style} />
}

export default Flex
