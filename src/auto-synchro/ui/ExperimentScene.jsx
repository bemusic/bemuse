
import './ExperimentScene.scss'
import React from 'react'
import c from 'classnames'
import Loading from 'bemuse/ui/Loading'

export default React.createClass({
  render () {
    return <div className={c('ExperimentScene', { 'is-finished': this.props.finished })}>
      <div className="ExperimentSceneのwrapper">
        <div className="ExperimentSceneのwrapperInner">
          {this.renderContents()}
        </div>
      </div>
    </div>
  },
  renderContents () {
    if (this.props.loading) {
      return this.renderLoading()
    } else if (!this.props.started) {
      return this.renderReady()
    } else if (!this.props.listening) {
      return this.renderMessage('Please listen to the beats…')
    } else {
      return this.renderCollection()
    }
  },
  renderLoading () {
    return <div className="ExperimentSceneのloading">
      <Loading />
    </div>
  },
  renderReady () {
    return <div className="ExperimentSceneのready">
      <button className="ExperimentSceneのbutton"
        onClick={this.props.onStart}>Start Calibration</button>
    </div>
  },
  renderMessage (text) {
    return <div className="ExperimentSceneのmessage">
      {text}
    </div>
  },
  renderCollection () {
    let scale = (
      this.props.finished
      ? 1
      : easeOut(Math.min(1, this.props.numSamples / 84))
    )
    let transform = 'scaleX(' + scale + ')'
    let style = {
      transform: transform,
      WebkitTransform: transform,
    }
    return <div className="ExperimentSceneのcollection">
      {this.renderMessage(
        this.props.finished
        ? 'Your latency is ' + this.props.latency + 'ms. Please close this window.'
        : 'Please press the space bar when you hear the kick drum.'
      )}
      <div className="ExperimentSceneのprogress">
        <div className="ExperimentSceneのprogressBar" style={style}></div>
      </div>
    </div>
  },
})

function easeOut (x) {
  return 1 - Math.pow(1 - x, 2)
}
