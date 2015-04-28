
import './title-scene.scss'

import React            from 'react'
import Scene            from 'bemuse/ui/scene'

React.initializeTouchEvents(true)

export default React.createClass({

  render() {
    return <Scene className="title-scene">
      <div className="title-scene--logo"></div>
      <div className="title-scene--absmessage" >
        ...Click to start...
      </div>
      <div className="title-scene--about">
        About
      </div>
      <div className="title-scene--gitHub">
        gitHub
      </div>
      <div className="title-scene--reddit">
        reddit
      </div>
      <div className="title-scene--gitter">
        gitter
      </div>
    </Scene>
  }

})
