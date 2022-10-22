import { LoggingFunction } from './types'

export default class ResourceLogging {
  private buffer: string[] | null = []
  private loggingFunction: LoggingFunction = (text) => {
    if (this.buffer) this.buffer.push(text)
  }

  public log: LoggingFunction = (text) => {
    this.loggingFunction(text)
  }

  setLoggingFunction = (fn: LoggingFunction) => {
    this.loggingFunction = fn
    if (this.buffer) {
      this.buffer.forEach((text) => fn(text))
      this.buffer = null
    }
  }
}
