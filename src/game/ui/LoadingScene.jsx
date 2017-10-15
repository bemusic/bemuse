
import './LoadingScene.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Scene from 'bemuse/ui/Scene.jsx'

import LoadingSceneSongInfo from './LoadingSceneSongInfo.jsx'
import LoadingSceneProgress from './LoadingSceneProgress.jsx'

export default class LoadingScene extends React.Component {
  static propTypes = {
    song: PropTypes.object,
    tasks: PropTypes.object,
    eyecatchImagePromise: PropTypes.object,
    registerTeardownCallback: PropTypes.func,
  }

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
  }

  componentDidMount () {
    if (this.props.eyecatchImagePromise) {
      this.props.eyecatchImagePromise.then(image => {
        ReactDOM.findDOMNode(this.refs.eyecatch).appendChild(image)
      })
    }
    this.props.registerTeardownCallback(() => {
      ReactDOM.findDOMNode(this.refs.scene).classList.add('is-exiting')
      return Promise.delay(500)
    })
  }
}
