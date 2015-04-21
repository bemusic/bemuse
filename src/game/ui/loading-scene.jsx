
import './loading-scene.scss'

import React from 'react'
import Scene from 'bemuse/ui/scene.jsx'

import LoadingSceneSongInfo from './loading-scene-song-info.jsx'
import LoadingSceneProgress from './loading-scene-progress.jsx'

export default React.createClass({

  render() {
    return <Scene className="loading-scene" ref="scene">
      <div className="loading-scene--info">
        <LoadingSceneSongInfo song={this.props.song} />
      </div>
      <LoadingSceneProgress tasks={this.props.tasks} />
      <div className="loading-scene--flash"></div>
      <div className="loading-scene--cover"></div>
    </Scene>
  },
  teardown() {
    React.findDOMNode(this.refs.scene).classList.add('is-exiting')
    return Promise.delay(500)
  },

})
