export class AxisLogic {
  private stop = 1
  private charge = 0
  private previous: false | number = false
  private active = false
  private positive = false

  public update(axis: number, threshold: number = 3) {
    if (this.previous === false) {
      this.previous = axis
      return 0
    }

    if (this.previous !== axis) {
      let delta = axis - this.previous
      if (delta > 1) {
        delta -= 2 + 0.005
      } else if (delta < -1) {
        delta += 2 + 0.005
      }

      const immediateOutput = delta > 0

      if (this.active && this.positive !== immediateOutput) {
        this.positive = immediateOutput
        this.active = false
        this.charge = 0
      } else if (!this.active) {
        if (this.charge === 0 || this.stop <= threshold) {
          this.charge += Math.ceil(Math.abs(delta) / 0.01)
        }

        if (this.charge >= 2) {
          this.active = true
          this.positive = immediateOutput
        }
      }

      this.stop = 0
      this.previous = axis
    }

    if (this.stop > threshold * 2) {
      this.active = false
      this.charge = 0
      this.stop = 0
    }

    this.stop += 1

    return this.active ? (this.positive ? 1 : -1) : 0
  }
}
