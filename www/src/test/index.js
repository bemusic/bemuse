
// This file boots up Jasmine
//
import '6to5/polyfill'
import 'jasmine/jasmine.js'

var jasmineRequire = window.jasmineRequire = getJasmineRequireObj()
var jasmine = window.jasmine = jasmineRequire.core(jasmineRequire)
jasmineRequire.core(jasmineRequire)

var env = jasmine.getEnv()
var jasmineInterface = jasmineRequire.interface(jasmine, env)
Object.assign(window, jasmineInterface)

// Report as pretty HTML
//
import 'jasmine/jasmine-html'
import 'jasmine/jasmine.css'
jasmineRequire.html(jasmine)
var htmlReporter = new jasmine.HtmlReporter({
  env: env,
  onRaiseExceptionsClick: function() { queryString.setParam("catch", !env.catchingExceptions()); },
  getContainer: function() { return document.body; },
  createElement: function() { return document.createElement.apply(document, arguments); },
  createTextNode: function() { return document.createTextNode.apply(document, arguments); },
  timer: new jasmine.Timer()
})

// Use QueryString for options.
//
var queryString = new jasmine.QueryString({
  getWindowLocation: function() { return window.location; }
})
var catchingExceptions = queryString.getParam("catch");
env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

// Add those reporters!
//
env.addReporter(jasmineInterface.jsApiReporter)
env.addReporter(htmlReporter)

var specFilter = new jasmine.HtmlSpecFilter({
  filterString: function() { return queryString.getParam("spec") }
})

env.specFilter = function(spec) {
  return specFilter.matches(spec.getFullName());
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
