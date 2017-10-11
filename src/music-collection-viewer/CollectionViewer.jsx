import React, { Component } from 'react'
import preprocessCollection from 'bemuse/music-collection/preprocessCollection'
import query from 'bemuse/utils/query'
import { OFFICIAL_SERVER_URL, load } from 'bemuse/music-collection'

import MusicTable from './MusicTable'

export class CollectionViewer extends Component {
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
    const { data, status, url } = this.state
    return (
      <div>
        <header style={{ textAlign: 'center' }}>
          <h1>Bemuse collection viewer</h1>
          <div>{url}<br />{status}</div>
        </header>
        <div style={{ padding: 20 }}>
          <MusicTable
            data={data && preprocessCollection(data)}
            url={url}
            initialSort={query.sort}
          />
        </div>
      </div>
    )
  }
}

export default CollectionViewer
