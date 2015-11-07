
import NODE_ENV from 'node-env'
import enabled  from 'is-true-ish'

export function production () {
  return NODE_ENV === 'production'
}

export function test () {
  return NODE_ENV === 'test'
}

export function development () {
  return !production() && !test()
}

export function sourceMapsEnabled () {
  return enabled(process.env.SOURCE_MAPS)
}

export function coverageEnabled () {
  return enabled(process.env.BEMUSE_COV)
}

export function hotModeEnabled () {
  return enabled(process.env.HOT)
}

export function serverPort () {
  return +process.env.PORT || 8080
}
