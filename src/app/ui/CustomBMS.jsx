
import './CustomBMS.scss'
import React        from 'react'
import c            from 'classnames'
import Panel        from 'bemuse/ui/Panel'
import { Binding }  from 'bemuse/flux'
import Store        from '../stores/custom-bms-store'
import * as Actions from '../actions/custom-bms-actions'

export default React.createClass({
  render() {
    return <Panel className="CustomBMS" title="Load Custom BMS">
      <Binding store={Store} onChange={this.handleState} />
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
            this.state.store.log
            ? (
                this.state.store.log.length
                ? <div className="CustomBMSのlog">
                    {this.state.store.log.map(text => <p>{text}</p>)}
                  </div>
                : <div className="CustomBMSのlog">
                    <p>Omachi kudasai...</p>
                  </div>
              )
            : <div className="CustomBMSのdropzoneHint">
                Drop BMS folder here.
              </div>
          }
        </div>
      </div>
    </Panel>
  },
  getInitialState() {
    return { hover: false, store: Store.get() }
  },
  handleState(newState) {
    this.setState({ store: newState })
  },
  handleDragEnter(e) {
    e.preventDefault()
  },
  handleDragOver(e) {
    this.setState({ hover: true })
    e.preventDefault()
  },
  handleDragLeave(e) {
    this.setState({ hover: false })
    e.preventDefault()
  },
  handleDrop(e) {
    this.setState({ hover: false })
    Actions.drop(e.nativeEvent, (song) => {
      if (this.props.onSongLoaded) this.props.onSongLoaded(song)
    })
    e.preventDefault()
  },
})
