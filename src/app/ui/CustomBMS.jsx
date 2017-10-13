
import './CustomBMS.scss'
import React from 'react'
import c from 'classnames'
import Panel from 'bemuse/ui/Panel'
import { connect } from 'react-redux'
import connectIO from '../../impure-react/connectIO'
import * as ReduxState from '../redux/ReduxState'
import * as Analytics from '../analytics'
import { compose } from 'recompose'
import * as CustomSongsIO from '../io/CustomSongsIO'

const enhance = compose(
  connect((state) => ({
    log: ReduxState.selectCustomSongLoaderLog(state)
  })),
  connectIO({
    onFileDrop: () => (event) => CustomSongsIO.handleCustomSongFolderDrop(event)
  })
)

class CustomBMS extends React.Component {
  constructor () {
    super()
    this.state = this.getInitialState()
  }

  render () {
    return <Panel className="CustomBMS" title="Load Custom BMS">
      <div className="CustomBMSのwrapper">
        <div className="CustomBMSのinstruction">
          Please drag and drop a BMS folder into the drop zone below.
        </div>
        <div className="CustomBMSのremark">
          This feature is only supported in Google Chrome.
        </div>
        <div className="CustomBMSのremark">
          Please don’t play unauthorized / illegally obtained BMS files.
        </div>
        <div className={c('CustomBMSのdropzone',
              { 'is-hover': this.state.hover })}
          onDragOver={this.handleDragOver}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDrop}>
          {
            this.props.log
            ? (
              this.props.log.length
              ? (
                <div className="CustomBMSのlog">
                  {this.props.log.map(text => <p>{text}</p>)}
                </div>
              )
              : (
                <div className="CustomBMSのlog">
                  <p>Omachi kudasai...</p>
                </div>
              )
            )
            : <div className="CustomBMSのdropzoneHint">
              Drop BMS folder here.
            </div>
          }
        </div>
      </div>
    </Panel>
  }

  getInitialState () {
    return { hover: false }
  }

  handleDragEnter (e) {
    e.preventDefault()
  }

  handleDragOver (e) {
    this.setState({ hover: true })
    e.preventDefault()
  }

  handleDragLeave (e) {
    this.setState({ hover: false })
    e.preventDefault()
  }

  handleDrop (e) {
    this.setState({ hover: false })
    Analytics.send('CustomBMS', 'drop')
    e.preventDefault()
    const promise = this.props.onFileDrop(e.nativeEvent)
    promise.then((song) => {
      if (this.props.onSongLoaded) this.props.onSongLoaded(song)
    })
  }
}

export default enhance(CustomBMS)
