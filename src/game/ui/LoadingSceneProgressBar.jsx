import './LoadingSceneProgressBar.scss'
import React from 'react'
import PropTypes from 'prop-types'

export default class LoadingSceneProgressBar extends React.Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }

  render () {
    return (
      <div className='LoadingSceneProgressBar'>
        <div
          className='LoadingSceneProgressBarのbar'
          style={{ width: this.props.width }}
        />
      </div>
    )
  }
}
