
import './loading-scene.scss'

import React from 'react'
import Scene from 'bemuse/ui/scene.jsx'

import LoadingSceneSongInfo from './loading-scene-song-info.jsx'
import LoadingSceneProgress from './loading-scene-progress.jsx'

export default React.createClass({

  render() {
    return <Scene className="LoadingScene" ref="scene">
      <div className="LoadingSceneのinfo">
        <LoadingSceneSongInfo song={this.props.song} />
      </div>
      <LoadingSceneProgress tasks={this.props.tasks} />
      <div className="LoadingSceneのflash"></div>
      <div className="LoadingSceneのcover"></div>
    </Scene>
  },
  teardown() {
    React.findDOMNode(this.refs.scene).classList.add('is-exiting')
    return Promise.delay(500)
  },

})
