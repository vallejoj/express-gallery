const gulp = require('gulp')
const scss = require('gulp-sass')
const browserSync = require('browser-sync').create()

browserSync.init({
   startPath: '/gallery',
    proxy: 'localhost:8000'
});


gulp.task('scss', function () {
  return gulp.src('./scss/*.scss')
    .pipe(scss())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function (){
  gulp.watch('./scss/**/*', ['scss'])
  gulp.watch('./public/**/*').on('change', browserSync.reload);
})

gulp.task('default', ['watch']);
