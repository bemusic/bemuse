import BMS from 'bms'
import * as BMSNotechartLoader from './BMSNotechartLoader'
import * as BmsonNotechartLoader from './BmsonNotechartLoader'
import Promise from 'bluebird'

const coerceToBuffer = bufferOrArrayBuffer =>
  Buffer.isBuffer(bufferOrArrayBuffer)
    ? bufferOrArrayBuffer
    : Buffer.from(new Uint8Array(bufferOrArrayBuffer))

export class NotechartLoader {
  load (arraybuffer, resource, options) {
    if (resource.name.match(/\.bmson$/i)) {
      return this.loadBmson(arraybuffer, resource, options)
    } else {
      return this.loadBMS(arraybuffer, resource, options)
    }
  }

  async loadBMS (arraybuffer, resource, options) {
    let buffer = coerceToBuffer(arraybuffer)
    let source = await Promise.promisify(BMS.Reader.readAsync)(buffer)
    let compileResult = BMS.Compiler.compile(source)
    let chart = compileResult.chart
    let notechart = BMSNotechartLoader.fromBMSChart(chart, options)
    return notechart
  }

  async loadBmson (arraybuffer, resource, options) {
    let buffer = coerceToBuffer(arraybuffer)
    let source = buffer.toString('utf-8')
    return BmsonNotechartLoader.load(source, options)
  }
}

export default NotechartLoader
