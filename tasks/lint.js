
import gulp             from 'gulp'
import { javascripts }  from '../config/sources'
import jshint           from 'gulp-jshint'
import jscs             from './support/jscs'

gulp.task('lint', ['lint:jshint', 'lint:jscs'])

gulp.task('lint:jshint', function() {
  return gulp.src(javascripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe(jshint.reporter('fail'))
})

gulp.task('lint:jscs', function() {
  return gulp.src(javascripts)
    .pipe(jscs())
    .pipe(jscs.report())
})
