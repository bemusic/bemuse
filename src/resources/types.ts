import Progress from 'bemuse/progress'

export interface IResources {
  file(name: string): PromiseLike<IResource>
}

export interface IResource {
  /** Name of the resource */
  name: string
  /** Resolves the URL for this resource, for e.g. using in video src. */
  resolveUrl(): PromiseLike<string>
  /** Reads the resource contents as an ArrayBuffer */
  read(progress: Progress): PromiseLike<ArrayBuffer>
}
