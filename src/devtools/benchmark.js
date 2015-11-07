
import now from 'bemuse/utils/now'
import { shouldEnableBenchmark } from './query-flags'
import React from 'react'
import BenchmarkPanel from './ui/BenchmarkPanel'

function Stat () {
  let sum = 0
  let count = 0
  let average = 0
  let hist = []
  let lastSec = 0
  let secAvg = 0
  return {
    push: function (delta) {
      let t = now()
      sum += delta
      count += 1
      average = sum / count
      lastSec += delta
      hist.push({ delta, time: t })
      while (hist[0] && hist[0].time < t - 1000) {
        lastSec -= hist.shift().delta
      }
      secAvg = lastSec / hist.length
    },
    toString () {
      return format(average) + ' / ' + format(secAvg)
    },
  }
}

function format (x) {
  return x.toFixed(2) + 'ms'
}

function Benchmarker () {
  var stats = { }
  let bench = {
    enabled: true,
    stats,
    wrap (title, f) {
      return function () {
        try {
          var start = now()
          return f.apply(this, arguments)
        } finally {
          var finish = now()
          var stat = stats[title] || (stats[title] = new Stat(title))
          stat.push(finish - start)
        }
      }
    },
    benchmark (title, obj, name) {
      obj[name] = this.wrap(title, obj[name])
    },
    toString () {
      var lines = []
      Object.keys(stats).forEach(function (key) {
        lines.push('- ' + key + ': ' + stats[key])
      })
      return lines.join('\n')
    }
  }
  let div = document.createElement('div')
  div.setAttribute('style', 'position:fixed;top:10px;right:10px;z-index:99999')
  document.body.appendChild(div)
  React.render(<BenchmarkPanel bench={bench} />, div)
  return bench
}

function FakeBenchmarker () {
  return {
    enabled: false,
    wrap: (title, f) => f,
  }
}

export default window.BEMUSE_BENCHMARK =
    shouldEnableBenchmark() ? new Benchmarker() : new FakeBenchmarker()
