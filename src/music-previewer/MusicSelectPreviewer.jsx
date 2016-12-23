import React from 'react'

import * as MusicPreviewer from './'

MusicPreviewer.preload()

export default class MusicSelectPreviewer extends React.Component {
  static propTypes = {
    url: React.PropTypes.string
  }
  componentDidMount () {
    MusicPreviewer.enable()
    MusicPreviewer.preview(this.props.url)
  }
  componentWillUnmount () {
    MusicPreviewer.disable()
  }
  componentWillReceiveProps (nextProps) {
    MusicPreviewer.preview(nextProps.url)
  }
  render () {
    return null
  }
}
