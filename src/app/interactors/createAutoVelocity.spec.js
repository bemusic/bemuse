import assert from 'power-assert'

import createAutoVelocity from './createAutoVelocity'

describe('createAutoVelocity', function () {
  describe('when disabled', function () {
    it('initial speed should be from options', () => {
      const autoVelocity = createAutoVelocity({
        enabled: false,
        initialSpeed: 3.8,
        desiredLeadTime: 1000,
        songBPM: 220
      })
      assert(autoVelocity.getInitialSpeed() === 3.8)
    })
    it('should save speed after playing game', () => {
      const autoVelocity = createAutoVelocity({
        enabled: false,
        initialSpeed: 3.8,
        desiredLeadTime: 1000,
        songBPM: 220
      })
      const saveSpeed = sinon.spy()
      const saveLeadTime = sinon.spy()
      autoVelocity.handleGameFinish(2.4, { saveSpeed, saveLeadTime })
      assert(saveSpeed.calledWith(2.4))
      assert(!saveLeadTime.called)
    })
  })

  describe('when enabled', function () {
    it('initial speed should be from song’s BPM', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 1200,
        songBPM: 140
      })
      assert(autoVelocity.getInitialSpeed() === 1.8)
    })
    it('should also take into consideration the lane cover', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 1200,
        songBPM: 140,
        laneCover: 0.5
      })
      assert(autoVelocity.getInitialSpeed() === 0.9)
    })
    it('should also take into consideration the lane cover', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 1200,
        songBPM: 140,
        laneCover: -0.5
      })
      assert(autoVelocity.getInitialSpeed() === 0.9)
    })
    it('initial speed should be from song’s BPM [ANOTHER]', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 600,
        songBPM: 162
      })
      assert(autoVelocity.getInitialSpeed() === 3.1)
    })
    it('initial speed should be from song’s BPM [TUTORIAL]', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 1685,
        songBPM: 178
      })
      assert(autoVelocity.getInitialSpeed() === 1.0)
    })
    it('should save speed and lead time after playing game', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 1685,
        songBPM: 178
      })
      const saveSpeed = sinon.spy()
      const saveLeadTime = sinon.spy()
      autoVelocity.handleGameFinish(3, { saveSpeed, saveLeadTime })
      assert(saveSpeed.calledWith(3))
      assert(saveLeadTime.calledWith(562))
    })
    it('should not save if speed remains the same', () => {
      const autoVelocity = createAutoVelocity({
        enabled: true,
        initialSpeed: 3.8,
        desiredLeadTime: 1685,
        songBPM: 178
      })
      const saveSpeed = sinon.spy()
      const saveLeadTime = sinon.spy()
      autoVelocity.handleGameFinish(1, { saveSpeed, saveLeadTime })
      assert(saveSpeed.calledWith(1))
      assert(!saveLeadTime.called)
    })
  })
})
