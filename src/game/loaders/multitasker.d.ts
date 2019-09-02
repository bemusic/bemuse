import Progress from 'bemuse/progress'

export function start<T, R>(
  tasks: (task: TaskFn<T>, run: RunFn<T>) => PromiseLike<R>
): void

// Some TypeScript abomination here until we can concatenate tuples.
// https://github.com/microsoft/TypeScript/issues/31286
// https://github.com/microsoft/TypeScript/issues/16746
// https://github.com/microsoft/TypeScript/issues/26058
type TaskFn<T extends {}> = {
  <N extends keyof T>(
    name: N,
    description: null | string,
    deps: [],
    run: (progress: Progress) => PromiseLike<T[N]>
  ): void
  <N extends keyof T, D1 extends keyof T>(
    name: N,
    description: null | string,
    deps: [D1],
    run: (d1: T[D1], progress: Progress) => PromiseLike<T[N]>
  ): void
  <N extends keyof T, D1 extends keyof T, D2 extends keyof T>(
    name: N,
    description: null | string,
    deps: [D1, D2],
    run: (d1: T[D1], d2: T[D2], progress: Progress) => PromiseLike<T[N]>
  ): void
  <
    N extends keyof T,
    D1 extends keyof T,
    D2 extends keyof T,
    D3 extends keyof T
  >(
    name: N,
    description: null | string,
    deps: [D1, D2, D3],
    run: (
      d1: T[D1],
      d2: T[D2],
      d3: T[D3],
      progress: Progress
    ) => PromiseLike<T[N]>
  ): void
  <
    N extends keyof T,
    D1 extends keyof T,
    D2 extends keyof T,
    D3 extends keyof T,
    D4 extends keyof T
  >(
    name: N,
    description: null | string,
    deps: [D1, D2, D3, D4],
    run: (
      d1: T[D1],
      d2: T[D2],
      d3: T[D3],
      d4: T[D4],
      progress: Progress
    ) => PromiseLike<T[N]>
  ): void

  bar(description: string, progress: Progress)
}

type RunFn = <T = any>(name: string) => Promise<T>
