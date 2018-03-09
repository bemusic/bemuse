'use strict'

const path = require('path')

module.exports = (...segments) => path.resolve(process.cwd(), ...segments)
