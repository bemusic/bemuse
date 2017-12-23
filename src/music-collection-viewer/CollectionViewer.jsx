import React from 'react'
import preprocessCollection from 'bemuse/music-collection/preprocessCollection'
import query from 'bemuse/utils/query'
import { OFFICIAL_SERVER_URL, load } from 'bemuse/music-collection'

import MusicTable from './MusicTable'

export class CollectionViewer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      url: query.server || OFFICIAL_SERVER_URL,
      status: 'Loading'
    }
  }
  componentDidMount () {
    load(this.state.url)
      .then((result) => {
        this.setState({ status: 'Load completed', data: result })
      })
      .catch((e) => {
        this.setState({ status: 'Load error: ' + e })
      })
  }
  render () {
    return (
      <div>
        <header style={{ textAlign: 'center' }}>
          <h1>Bemuse collection viewer</h1>
          <div>{this.state.url}<br />{this.state.status}</div>
        </header>
        <div style={{ padding: 20 }}>
          <MusicTable
            data={this.state.data && preprocessCollection(this.state.data)}
            url={this.state.url}
            initialSort={query.sort}
          />
        </div>
      </div>
    )
  }
}

export default CollectionViewer
