
import gulp             from 'gulp'
import { javascripts }  from '../config/sources'
import eslint           from 'gulp-eslint'

gulp.task('lint', function() {
  return gulp.src(javascripts)
    .pipe(eslint())
    .pipe(eslint.format())
})

