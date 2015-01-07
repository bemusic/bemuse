
import gulp   from 'gulp'
import deploy from 'gulp-gh-pages'
import path   from 'path'

gulp.task('deploy', function () {
  return gulp.src('dist/**/*')
    .pipe(deploy({
      cacheDir: path.resolve(__dirname, '../../www'),
      origin: 'www',
      branch: 'master',
    }))
})
