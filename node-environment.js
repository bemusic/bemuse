'use strict'

require('babel-polyfill')

require('babel-register')({
  plugins: [ '__coverage__' ]
})
