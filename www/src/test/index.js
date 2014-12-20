
// This file boots up Jasmine
//
import 'jasmine/jasmine.js'
import 'jasmine/jasmine.css'

var jasmineRequire = window.jasmineRequire = getJasmineRequireObj()
import 'jasmine/jasmine-html'

var jasmine = window.jasmine = jasmineRequire.core(jasmineRequire)
jasmineRequire.core(jasmineRequire)
jasmineRequire.html(jasmine)

var env = jasmine.getEnv()
var jasmineInterface = jasmineRequire.interface(jasmine, env)

Object.assign(window, jasmineInterface)

var queryString = new jasmine.QueryString({
  getWindowLocation: function() { return window.location; }
})

var catchingExceptions = queryString.getParam("catch");
env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

var htmlReporter = new jasmine.HtmlReporter({
  env: env,
  onRaiseExceptionsClick: function() { queryString.setParam("catch", !env.catchingExceptions()); },
  getContainer: function() { return document.body; },
  createElement: function() { return document.createElement.apply(document, arguments); },
  createTextNode: function() { return document.createTextNode.apply(document, arguments); },
  timer: new jasmine.Timer()
})

env.addReporter(jasmineInterface.jsApiReporter);
env.addReporter(htmlReporter);

var specFilter = new jasmine.HtmlSpecFilter({
  filterString: function() { return queryString.getParam("spec") }
})

env.specFilter = function(spec) {
  return specFilter.matches(spec.getFullName());
}

// Allow timing functions to be overridden.
// Certain browsers (Safari, IE 8, phantomjs) require this hack.
window.setTimeout = window.setTimeout
window.setInterval = window.setInterval
window.clearTimeout = window.clearTimeout
window.clearInterval = window.clearInterval

import 'val!./load.js'

htmlReporter.initialize()
env.execute()

