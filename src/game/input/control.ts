export class Control {
  public value = 0
  public changed = false
  get justPressed() {
    return this.changed && this.value
  }
}

export default Control
