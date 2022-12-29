declare module 'timesynchro' {
  export default function sync(
    url: string,
    onFinish: (err: Error | null, offset?: number) => void,
    onResult: (offset: number) => void
  )
}
