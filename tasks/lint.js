
import gulp             from 'gulp'
import gutil            from 'gulp-util'
import { javascripts }  from '../config/sources'
import eslint           from 'gulp-eslint'
import eslintUtil       from 'gulp-eslint/util'
import through2         from 'through2'

gulp.task('lint', function () {
  return gulp.src(javascripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslintFailOnError())
})

function eslintFailOnError () {
  let error = false
	return through2.obj(function (file, enc, callback) {
    if (file.eslint && file.eslint.messages &&
        file.eslint.messages.some(eslintUtil.isErrorMessage)) {
      error = new gutil.PluginError('tasks/lint', {
          name: 'ESLintError',
          message: 'ESLint Complained!!'})
    }
    callback(null, file)
  }, function (callback) {
    if (error) {
      callback(error)
    } else {
      callback()
    }
	})
}

