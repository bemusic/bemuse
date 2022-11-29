import { useEffect, useState } from 'react'

import type { Observable } from 'rxjs'

export const useObservable = <T>(observable: Observable<T>) => {
  const [prop, setProp] = useState<T | null>(null)
  useEffect(() => {
    observable.subscribe(setProp)
  }, [])
  return prop
}
