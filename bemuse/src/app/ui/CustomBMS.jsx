import './CustomBMS.scss'

import Panel from 'bemuse/ui/Panel'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import { compose } from 'recompose'

import * as Analytics from '../analytics'
import * as CustomSongsIO from '../io/CustomSongsIO'
import connectIO from '../../impure-react/connectIO'
import {
  hasPendingArchiveToLoad,
  consumePendingArchiveURL,
} from '../PreloadedCustomBMS'
import { useCustomSongLoaderLog } from '../CustomSongs'

const enhance = compose(
  (BaseComponent) =>
    function LogProvider(props) {
      const log = useCustomSongLoaderLog()
      return <BaseComponent {...props} log={log} />
    },
  connectIO({
    onFileDrop: () => (event) =>
      CustomSongsIO.handleCustomSongFolderDrop(event),
    onPaste: () => (e) => CustomSongsIO.handleClipboardPaste(e),
    loadFromURL: () => (url) => CustomSongsIO.handleCustomSongURLLoad(url),
  })
)

class CustomBMS extends React.Component {
  static propTypes = {
    log: PropTypes.arrayOf(PropTypes.string),
    onFileDrop: PropTypes.func,
    onPaste: PropTypes.func,
    onSongLoaded: PropTypes.func,
    loadFromURL: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  componentDidMount() {
    window.addEventListener('paste', this.handlePaste)
    if (hasPendingArchiveToLoad()) {
      this.props.loadFromURL(consumePendingArchiveURL()).then((song) => {
        if (this.props.onSongLoaded) this.props.onSongLoaded(song)
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('paste', this.handlePaste)
  }

  render() {
    return (
      <Panel className='CustomBMS' title='Load Custom BMS'>
        <div className='CustomBMSのwrapper'>
          <div className='CustomBMSのinstruction'>
            Please drag and drop a BMS folder into the drop zone below.
          </div>
          <div className='CustomBMSのremark'>
            This feature is only supported in Google Chrome and Firefox.
          </div>
          <div className='CustomBMSのremark'>
            Please don’t play unauthorized / illegally obtained BMS files.
          </div>
          <div className='CustomBMSのremark'>
            Experimental: You can paste IPFS path/URL here.
          </div>
          <div
            className={c('CustomBMSのdropzone', {
              'is-hover': this.state.hover,
            })}
            onDragOver={this.handleDragOver}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
          >
            {this.props.log ? (
              this.props.log.length ? (
                <div className='CustomBMSのlog'>
                  {this.props.log.map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                </div>
              ) : (
                <div className='CustomBMSのlog'>
                  <p>Omachi kudasai...</p>
                </div>
              )
            ) : (
              <div className='CustomBMSのdropzoneHint'>
                Drop BMS folder here.
              </div>
            )}
          </div>
        </div>
      </Panel>
    )
  }

  handleDragEnter = (e) => {
    e.preventDefault()
  }

  handleDragOver = (e) => {
    this.setState({ hover: true })
    e.preventDefault()
  }

  handleDragLeave = (e) => {
    this.setState({ hover: false })
    e.preventDefault()
  }

  handleDrop = (e) => {
    this.setState({ hover: false })
    Analytics.send('CustomBMS', 'drop')
    e.preventDefault()
    this.props.onFileDrop(e.nativeEvent).then((song) => {
      if (this.props.onSongLoaded) this.props.onSongLoaded(song)
    })
  }

  handlePaste = async (e) => {
    const song = await this.props.onPaste(e)
    if (song) {
      if (this.props.onSongLoaded) this.props.onSongLoaded(song)
    }
  }
}

export default enhance(CustomBMS)
