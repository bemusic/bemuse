const { Timing, Compiler } = require('../lib')
const { expect } = require('chai')

describe('Timing', function () {
  function case1() {
    return new Timing(120, [
      { type: 'bpm', beat: 3, bpm: 90 },
      { type: 'stop', beat: 4, stopBeats: 1 },
      { type: 'bpm', beat: 4, bpm: 180 },
    ])
  }

  it('should return beats where there are events', function () {
    const t = case1()
    expect(t.getEventBeats()).to.deep.equal([3, 4])
  })

  it('should convert beats to seconds', function () {
    const t = case1()
    expect(t.beatToSeconds(0)).to.be.closeTo(0, 1e-2)
    expect(t.beatToSeconds(1)).to.be.closeTo(0.5, 1e-2)
    expect(t.beatToSeconds(2)).to.be.closeTo(1, 1e-2)
    expect(t.beatToSeconds(3)).to.be.closeTo(1.5, 1e-2)
    expect(t.beatToSeconds(4)).to.be.closeTo(2.167, 1e-2)
    expect(t.beatToSeconds(5)).to.be.closeTo(2.833, 1e-2)
  })

  it('should allow getting BPM at beat', function () {
    const t = case1()
    expect(t.bpmAtBeat(0)).to.equal(120)
    expect(t.bpmAtBeat(3)).to.equal(90)
    expect(t.bpmAtBeat(4)).to.equal(180)
  })

  it('should convert seconds to beat', function () {
    const t = case1()
    expect(t.secondsToBeat(0.0)).to.be.closeTo(0, 1e-2)
    expect(t.secondsToBeat(0.5)).to.be.closeTo(1, 1e-2)
    expect(t.secondsToBeat(1.0)).to.be.closeTo(2, 1e-2)
    expect(t.secondsToBeat(1.5)).to.be.closeTo(3, 1e-2)
    expect(t.secondsToBeat(2.167)).to.be.closeTo(4, 1e-2)
    expect(t.secondsToBeat(2.2)).to.be.closeTo(4, 1e-2)
    expect(t.secondsToBeat(2.3)).to.be.closeTo(4, 1e-2)
    expect(t.secondsToBeat(2.4)).to.be.closeTo(4, 1e-2)
    expect(t.secondsToBeat(2.5)).to.be.closeTo(4, 1e-2)
    expect(t.secondsToBeat(2.833)).to.be.closeTo(5, 1e-2)
  })

  describe('.fromBMSChart', function () {
    it('should work with extbpm', function () {
      const chart = Compiler.compile('#BPM01 123.45\n#00108:01').chart
      const t = Timing.fromBMSChart(chart)
      expect(t.bpmAtBeat(5)).to.equal(123.45)
    })

    it('should fold #EXBPM id case in base-36 charts (default)', function () {
      const chart = Compiler.compile('#BPMAA 123.45\n#00108:aa').chart
      const t = Timing.fromBMSChart(chart)
      expect(t.bpmAtBeat(5)).to.equal(123.45)
    })

    describe('with #BASE 62', function () {
      it('should resolve #EXBPM ids case-sensitively', function () {
        const chart = Compiler.compile(
          '#BASE 62\n#BPMAa 200\n#BPMAA 100\n#00108:Aa'
        ).chart
        const t = Timing.fromBMSChart(chart)
        expect(t.bpmAtBeat(5)).to.equal(200)
      })

      it('should not resolve an #EXBPM id of the wrong case', function () {
        const chart = Compiler.compile('#BASE 62\n#BPMAa 200\n#00108:AA').chart
        const t = Timing.fromBMSChart(chart)
        // `AA` is undefined in base-62, so no BPM change happens.
        expect(t.bpmAtBeat(5)).to.equal(60)
      })

      it('should resolve #STOP ids case-sensitively', function () {
        const chart = Compiler.compile('#BASE 62\n#STOPAa 48\n#00109:Aa').chart
        const t = Timing.fromBMSChart(chart)
        // The stop object lands on measure 1 (beat 4). #STOPAa is 48 ticks =
        // one beat, and the default BPM is 60, so it delays everything past
        // beat 4 by one second: beat 5 shifts from 5s to 6s.
        expect(t.getEventBeats()).to.deep.equal([4])
        expect(t.beatToSeconds(5)).to.be.closeTo(6, 1e-2)
      })
    })
  })
})
