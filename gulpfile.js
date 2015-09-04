
var gulp = require('gulp')
var babel = require('gulp-babel')

gulp.task('default', ['compile', 'compile-spec', 'watch'])
gulp.task('compile', function () {
  return gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('.'))
})
gulp.task('compile-spec', function () {
  return gulp.src('spec/**/*.js').pipe(babel()).pipe(gulp.dest('test'))
})
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['compile'])
  gulp.watch('spec/**/*.js', ['compile-spec'])
})
