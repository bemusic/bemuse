export class BatchedFetcher<T> {
  constructor(
    private onFetch: (md5s: string[]) => Promise<T[]>,
    private getMd5: (t: T) => string
  ) {}

  private pending: {
    set: Set<string>
    promise: Promise<Map<string, T[]>>
  } | null = null

  load(md5: string): Promise<T[]> {
    if (!this.pending) {
      const set = new Set<string>()
      this.pending = {
        set,
        promise: new Promise((resolve) => {
          setTimeout(() => {
            this.pending = null
            const md5s = Array.from(set)
            resolve(
              this.onFetch(md5s).then((result) => {
                const map = new Map<string, T[]>()
                for (const t of result) {
                  const md5 = this.getMd5(t)
                  const list = map.get(md5) || []
                  list.push(t)
                  map.set(md5, list)
                }
                return map
              })
            )
          }, 138)
        }),
      }
    }
    this.pending.set.add(md5)
    return this.pending.promise.then((map) => map.get(md5) || [])
  }
}
