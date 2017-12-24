export class Control {
  constructor () {
    this.value = 0
    this.changed = false
  }
  get justPressed () {
    return this.changed && this.value
  }
}

export default Control
