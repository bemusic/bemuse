import * as Options from './Options'

import assert from 'power-assert'
import { given, shouldEqual } from 'circumstance'

describe('Options', () => {
  describe('Lane cover', () => {
    it('should be a number', () => {
      assert(Options.laneCover({ 'player.P1.lane-cover': '0' }) === 0)
    })
    it('should be maximum 50%', () => {
      assert(Options.laneCover({ 'player.P1.lane-cover': '99' }) === 0.5)
    })
    it('should be minimum -50%', () => {
      assert(Options.laneCover({ 'player.P1.lane-cover': '-99' }) === -0.5)
    })
  })

  describe('key config', () => {
    it('can be set and get', () => {
      given(Options.initialState)
        .when(Options.changeKeyMapping('KB', '4', '65'))
        .then(Options.getKeyMapping('KB', '4'), shouldEqual('65'))
    })
    it('can be retrieved for current mode by column', () => {
      given(Options.initialState)
        .when(Options.changePlayMode('KB'))
        .then(Options.keyboardMapping, mapping => {
          assert(mapping['4'] === '32') // KB mode, 4th button is space.
        })

      given(Options.initialState)
        .when(Options.changePlayMode('BM'))
        .then(Options.keyboardMapping, mapping => {
          assert(mapping['4'] === '68') // BM mode, 4th button is D.
        })
    })
    describe('key setting progression (in options screen)', () => {
      it('SC → SC2', () => {
        assert(Options.nextKeyToEdit('SC', 'left') === 'SC2')
        assert(Options.nextKeyToEdit('SC', 'right') === 'SC2')
      })
      it('1 → 2', () => {
        assert(Options.nextKeyToEdit('1', 'left') === '2')
        assert(Options.nextKeyToEdit('1', 'right') === '2')
        assert(Options.nextKeyToEdit('1', 'off') === '2')
      })
      it('7 → done (scratch off / left)', () => {
        assert(Options.nextKeyToEdit('7', 'off') === null)
        assert(Options.nextKeyToEdit('7', 'left') === null)
      })
      it('7 → SC (scratch right)', () => {
        assert(Options.nextKeyToEdit('7', 'right') === 'SC')
      })
      it('SC2 → done (scratch right)', () => {
        assert(Options.nextKeyToEdit('SC2', 'right') === null)
      })
      it('SC2 → 1 (scratch left)', () => {
        assert(Options.nextKeyToEdit('SC2', 'left') === '1')
      })
    })
  })

  describe('speed', () => {
    it('can be set and get', () => {
      given(Options.initialState)
        .when(Options.changeSpeed(4.5))
        .then(Options.speed, shouldEqual(4.5))
    })
  })

  describe('lead time', () => {
    it('defaults to 1685 ms (initial speed of tutorial)', () => {
      given(Options.initialState).then(Options.leadTime, shouldEqual(1685))
    })
  })

  describe('scratch position', () => {
    it('switches to keyboard mode if off', () => {
      given(Options.initialState)
        .when(Options.changeScratchPosition('off'))
        .then(Options.scratchPosition, shouldEqual('off'))
        .and(state => {
          assert(state['player.P1.mode'] === 'KB')
        })
    })
    it('switches to BMS mode if on', () => {
      given(Options.initialState)
        .when(Options.changeScratchPosition('right'))
        .then(Options.scratchPosition, shouldEqual('right'))
        .and(state => {
          assert(state['player.P1.mode'] === 'BM')
        })
    })
    it('remembers previous scratch position prior to turning off', () => {
      given(Options.initialState)
        .when(Options.changeScratchPosition('right'))
        .and(Options.changeScratchPosition('off'))
        .then(Options.scratchPosition, shouldEqual('off'))
        .and(state => {
          assert(state['player.P1.mode'] === 'KB')
          assert(state['player.P1.scratch'] === 'right')
        })
    })
  })

  describe('background animations', () => {
    itCanBeToggled({
      check: Options.isBackgroundAnimationsEnabled,
      toggle: Options.toggleBackgroundAnimations,
      defaultSetting: true
    })
  })

  describe('auto velocity', () => {
    itCanBeToggled({
      check: Options.isAutoVelocityEnabled,
      toggle: Options.toggleAutoVelocity,
      defaultSetting: false
    })
  })

  describe('expert gauge', () => {
    itCanBeToggled({
      check: Options.isGaugeEnabled,
      toggle: Options.toggleGauge,
      defaultSetting: false
    })
  })

  describe('new feature announcements', () => {
    it('should track its acknowledgement', () => {
      given(Options.initialState).then(
        Options.hasAcknowledged('twitter'),
        shouldEqual(false)
      )
    })
    it('can be acknowledged by the user', () => {
      given(Options.initialState)
        .when(Options.acknowledge('twitter'))
        .then(Options.hasAcknowledged('twitter'), shouldEqual(true))
    })
  })

  describe('auto/input latency', () => {
    it('defaults to 0', () => {
      given(Options.initialState).then(
        Options.audioInputLatency,
        shouldEqual(0)
      )
    })
    it('can be adjusted', () => {
      given(Options.initialState)
        .when(Options.changeAudioInputLatency(32))
        .then(Options.audioInputLatency, shouldEqual(32))
    })
  })

  describe('last used version', () => {
    it('should be tracked so that it can display “what’s new” dialog', () => {
      given(Options.initialState)
        .when(Options.updateLastSeenVersion('50.0'))
        .then(Options.lastSeenVersion, shouldEqual('50.0'))
    })
  })

  function itCanBeToggled ({ check, toggle, defaultSetting }) {
    it('defaults to ' + defaultSetting, () => {
      given(Options.initialState).then(check, shouldEqual(defaultSetting))
    })
    it('can be toggled', () => {
      given(Options.initialState)
        .when(toggle)
        .then(check, shouldEqual(!defaultSetting))
    })
    it('can be toggled again', () => {
      given(Options.initialState)
        .when(toggle)
        .and(toggle)
        .then(check, shouldEqual(defaultSetting))
    })
  }
})
