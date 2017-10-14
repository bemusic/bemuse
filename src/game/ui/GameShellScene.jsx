
import './GameShellScene.scss'
import React        from 'react'
import DndResources from 'bemuse/resources/dnd-resources'
import c            from 'classnames'

class CustomChartSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
    }
  }

  render () {
    let files = this.state.files
    return <div className="drop-zone">
      {
        files.length
        ? (
          <ul>
            {files.map(file =>
              <li>
                <a href="javascript://"
                  onClick={this.handleItemClick}
                  className={
                        c({ 'is-active':
                            file.resource === this.props.selectedResource })}>
                  {file.name}
                </a>
              </li>
            )}
            {
              this.props.selectedResource
              ? (
                <li>
                  <a href="javascript://" onClick={this.handleClear}>
                    Clear
                  </a>
                </li>
              )
              : null
            }
          </ul>
        )
        : (
          <div className="drop-zone-hint">
            Drop BMS folder here
            <br />
            (only works on Google Chrome)
          </div>
        )
      }
    </div>
  }

  handleDrop = (e) => {
    e.preventDefault()
    let event = e.nativeEvent
    let resources = new DndResources(event)
    resources.fileList.then(list => {
      return list.filter(filename => /\.(bms|bme|bml)$/i.test(filename))
    })
    .map(name => resources.file(name).then(resource => ({ name, resource })))
    .then(bms => {
      this.setState({ files: bms, resources: resources })
    })
    .catch(err => {
      if (err.constructor.name === 'FileError') {
        throw new Error('File Error code ' + e.code)
      } else {
        throw err
      }
    })
    .done()
  };

  handleItemClick = (file) => {
    return () => {
      this.props.onSelect(this.state.resources, file.resource)
    }
  };

  handleClear = () => {
    this.props.onSelect(null, null)
  };
}

export default class GameShellScene extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: this.props.options,
    }
  }

  render () {
    let options = this.state.options
    return <div
      className="GameShellScene"
      onDragOver={this.handleDragOver}
      onDrop={this.handleDrop}>
      <h1>Bemuse Game Shell</h1>
      <p>This tool is intended for developers testing the game.</p>
      <form onSubmit={this.submit}>
        <div className="text">
          <label><span className="label">BMS URL:</span>
            <input
              type="text"
              disabled={options.resource}
              onChange={this.bindOption((o, v) => (o.url = v))}
              value={options.url} />
          </label>
        </div>
        <div className="text">
          <label><span className="label">-or- Drop BMS folder here</span>
            <CustomChartSelector
              ref="dropzone"
              selectedResource={options.resource}
              onSelect={this.handleSelectFile} />
          </label>
        </div>
        <div className="text">
          <label><span className="label">Audio-Input Latency</span>
            <input
              type="text"
              onChange={this.bindOption((o, v) => (o.game.audioInputLatency = v))}
              value={options.game.audioInputLatency} />
          </label>
        </div>
        <div className="text">
          <label><span className="label">HI-SPEED:</span>
            <input type="text"
              onChange={this.bindOption((o, v) => (o.players[0].speed = v))}
              value={options.players[0].speed} />
          </label>
        </div>
        <div className="radio">
          <h3>Placement</h3>
          {['left', 'center', 'right'].map(placement =>
            <label>
              <input type="radio" value={placement}
                onChange={this.bindOption((o, v) => (o.players[0].placement = v))}
                checked={options.players[0].placement === placement} />
              <span className="label">{placement}</span>
            </label>
          )}
        </div>
        <button type="submit">Play</button>
      </form>
    </div>
  }

  submit = (e) => {
    e.preventDefault()
    this.props.play(this.state.options)
  };

  bindOption = (binder) => {
    return (event) => {
      binder(this.state.options, event.target.value)
      this.forceUpdate()
    }
  };

  handleDragOver = (e) => {
    e.preventDefault()
  };

  handleDrop = (e) => {
    e.preventDefault()
    this.refs.dropzone.handleDrop(e)
  };

  handleSelectFile = (resources, resource) => {
    this.setState({
      options: Object.assign(this.state.options, { resources, resource })
    })
    this.forceUpdate()
  };
}
