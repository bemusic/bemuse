import throat from 'throat'

let decoderPromise

const limit = throat(1)

/**
 * Decodes an OGG file using stbvorbis.js.
 *
 * @param {AudioContext} audioContext
 * @param {ArrayBuffer} arrayBuffer
 */
export async function decodeOGG(audioContext, arrayBuffer) {
  if (!decoderPromise) {
    decoderPromise = import(/* webpackChunkName: 'stbvorbis' */ 'raw-loader!./vendor/stbvorbis/stbvorbis-e6da5fe.js')
      .then(ns => ns.default)
      .then(src => {
        // eslint-disable-next-line no-eval
        return (0, eval)(src + ';stbvorbis')
      })
  }
  const stbvorbis = await decoderPromise
  return limit(
    () =>
      new Promise((resolve, reject) => {
        const buffers = []
        let totalLength = 0
        let sampleRate
        stbvorbis.decode(arrayBuffer, function(e) {
          if (e.data) {
            sampleRate = e.sampleRate
            buffers.push(e.data)
            totalLength += e.data[0].length
          }
          if (e.error) {
            reject(
              e.error instanceof Error
                ? e.error
                : `stbvorbis.js Error: ${e.error}`
            )
          }
          if (e.eof) {
            resolve(
              createBuffer(audioContext, buffers, totalLength, sampleRate)
            )
          }
        })
      })
  )
}

/**
 * @param {AudioContext} audioContext
 * @param {Float32Array[]} decodedChunks
 * @param {number} totalLength
 * @param {number} sampleRate
 */
function createBuffer(audioContext, decodedChunks, totalLength, sampleRate) {
  if (!totalLength) {
    throw new Error(`stbvorbis.js Error: No length`)
  }
  if (!sampleRate) {
    throw new Error(`stbvorbis.js Error: No sample rate`)
  }
  var audioBuffer = audioContext.createBuffer(
    decodedChunks[0].length,
    totalLength,
    sampleRate
  )
  var track = Array(audioBuffer.numberOfChannels)
    .fill()
    .map(() => 0)
  var data = Array(audioBuffer.numberOfChannels)
    .fill()
    .map((_, ch) => audioBuffer.getChannelData(ch))
  for (const chunk of decodedChunks) {
    chunk.forEach(function(a, ch) {
      // buf.copyToChannel(a, ch, track[ch]) — not supported in iOS Safari!
      var offset = track[ch]
      for (var i = 0; i < a.length; i++) {
        data[ch][i + offset] = a[i]
      }
      track[ch] += a.length
    })
  }
  return audioBuffer
}
