export class StepBuilder<T> {
  definitions: StepDefinition[] = []
  _add(type: string, pattern: RegExp, callback: StepExecutor<T>) {
    this.definitions.push({ type, pattern, callback })
    return this
  }
  Given(pattern: RegExp, callback: StepExecutor<T>) {
    return this._add('Given', pattern, callback)
  }
  And(pattern: RegExp, callback: StepExecutor<T>) {
    return this._add('And', pattern, callback)
  }
  When(pattern: RegExp, callback: StepExecutor<T>) {
    return this._add('When', pattern, callback)
  }
  Then(pattern: RegExp, callback: StepExecutor<T>) {
    return this._add('Then', pattern, callback)
  }
}

type StepExecutor<T> = (this: T, ...args: any[]) => any

type StepDefinition = {
  type: string
  pattern: RegExp
  callback: StepExecutor<any>
}

function steps<T = ICucumberWorld>() {
  return new StepBuilder<T>()
}

declare global {
  interface ICucumberWorld {}
}

export default steps
