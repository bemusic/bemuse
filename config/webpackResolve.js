'use strict'

const path = require('./path')

module.exports = {
  alias: {
    bemuse: path('src')
  },
  extensions: ['.webpack.js', '.web.js', '.js', '.jsx']
}
