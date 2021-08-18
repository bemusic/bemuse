import steps from '../cucumber-dsl'

export default steps()
  .Then(
    /^scrolling speed at beat ([-\d.]+) is ([-\d.]+)$/,
    function (beat, speed) {
      expect(this.positioning.speed(+beat)).to.equal(+speed)
    },
  )

  .Then(
    /^scrolling position at beat ([-\d.]+) is ([-\d.]+)$/,
    function (beat, position) {
      expect(this.positioning.position(+beat)).to.equal(+position)
    },
  )
