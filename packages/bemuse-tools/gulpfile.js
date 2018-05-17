
var gulp = require('gulp')
var babel = require('gulp-babel')

gulp.task('default', ['compile', 'watch'])
gulp.task('compile', function () {
  return gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('lib'))
})
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['compile'])
})
