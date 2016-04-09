
import './LoadingScene.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import Scene from 'bemuse/ui/Scene.jsx'

import LoadingSceneSongInfo from './LoadingSceneSongInfo.jsx'
import LoadingSceneProgress from './LoadingSceneProgress.jsx'

export default React.createClass({

  render () {
    return <Scene className="LoadingScene" ref="scene">
      <div className="LoadingSceneのimage" ref="eyecatch"></div>
      <div className="LoadingSceneのinfo">
        <LoadingSceneSongInfo song={this.props.song} />
      </div>
      <LoadingSceneProgress tasks={this.props.tasks} />
      <div className="LoadingSceneのflash"></div>
      <div className="LoadingSceneのcover"></div>
    </Scene>
  },

  componentDidMount () {
    if (this.props.eyecatchImagePromise) {
      this.props.eyecatchImagePromise.then(image => {
        ReactDOM.findDOMNode(this.refs.eyecatch).appendChild(image)
      })
    }
  },

  teardown () {
    ReactDOM.findDOMNode(this.refs.scene).classList.add('is-exiting')
    return Promise.delay(500)
  },

})
