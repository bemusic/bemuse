import * as BMS from 'bms'
import * as BMSNotechartLoader from './BMSNotechartLoader'
import * as BmsonNotechartLoader from './BmsonNotechartLoader'
import Bluebird from 'bluebird'
import { PlayerOptions } from '../types'

const coerceToBuffer = (bufferOrArrayBuffer: Buffer | ArrayBuffer) =>
  Buffer.isBuffer(bufferOrArrayBuffer)
    ? bufferOrArrayBuffer
    : Buffer.from(new Uint8Array(bufferOrArrayBuffer))

interface NotechartLoaderResource {
  name: string
}

export class NotechartLoader {
  load(
    arraybuffer: Buffer | ArrayBuffer,
    resource: NotechartLoaderResource,
    options: PlayerOptions
  ) {
    if (resource.name.match(/\.bmson$/i)) {
      return this.loadBmson(arraybuffer, resource, options)
    } else {
      return this.loadBMS(arraybuffer, resource, options)
    }
  }

  async loadBMS(
    arraybuffer: Buffer | ArrayBuffer,
    resource: NotechartLoaderResource,
    options: PlayerOptions
  ) {
    const buffer = coerceToBuffer(arraybuffer)
    const readerOptions = BMS.Reader.getReaderOptionsFromFilename(resource.name)
    const source = await Bluebird.promisify<string, Buffer, BMS.ReaderOptions>(
      BMS.Reader.readAsync
    )(buffer, readerOptions)
    const compileResult = BMS.Compiler.compile(source)
    const chart = compileResult.chart
    const notechart = BMSNotechartLoader.fromBMSChart(chart, options)
    return notechart
  }

  async loadBmson(
    arraybuffer: Buffer | ArrayBuffer,
    resource: NotechartLoaderResource,
    options: PlayerOptions
  ) {
    const buffer = coerceToBuffer(arraybuffer)
    const source = buffer.toString('utf-8')
    return BmsonNotechartLoader.load(source, options)
  }
}

export default NotechartLoader
