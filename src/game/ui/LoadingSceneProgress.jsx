import './LoadingSceneProgress.scss'

import React from 'react'
import PropTypes from 'prop-types'
import LoadingSceneProgressBar from './LoadingSceneProgressBar.jsx'

export default class LoadingSceneProgress extends React.Component {
  static propTypes = {
    tasks: PropTypes.object
  }

  render () {
    return (
      <div className='LoadingSceneProgress'>
        {this.props.tasks.value.map(task => this.renderItem(task))}
      </div>
    )
  }

  renderItem = ({ text, progressText, progress }) => {
    let width = Math.round(progress * 100 || 0) + '%'
    let extra = progressText ? ` (${progressText})` : ''
    return (
      <div key={text} className='LoadingSceneProgressのitem'>
        <LoadingSceneProgressBar width={width} />
        {text}
        <span className='LoadingSceneProgressのextra'>{extra}</span>
      </div>
    )
  }

  componentDidMount () {
    this._unsubscribe = this.props.tasks.watch(() => this.forceUpdate())
  }

  componentWillUnmount () {
    this._unsubscribe()
  }
}
