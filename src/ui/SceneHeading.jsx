
import './SceneHeading.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render () {
    return <div className={c('SceneHeading', this.props.className)}>
      {this.props.children}
    </div>
  }

})
