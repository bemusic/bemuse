/**
 * @public
 */
export type ReadCallback = (error: Error | null, value?: string) => void

/**
 * @public
 */
export interface ReaderOptions {
  /** Force an encoding. */
  forceEncoding?: string
}
