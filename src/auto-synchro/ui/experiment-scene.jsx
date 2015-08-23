
import './experiment-scene.scss'
import React from 'react'
import { Binding } from 'bemuse/flux'

export default React.createClass({
  render() {
    return <div className="experiment-scene">
      <Binding store={this.props.store} onChange={this.handleState} />
      <h1>
        An Experiment on Audio+Input Latency Calibration
        for Rhythm Action Games
      </h1>
      <h2>1. Click the button</h2>
      {
        this.state.showStart
        ? <button onClick={this.props.onStart}>Start the Music</button>
        : null
      }
      {
        this.state.showLoading
        ? <button disabled>Loading Music (~700kb)</button>
        : null
      }
      {
        this.state.showStarted
        ? <button disabled>Playing Music</button>
        : null
      }
      <h2>2. Listen to the beats...</h2>
      {
        !this.state.showCollection && this.state.showStarted
        ? <h2>3. (please wait)</h2>
        : null
      }
      {
        this.state.showCollection
        ? <div>
            <h2>
              3. Press space bar (mobile phone: tap the screen)
              when you hear the "kick drum"
            </h2>
            {
              this.state.showCollect
              ? <div>
                  <p>{this.state.numSamples} samples recorded.</p>
                  <p>We need 56 to 84 samples.</p>
                </div>
              : null
            }
          </div>
        : null
      }
      {
        this.state.showThank
        ? <div>
            <h2>4. Finished! Thank you!</h2>
            <p><b>Your audio+input latency is {this.state.latency} ms</b></p>
            <p>Thank you! This song will loop forever.</p>
          </div>
        : null
      }
    </div>
  },
  getInitialState() {
    return this.props.store.get()
  },
  handleState(state) {
    this.setState(state)
  },
})
