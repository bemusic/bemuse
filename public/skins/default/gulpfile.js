
var gulp = require('gulp')
var jade = require('jade')
var fs   = require('fs')
var yaml = require('js-yaml')

function createCompiler(template, globals) {
  return function compile(outName, localsToAdd) {
    var locals = Object.create(globals)
    for (var i in localsToAdd) locals[i] = localsToAdd[i]
    fs.writeFileSync(outName, template(locals))
  }
}

gulp.task('compile', function() {
  var globals   = yaml.safeLoad(fs.readFileSync('skin_data.yml', 'utf8'))
  var template  = jade.compileFile('skin_template.jade', { pretty: true })
  var compile   = createCompiler(template, globals)
  compile('skin.xml', { })
})

var sources = [
      '*.jade',
      '*.yml',
    ]

gulp.task('watch', function() {
  gulp.watch(sources, ['compile'])
})

gulp.task('default', ['compile', 'watch'])
