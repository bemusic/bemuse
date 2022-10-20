import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import React, { FC } from 'react'

const icons = {
  play: faPlay,
  gear: faGear,
  spinner: faSpinner,
  bars: faBars,
}

export interface Icon {
  name: keyof typeof icons
  spin?: boolean
}

export const Icon: FC<Icon> = (props) => {
  return <FontAwesomeIcon icon={icons[props.name]} spin={props.spin} />
}
