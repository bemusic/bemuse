
// This file boots up Jasmine
//
import '../polyfill'
import 'jasmine/jasmine.js'

var jasmineRequire = window.jasmineRequire = getJasmineRequireObj()
var jasmine = window.jasmine = jasmineRequire.core(jasmineRequire)
jasmineRequire.core(jasmineRequire)

var env = jasmine.getEnv()
var jasmineInterface = jasmineRequire.interface(jasmine, env)
Object.assign(window, jasmineInterface)

// Import the HTML reporter and QueryString library
//
import 'jasmine/jasmine-html'
import 'jasmine/jasmine.css'
jasmineRequire.html(jasmine)

// Import the query string parser
//
var queryString = new jasmine.QueryString({
  getWindowLocation() { return window.location }
})

// Report as pretty HTML
//
var htmlReporter = new jasmine.HtmlReporter({
  env: env,
  onRaiseExceptionsClick() {
    queryString.setParam('catch', !env.catchingExceptions())
  },
  getContainer() {
    return document.body
  },
  createElement() {
    return document.createElement.apply(document, arguments)
  },
  createTextNode() {
    return document.createTextNode.apply(document, arguments)
  },
  timer: new jasmine.Timer(),
})

// Catch exceptions based on queryString
//
var catchingExceptions = queryString.getParam('catch')
env.catchExceptions(
  typeof catchingExceptions === 'undefined' ?  true : catchingExceptions)

// Add those reporters!
//
env.addReporter(jasmineInterface.jsApiReporter)
env.addReporter(htmlReporter)
env.addReporter({
  jasmineDone() {
    setTimeout(function() {
      let specs = jsApiReporter.specs()
      let coverage = window.__coverage__ || null
      let json = JSON.stringify({ specs, coverage })
      let xh = new XMLHttpRequest()
      xh.open('POST', '/api/test', true)
      xh.setRequestHeader('Content-Type', 'application/json')
      xh.send(json)
    })
  }
})

var specFilter = new jasmine.HtmlSpecFilter({
  filterString() {
    return queryString.getParam('spec')
  }
})

env.specFilter = function(spec) {
  return specFilter.matches(spec.getFullName())
}

// Allow timing functions to be overridden.
// Certain browsers (Safari, IE 8, phantomjs) require this hack.
//
window.setTimeout = window.setTimeout
window.setInterval = window.setInterval
window.clearTimeout = window.clearTimeout
window.clearInterval = window.clearInterval

import 'val!./load.js'

htmlReporter.initialize()
env.execute()
