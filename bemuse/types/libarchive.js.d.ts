declare module 'libarchive.js/main.js' {
  export namespace Archive {
    function init({ workerUrl: string }): void
    function open(file: File): PromiseLike<Archive>
  }
  type Archive = {
    extractFiles(
      callback?: (entry: { file: File; path: string }) => void
    ): PromiseLike<any>
  }
}
