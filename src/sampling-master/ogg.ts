import throat from 'throat'

type OGGDecodeEvent = {
  data?: Float32Array[]
  sampleRate: number
  error?: any
  eof?: boolean
}

type OGGDecoder = {
  decode(arrayBuffer: ArrayBuffer, callback: (e: OGGDecodeEvent) => void): void
}

let decoderPromise: Promise<OGGDecoder>

const limit = throat(1)

/**
 * Decodes an OGG file using stbvorbis.js.
 */
export async function decodeOGG(
  audioContext: AudioContext,
  arrayBuffer: ArrayBuffer
) {
  if (!decoderPromise) {
    // @ts-ignore
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
      new Promise<AudioBuffer>((resolve, reject) => {
        const buffers: Float32Array[][] = []
        let totalLength = 0
        let sampleRate: number
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

async function createBuffer(
  audioContext: AudioContext,
  decodedChunks: Float32Array[][],
  totalLength: number,
  sampleRate: number
) {
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
    .fill(null)
    .map(() => 0)
  var data = Array(audioBuffer.numberOfChannels)
    .fill(null)
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
