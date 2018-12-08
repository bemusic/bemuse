import React from 'react'
import PropTypes from 'prop-types'

import * as MusicPreviewer from './'

MusicPreviewer.preload()

export default class MusicSelectPreviewer extends React.Component {
  static propTypes = {
    url: PropTypes.string,
  }
  componentDidMount() {
    MusicPreviewer.enable()
    MusicPreviewer.preview(this.props.url)
    addEventListener('message', this.handleMessage)
  }
  componentWillUnmount() {
    MusicPreviewer.disable()
    removeEventListener('message', this.handleMessage)
  }
  componentWillReceiveProps(nextProps) {
    MusicPreviewer.preview(nextProps.url)
  }
  render() {
    return null
  }
  handleMessage({ data }) {
    if (data.type === 'calibration-started') {
      MusicPreviewer.disable()
    } else if (data.type === 'calibration-closed') {
      MusicPreviewer.enable()
    }
  }
}
