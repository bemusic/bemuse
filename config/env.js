
import NODE_ENV from 'node-env'

export function production() {
  return NODE_ENV === 'production'
}

export function test() {
  return NODE_ENV === 'test'
}

export function development() {
  return !production() && !test()
}
