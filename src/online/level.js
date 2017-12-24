import invariant from 'invariant'

export function fromObject ({ md5, playMode }) {
  invariant(typeof md5 === 'string', 'md5 must be a string')
  invariant(typeof playMode === 'string', 'playMode must be a string')
  return { md5, playMode }
}
