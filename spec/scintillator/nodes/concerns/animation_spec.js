
import { _parse, _attrs }
  from '../../../../src/scintillator/nodes/concerns/animation'
import $ from 'jquery'

let $xml = xml => $($.parseXML(xml).documentElement)

describe('Scintillator::Animation', function() {

  describe('_attrs', function() {
    it('lists all attributes of an element', function() {
      let xml = $xml(`<keyframe t="0" x="10" y="30" />`)[0]
      expect(_attrs(xml)).to.deep.equal({ t: '0', x: '10', y: '30' })
    })
  })

  describe('_parse', function() {
    it('compiles animation into keyframes', function() {
      let xml = $xml(`<animation>
        <keyframe t="0" x="10" y="30" />
        <keyframe t="2" x="20" />
        <keyframe t="5" x="15" y="20" />
      </animation>`)
      expect(_parse(xml)).to.deep.equal([
        { name: 'x', keyframes: [
            { time: 0, value: 10, ease: 'linear' },
            { time: 2, value: 20, ease: 'linear' },
            { time: 5, value: 15, ease: 'linear' },
          ], },
        { name: 'y', keyframes: [
            { time: 0, value: 30, ease: 'linear' },
            { time: 5, value: 20, ease: 'linear' },
          ], },
      ])
    })
  })

})

