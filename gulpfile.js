
var gulp = require('gulp')
var babel = require('gulp-babel')
var BABEL_OPTIONS = { plugins: ['babel-plugin-espower'] }

gulp.task('default', ['compile', 'compile-spec', 'watch'])

gulp.task('compile', function () {
  return gulp.src('src/**/*.js').pipe(babel(BABEL_OPTIONS)).pipe(gulp.dest('lib'))
})

gulp.task('compile-spec', function () {
  return gulp.src('spec/**/*.js').pipe(babel(BABEL_OPTIONS)).pipe(gulp.dest('test'))
})

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['compile'])
  gulp.watch('spec/**/*.js', ['compile-spec'])
})
