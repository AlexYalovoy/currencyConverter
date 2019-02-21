var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

gulp.task('server', function(done) {
  return browserSync({
    server: {
      baseDir: './build'
    }
  }, done);
});

gulp.task('bs-reload', function(done) {
  browserSync.reload();
  done();
});



gulp.task('build:html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('build:js', function() {
  return gulp.src('src/js/*.js')
  .pipe(concat('index.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/'));
});

gulp.task('build:css', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', gulp.series('build:html', 'build:css', 'build:js'));

gulp.task('default', gulp.parallel('server', function(done) {
  gulp.watch(['./src/*.html'], gulp.series('build:html', 'bs-reload'));
  gulp.watch(['./src/js/*.js'], gulp.series('build:js', 'bs-reload'));
  gulp.watch(['./src/scss/*.scss'], gulp.series('build:css', 'bs-reload'));
}));