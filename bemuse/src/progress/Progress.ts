import Observable from 'bemuse/utils/observable'

interface IProgressFormatter {
  (progress: Progress): string
}

/**
 * The Progress class represents the progress of an asynchronous operation.
 * It is inspired by C#'s IProgress interface.
 *
 * See: http://blogs.msdn.com/b/dotnet/archive/2012/06/06/async-in-4-5-enabling-progress-and-cancellation-in-async-apis.aspx
 */
export class Progress {
  /** The current progress (out of `Progress#total`). */
  public current: number | undefined = undefined
  /** Total progress value */
  public total: number | undefined = undefined
  /** Some arbitrary information associated with this Progress. */
  public extra: any
  /**
   * The formatter of this progress. This formatter will be used to compute
   * the text representation of this progress (`Progress#toString`).
   */
  public formatter?: IProgressFormatter
  private _observable = new Observable<void>()
  /**
   * Updates the progress.
   */
  report(current: number, total: number, extra?: any) {
    this.current = current
    this.total = total
    this.extra = extra
    this._observable.notify()
  }

  /**
   * Attaches a progress listener function to this progress.
   * The function `f` will be called immediately and synchronously upon watching,
   * and will be called when the progress value is updated.
   * @param f
   * @returns a function that, when called, unsubscribes this listener.
   */
  watch(f: (progress: Progress) => void) {
    f(this)
    return this._observable.watch(() => f(this))
  }

  /**
   * The current progress as a fraction (out of 1).
   */
  get progress() {
    if (this.total && this.current !== undefined && this.current !== null) {
      return this.current / this.total
    } else {
      return null
    }
  }

  /**
   * Returns a string representation of this progress instance.
   * This method is used for displaying the progress as a text.
   */
  toString() {
    if (this.formatter !== undefined) {
      return this.formatter(this)
    } else if (this.progress !== null) {
      return this.current + ' / ' + this.total
    } else {
      return ''
    }
  }
}
