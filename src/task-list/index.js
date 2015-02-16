
import { EventEmitter } from 'events'

export class TaskList extends EventEmitter {
  constructor() {
    this._tasks = []
  }
  push(task) {
    this._tasks.push(task)
    task.on('progress', () => this.emit('progress'))
    this.emit('progress')
  }
  task(...args) {
    let t = new Task(...args)
    this.push(t)
    return t
  }
  map(f) {
    return this._tasks.map(f)
  }
}

export class Task extends EventEmitter {
  constructor(text) {
    this.text     = text
    this.current  = null
    this.total    = null
    this.progress = null
  }
  update({ text, current, total, progress }) {
    if (text     !== undefined) this.text      = text
    if (current  !== undefined) this.current   = current
    if (total    !== undefined) this.total     = total
    if (progress !== undefined) this.progress  = progress
    this.emit('progress')
  }
}

export default TaskList
