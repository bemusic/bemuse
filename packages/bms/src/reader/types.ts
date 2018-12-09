export type ReadCallback = (error: Error | null, value?: string) => void

export interface ReaderOptions {
  /** Force an encoding. */
  forceEncoding?: string
}
