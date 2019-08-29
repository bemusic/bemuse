declare module 'throat' {
  var throat: {
    (concurrency: number): <R>(fn: () => Promise<R>) => Promise<R>
  }
  export = throat
}
