export type MonetizationOptions = {
  /** Payment pointer. */
  content: string
  /** Weight for probabilistic. */
  weight?: number
  /** Priority number. */
  priority?: number
}

export type MonetizationConfiguration = {
  content: string
  weight: number
  priority: number
}

type Runtime = {
  Math: {
    random(): number
  }
}

export class Monetizer {
  _element: HTMLMetaElement | null = null
  _active = new Set<MonetizationConfiguration>()
  _runtime: Runtime = window

  monetize(options: MonetizationOptions | string) {
    const {
      content,
      weight = 1,
      priority = 0,
    } = typeof options === 'string' ? { content: options } : options
    const configuration: MonetizationConfiguration = {
      content,
      weight,
      priority,
    }
    this._active.add(configuration)
    this.update()
    return () => {
      this._active.delete(configuration)
      this.update()
    }
  }
  update() {
    const active = Array.from(this._active)
    const maxPriority = Math.max(
      ...active.map((configuration) => configuration.priority)
    )
    const considered = active.filter((item) => item.priority === maxPriority)
    const sum = considered.reduce((sum, item) => sum + item.weight, 0)
    let choice = this._runtime.Math.random() * sum
    let targetPointer = ''
    for (const item of considered) {
      if ((choice -= item.weight) <= 0) {
        targetPointer = item.content
        break
      }
    }
    this._setPointer(targetPointer)
  }
  dispose() {
    this._setPointer('')
  }
  _setPointer(targetPointer: string) {
    if (!targetPointer && this._element) {
      this._element.remove()
      this._element = null
    }
    if (targetPointer && !this._element) {
      const monetizationTag = document.createElement('meta')
      monetizationTag.name = 'monetization'
      monetizationTag.content = targetPointer
      document.head.appendChild(monetizationTag)
      this._element = monetizationTag
    }
    if (
      targetPointer &&
      this._element &&
      this._element.content !== targetPointer
    ) {
      this._element.content = targetPointer
    }
  }
}

export const defaultMonetizer = new Monetizer()

export function monetize(options: MonetizationOptions | string) {
  return defaultMonetizer.monetize(options)
}
