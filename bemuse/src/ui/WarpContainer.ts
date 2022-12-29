import './ModalPopup.scss'

import { useEffect, useState } from 'react'

import ReactDOM from 'react-dom'
import WARP from 'bemuse/utils/warp-element'

const WarpContainer = ({ children }: { children: ReactNode }) => {
  const [el] = useState(() => document.createElement('div'))

  useEffect(() => {
    WARP.appendChild(el)
    return () => {
      WARP.removeChild(el)
    }
  }, [])

  return ReactDOM.createPortal(children, el)
}
export default WarpContainer
