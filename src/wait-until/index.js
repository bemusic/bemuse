export default function waitUntil (condition) {
  return go(1, 9)

  function go (wait, timesLeft) {
    const result = new Promise(resolve => resolve(condition()))
    return result.catch(e => {
      if (timesLeft === 0) throw e
      return new Promise(resolve =>
        setTimeout(() => {
          resolve(go(wait * 2, timesLeft - 1))
        }, wait)
      )
    })
  }
}
