
import './loading-scene-progress.scss'

import React from 'react'
import LoadingSceneProgressBar from './loading-scene-progress-bar.jsx'

export default React.createClass({
  render() {
    return <div className="loading-scene-progress">
      {this.props.tasks.value.map(task => this.renderItem(task))}
    </div>
  },
  renderItem({ text, progressText, progress }) {
    let width = Math.round((progress * 100) || 0) + '%'
    let extra = progressText ? ` (${progressText})` : ''
    return <div className="loading-scene-progress--item">
      <LoadingSceneProgressBar width={width} />
      {text}
      <span className="loading-scene-progress--extra">{extra}</span>
    </div>
  },
  componentDidMount() {
    this._unsubscribe = this.props.tasks.watch(() => this.forceUpdate())
  },
  componentWillUnmount() {
    this._unsubscribe()
  },
})
