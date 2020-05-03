export class DualInput {
  /*
    A helper class for mapping two boolean inputs to a single integer output.
    This provide robust and responsive output when quickly firing two inputs alternatively.
  */

  // input states -1: up, 0: off, 1: down, 2: hold
  private input = [0, 0]
  private last = 0
  private output = 0

  public combine(...input: [boolean, boolean]) {
    for (let i = 0; i < 2; ++i) {
      if (input[i] && this.input[i] <= 0) {
        this.input[i] = 1
        this.last = i
      } else if (!input[i] && this.input[i] > 0) {
        this.input[i] = -1
      } else if (this.input[i] % 2 !== 0) {
        this.input[i] += 1
      }
    }

    if (this.input[0] === 1 || this.input[1] === 1) {
      this.output = this.last === 0 ? 1 : -1
    }

    if (this.input[this.last] <= 0) {
      this.output = 0
    }

    return this.output
  }
}
