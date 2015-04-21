
import './scene-heading/scene-heading.scss'

import React  from 'react'
import c      from 'classnames'

export default React.createClass({

  render() {
    return <div className={c('scene-heading', this.props.className)}>
      {this.props.children}
    </div>
  }

})
