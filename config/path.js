'use strict'

const path = require('path')

const join = path.join
const dirname = path.dirname

module.exports = (...segments) => join(dirname(__dirname), ...segments)
