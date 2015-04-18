
import gulp             from 'gulp'
import path             from '../config/path'
import { javascripts }  from '../config/sources'
import jshint           from 'gulp-jshint'
import jscs             from './support/jscs'
import through2         from 'through2'
import { relative }     from 'path'
import _                from 'lodash'
import fs               from 'fs'

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
  let linkTo = path => (text, extra) => {
    if (!process.env.TRAVIS_REPO_SLUG) return text
    let url = [
      'https://github.com',
      process.env.TRAVIS_REPO_SLUG,
      'blob',
      process.env.TRAVIS_COMMIT,
      path,
    ].join('/') + extra
    return `[${text}](${url})`
  }
  let problems = []
  return through2.obj(
    function(file, enc, cb) {
      if (!file.problems) return cb()
      let lines = []
      let filePath = relative(path(), file.path)
      let link = linkTo(filePath)
      lines.push('* ' + link(`__${filePath}__`, ''))
      for (var problem of _.sortBy(file.problems, 'line')) {
        lines.push([
          '    * ',
          link(`line ${problem.line}`, `#L${problem.line}`),
          `, col ${problem.col}`,
          ': ',
          `${problem.message} (${problem.code})`,
        ].join(''))
      }
      problems.push(...lines)
      cb()
    },
    function(cb) {
      if (problems.length === 0) return cb()
      let text = [
        'Hello! Thank you for sending us patches!',
        '',
        'I am an automated bot to lint pull requests ' +
          'to detect potential errors ' +
          'and check for consistent coding style, ' +
          'and I found some problems with your code submission ' +
          'in the commit ' + process.env.TRAVIS_COMMIT + ':',
        '',
      ]
      text.push(...problems)
      text.push(
        '',
        'Please fix these problems, rebase your commits, ' +
          'then leave a comment here ' +
          'so that a human can further review your patch.',
        '',
        'As an additional step to prevent future lint errors, ' +
          'please run `npm lint` before committing. ' +
          '[A Git pre-commit hook is available.][hook]',
        '',
        '[hook]: https://github.com/bemusic/bemuse#setup'
      )
      fs.writeFileSync('code-review-result.txt', text.join('\n'))
    }
  )
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

