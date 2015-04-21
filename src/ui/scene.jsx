
import './scene/scene.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render() {
    return <div className={c('scene', this.props.className)}>
      {this.props.children}
    </div>
  }

})
