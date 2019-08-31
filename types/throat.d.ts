declare module 'throat' {
  var throat: {
    (concurrency: number): <R>(fn: () => PromiseLike<R>) => PromiseLike<R>
    <A extends any[], R>(
      concurrency: number,
      fn: (...args: A) => PromiseLike<R>
    ): (...args: A) => PromiseLike<R>
  }
  export = throat
}
