const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const browserSync = require('browser-sync');
const flatten = require('gulp-flatten');


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
    .pipe(flatten())
    .pipe(gulp.dest('./build/'));
});

// Development build

gulp.task('build-dev:js', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build-dev:css', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build/'));
});

gulp.task('build-dev', gulp.series('build:html', 'build-dev:css', 'build-dev:js'));

// Production build

gulp.task('build-prod:js', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('index.js'))
    .pipe(terser())
    .pipe(gulp.dest('./build/'));
});

gulp.task('build-prod:css', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./build/'));
});

gulp.task('build-prod', gulp.series('build:html', 'build-prod:css', 'build-prod:js'));

gulp.task('default', gulp.series('build-dev', 'server', function() {
  gulp.watch(['./src/**/*.html'], gulp.series('build:html', 'bs-reload'));
  gulp.watch(['./src/**/*.js'], gulp.series('build-dev:js', 'bs-reload'));
  gulp.watch(['./src/scss/*.scss'], gulp.series('build-dev:css', 'bs-reload'));
}));