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

function getDecoder() {
  if (!decoderPromise) {
    decoderPromise = import(
      // @ts-ignore
      /* webpackChunkName: 'stbvorbis' */ 'raw-loader!./vendor/stbvorbis/stbvorbis-e6da5fe-NDEBUG.js'
    )
      .then((ns) => ns.default)
      .then((src) => {
        // eslint-disable-next-line no-eval
        return (0, eval)(src + ';stbvorbis')
      })
  }
  return decoderPromise
}

/**
 * Decodes an OGG file using stbvorbis.js.
 */
export async function decodeOGG(
  audioContext: AudioContext,
  arrayBuffer: ArrayBuffer
) {
  const stbvorbis = await getDecoder()
  return limit(() => doDecodeOGG(stbvorbis, audioContext, arrayBuffer))
}

function doDecodeOGG(
  stbvorbis: OGGDecoder,
  audioContext: AudioContext,
  arrayBuffer: ArrayBuffer
) {
  return new Promise<AudioBuffer>((resolve, reject) => {
    const buffers: Float32Array[][] = []
    let totalLength = 0
    let sampleRate: number
    stbvorbis.decode(arrayBuffer, function (e) {
      if (e.data) {
        sampleRate = e.sampleRate
        buffers.push(e.data)
        totalLength += e.data[0].length
      }
      if (e.error) {
        const error =
          e.error instanceof Error ? e.error : `stbvorbis.js Error: ${e.error}`
        reject(error)
      }
      if (e.eof) {
        resolve(createBuffer(audioContext, buffers, totalLength, sampleRate))
      }
    })
  })
}

async function createBuffer(
  audioContext: AudioContext,
  decodedChunks: Float32Array[][],
  length: number,
  sampleRate: number
) {
  if (!length) throw new Error(`stbvorbis.js Error: No length`)
  if (!sampleRate) throw new Error(`stbvorbis.js Error: No sample rate`)
  const numberOfChannels = decodedChunks[0].length
  const audioBuffer = audioContext.createBuffer(
    numberOfChannels,
    length,
    sampleRate
  )
  const channels: ChannelDataWriter[] = Array(audioBuffer.numberOfChannels)
    .fill(null)
    .map((_, ch) => new ChannelDataWriter(audioBuffer.getChannelData(ch)))
  for (const chunk of decodedChunks) {
    chunk.forEach((audioSamples, channelIndex) => {
      channels[channelIndex].write(audioSamples)
    })
  }
  return audioBuffer
}

class ChannelDataWriter {
  private offset = 0
  constructor(private data: Float32Array) {}
  write(audioSamples: Float32Array) {
    // iOS Safari does not support `buf.copyToChannel(a, ch, track[ch])`, so we had to copy audio data sample-by-sample.
    const { offset, data } = this
    for (let i = 0; i < audioSamples.length; i++) {
      data[i + offset] = audioSamples[i]
    }
    this.offset += audioSamples.length
  }
}
