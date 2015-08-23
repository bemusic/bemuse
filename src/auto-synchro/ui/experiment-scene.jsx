
import './experiment-scene.scss'
import React from 'react'
import c from 'classnames'
import { Binding } from 'bemuse/flux'
import Loading from 'bemuse/ui/loading'

export default React.createClass({
  render() {
    return <div className={c('experiment-scene', { 'is-finished': this.state.finished })}>
      <Binding store={this.props.store} onChange={this.handleState} />
      <div className="experiment-scene--wrapper">
        <div className="experiment-scene--wrapper-inner">
          {this.renderContents()}
        </div>
      </div>
    </div>
  },
  renderContents() {
    if (this.state.loading) {
      return this.renderLoading()
    } else if (!this.state.started) {
      return this.renderReady()
    } else if (!this.state.listening) {
      return this.renderMessage('Please listen to the beats…')
    } else {
      return this.renderCollection()
    }
  },
  renderLoading() {
    return <div className="experiment-scene--loading">
      <Loading />
    </div>
  },
  renderReady() {
    return <div className="experiment-scene--ready">
      <button className="experiment-scene--button"
          onClick={this.props.onStart}>Start Calibration</button>
    </div>
  },
  renderMessage(text) {
    return <div className="experiment-scene--message">
      {text}
    </div>
  },
  renderCollection() {
    let scale = (
      this.state.finished
      ? 1
      : easeOut(Math.min(1, this.state.numSamples / 84))
    )
    let transform = 'scaleX(' + scale + ')'
    let style = {
      transform: transform,
      WebkitTransform: transform,
    }
    return <div className="experiment-scene--collection">
      {this.renderMessage(
        this.state.finished
        ? 'Your latency is ' + this.state.latency + 'ms. Please close this window.'
        : 'Please press the space bar when you hear the kick drum.'
      )}
      <div className="experiment-scene--progress">
        <div className="experiment-scene--progress-bar" style={style}></div>
      </div>
    </div>
  },
  getInitialState() {
    return this.props.store.get()
  },
  handleState(state) {
    this.setState(state)
  },
})

function easeOut(x) {
  return 1 - Math.pow(1 - x, 2)
}
