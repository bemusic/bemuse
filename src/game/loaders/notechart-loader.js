
import co from 'co'
import BMS from 'bms'

import Notechart                  from '../notechart'
import * as BmsonNotechartLoader  from 'bemuse/bmson/notechart-loader'

export class NotechartLoader {

  load(arraybuffer, resource, options) {
    if (resource.name.match(/\.bmson$/i)) {
      return this.loadBmson(arraybuffer, resource, options)
    } else {
      return this.loadBMS(arraybuffer, resource, options)
    }
  }

  loadBMS(arraybuffer, resource, options) {
    return co(function*() {
      let buffer        = new Buffer(new Uint8Array(arraybuffer))
      let source        = yield Promise.promisify(BMS.Reader.readAsync)(buffer)
      let compileResult = BMS.Compiler.compile(source)
      let chart         = compileResult.chart
      let notechart     = Notechart.fromBMSChart(chart, options)
      return notechart
    })
  }

  loadBmson(arraybuffer, resource, options) {
    return co(function*() {
      let buffer        = new Buffer(new Uint8Array(arraybuffer))
      let source        = buffer.toString('utf-8')
      return BmsonNotechartLoader.load(source)
    })
  }
}

export default NotechartLoader
