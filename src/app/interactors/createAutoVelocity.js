import invariant from 'invariant'
import _ from 'lodash'

export default (options) => {
  invariant(typeof options.enabled === 'boolean', 'enabled must be a boolean')
  invariant(typeof options.initialSpeed === 'number', 'initialSpeed must be a number')
  invariant(typeof options.desiredLeadTime === 'number', 'desiredLeadTime must be a number')
  invariant(typeof options.songBPM === 'number', 'songBPM must be a number')
  if (options.enabled) {
    return autoVelocity({
      desiredLeadTime: options.desiredLeadTime,
      songBPM: options.songBPM,
    })
  } else {
    return manualVelocity(options.initialSpeed)
  }
}

function manualVelocity (initialSpeed) {
  return {
    getInitialSpeed () {
      return initialSpeed
    },
    handleGameFinish (finishingSpeed, { saveSpeed }) {
      saveSpeed(finishingSpeed)
    }
  }
}

function autoVelocity ({ songBPM, desiredLeadTime }) {
  const nominalSpeedLeadTime = 60000 * 5 / songBPM
  const initialSpeed = _.minBy(
    _.range(1, 999).map(x => x / 10),
    (speed) => Math.abs(desiredLeadTime - (nominalSpeedLeadTime / speed))
  )
  return {
    getInitialSpeed () {
      return initialSpeed
    },
    handleGameFinish (finishingSpeed, { saveSpeed, saveLeadTime }) {
      saveSpeed(finishingSpeed)
      if (finishingSpeed.toFixed(1) !== initialSpeed.toFixed(1)) {
        saveLeadTime(Math.round(nominalSpeedLeadTime / finishingSpeed))
      }
    }
  }
}
