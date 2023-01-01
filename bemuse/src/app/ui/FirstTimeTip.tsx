import React, { ComponentProps } from 'react'
import { hasAcknowledged, optionsSlice } from '../entities/Options'
import { useDispatch, useSelector } from 'react-redux'

import TipContainer from 'bemuse/ui/TipContainer'
import { selectOptions } from '../redux/ReduxState'

export const FirstTimeTip = ({
  featureKey,
  ...props
}: { featureKey: string } & Omit<
  ComponentProps<typeof TipContainer>,
  'tipVisible'
>) => {
  const dispatch = useDispatch()
  const options = useSelector(selectOptions)

  const onClick = () => {
    dispatch(optionsSlice.actions.ACKNOWLEDGE({ featureKey }))
  }

  return (
    <span onClick={onClick}>
      <TipContainer
        tipVisible={!hasAcknowledged(featureKey)(options)}
        {...props}
      />
    </span>
  )
}

export default FirstTimeTip
