import gulp from 'gulp'

gulp.task('pre-commit', gulp.series('lint'))
