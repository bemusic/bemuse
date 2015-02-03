
import { _compile, _attrs, Animation }
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

  describe('_compile', function() {
    it('compiles animation into keyframes', function() {
      let xml = $xml(`<animation>
        <keyframe t="0" x="10" y="30" />
        <keyframe t="2" x="20" />
        <keyframe t="5" x="15" y="20" />
      </animation>`)
      expect(_compile(xml)).to.deep.equal({
        on: '',
        data: [
          { name: 'x', keyframes: [
              { time: 0, value: 10, ease: 'linear' },
              { time: 2, value: 20, ease: 'linear' },
              { time: 5, value: 15, ease: 'linear' },
            ], },
          { name: 'y', keyframes: [
              { time: 0, value: 30, ease: 'linear' },
              { time: 5, value: 20, ease: 'linear' },
            ], },
        ],
      })
    })
    it('throws when there is no time', function() {
      let xml = $xml(`<animation>
        <keyframe />
      </animation>`)
      expect(() => _compile(xml)).to.throw(Error)
    })
  })

  describe('#_properties', function() {
    it('should return a set of properties', function() {
      let anim = Animation.compile(null, $xml(`<group>
        <animation>
          <keyframe t="0" x="10" />
          <keyframe t="1" x="20" />
        </animation>
        <animation>
          <keyframe t="0" y="10" />
          <keyframe t="1" y="20" />
        </animation>
      </group>`))
      expect(Array.from(anim._properties)).to.deep.equal(['x', 'y'])
    })
  })

  describe('#_events', function() {
    it('list distinct events', function() {
      let anim = Animation.compile(null, $xml(`<group>
        <animation />
        <animation />
        <animation on="exit" />
        <animation on="exit" />
      </group>`))
      expect(anim._events).to.deep.equal(['', 'exit'])
    })
  })

})

