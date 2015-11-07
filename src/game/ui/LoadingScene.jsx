
import './LoadingScene.scss'

import React from 'react'
import Scene from 'bemuse/ui/Scene.jsx'

import LoadingSceneSongInfo from './LoadingSceneSongInfo.jsx'
import LoadingSceneProgress from './LoadingSceneProgress.jsx'

export default React.createClass({

  render () {
    return <Scene className="LoadingScene" ref="scene">
      <div className="LoadingSceneのinfo">
        <LoadingSceneSongInfo song={this.props.song} />
      </div>
      <LoadingSceneProgress tasks={this.props.tasks} />
      <div className="LoadingSceneのflash"></div>
      <div className="LoadingSceneのcover"></div>
    </Scene>
  },
  teardown () {
    React.findDOMNode(this.refs.scene).classList.add('is-exiting')
    return Promise.delay(500)
  },

})
