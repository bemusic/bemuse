
import './loading.scss'
import React from 'react'
import c     from 'classnames'

export default React.createClass({
  render() {
    return <div className="loading">
      <div className="loading--dj"></div>
      <div className="loading--text">Loading</div>
    </div>
  }
})
