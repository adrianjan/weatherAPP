const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const watch = () =>{
  browserSync.init({
    server: {
     baseDir: "./dist"
   }
  });
  gulp.watch('./src/*.scss').on('change', browserSync.reload);
  gulp.watch('./src/*.js').on('change', browserSync.reload);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
};

exports.watch = watch;
