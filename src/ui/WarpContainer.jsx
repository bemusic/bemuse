
import './ModalPopup.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import WARP from 'bemuse/utils/warp-element'

export default class WarpContainer extends React.Component {
  static propTypes = {
    children: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount () {
    WARP.appendChild(this.el)
  }

  componentWillUnmount () {
    WARP.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}
