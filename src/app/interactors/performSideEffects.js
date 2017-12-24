export function performSideEffects (sideEffect川) {
  const subscription = sideEffect川.subscribe(f => f())
  return {
    dispose: () => subscription.unsubscribe()
  }
}

export default performSideEffects
