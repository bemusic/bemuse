import './ModalPopup.scss'

import { useEffect, useRef } from 'react'

import ReactDOM from 'react-dom'
import WARP from 'bemuse/utils/warp-element'

const WarpContainer = ({ children }: { children: ReactNode }) => {
  const el = useRef(document.createElement('div'))

  useEffect(() => {
    WARP.appendChild(el.current)
    return () => {
      WARP.removeChild(el.current)
    }
  }, [])

  return ReactDOM.createPortal(children, el.current)
}
export default WarpContainer
