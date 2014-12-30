
import gulp             from 'gulp'
import path             from '../config/path'
import { javascripts }  from '../config/sources'
import jshint           from 'gulp-jshint'
import jscs             from './support/jscs'
import through2         from 'through2'
import { relative }     from 'path'
import R                from 'ramda'

gulp.task('code-review', function() {
  gulp.src(javascripts)
    .pipe(jshint())
    .pipe(jscs())
    .pipe(codeReview())
    .pipe(formatReviewMessage())
})

function codeReview() {
  return through2.obj(function(file, enc, cb) {
    let problems = []
    if (file.jshint) reviewJSHint(file.jshint, problems)
    if (file.jscs)   reviewJSCS(file.jscs, problems)
    if (problems.length > 0) {
      file.problems = problems
    }
    cb(null, file)
  })
}

function formatReviewMessage() {
  return through2.obj(function(file, enc, cb) {
    if (!file.problems) return cb(null, file)
    let lines = []
    lines.push('* __' + relative(path(), file.path) + '__')
    for (var problem of R.sortBy(R.prop('line'))(file.problems)) {
      lines.push([
        '    * ',
        `line ${problem.line}`,
        ': ',
        `${problem.message} (${problem.code})`,
      ].join(''))
    }
    console.log(lines.join('\n'))
    cb()
  })
}


function reviewJSHint(result, problems) {
  if (result.success) return
  for (let entry of result.results) {
    let err = entry.error
    let problem = {
      source:   'jshint',
      line:     err.line,
      col:      err.character,
      code:     err.code,
      message:  err.reason,
      evidence: err.evidence,
    }
    problems.push(problem)
  }
}

function reviewJSCS(errors, problems) {
  if (errors.isEmpty()) return
  for (let err of errors.getErrorList()) {
    let problem = {
      source:   'jscs',
      line:     err.line,
      col:      err.column,
      code:     err.rule,
      message:  err.message,
    }
    problems.push(problem)
  }
}

