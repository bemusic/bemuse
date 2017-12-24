import createAudioContext from 'audio-context'

export default createAudioContext({
  latencyHint: 'interaction'
})
