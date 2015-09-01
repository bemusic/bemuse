
import './service-worker-registration-scene.scss'
import React from 'react'
import Scene from 'bemuse/ui/scene'

export default React.createClass({
  render() {
    return <Scene className='ServiceWorkerRegistrationScene'>
      <div>
        Please wait while the service worker is being installed...
      </div>
    </Scene>
  }
})
