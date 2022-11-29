import './ModalPopup.scss'

import c from 'classnames'
import React, { MouseEvent } from 'react'

import WarpContainer from './WarpContainer'

export interface ModalPopupProps {
  visible?: boolean
  onBackdropClick?: (e: MouseEvent<HTMLDivElement>) => void
  children?: ReactNode
}

const ModalPopup = ({
  visible,
  onBackdropClick,
  children,
}: ModalPopupProps) => {
  if (visible === false) return null
  return (
    <WarpContainer>
      <div
        className={c('ModalPopup', {
          'is-visible': visible,
        })}
        onClick={onBackdropClick}
      >
        <div className='ModalPopupのscroller'>
          <div className='ModalPopupのcontentsContainer'>
            <div
              className='ModalPopupのcontents'
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </WarpContainer>
  )
}

export default ModalPopup
