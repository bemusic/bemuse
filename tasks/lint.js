
import gulp             from 'gulp'
import path             from '../config/path'
import jshint           from 'gulp-jshint'
import jscs             from './support/jscs'

let paths = {
  scripts: [
    path('src', '**', '*.js'),
    path('tasks', '**', '*.js'),
    path('config', '**', '*.js'),
  ]
}

gulp.task('lint', ['lint:jshint', 'lint:jscs'])

gulp.task('lint:jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
})

gulp.task('lint:jscs', function() {
  return gulp.src(paths.scripts)
    .pipe(jscs())
    .pipe(jscs.report())
})
