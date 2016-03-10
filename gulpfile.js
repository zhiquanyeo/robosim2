// Include gulp
var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Compile SASS
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('deploy/css'))
        .pipe(gulp.dest('debug/css'));
});

gulp.task('build-js', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('robosim2.js'))
        .pipe(gulp.dest('debug/js'))
        .pipe(rename('robosim2.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('deploy/js'));
});

// Copy libs
gulp.task('copy-libs', function() {
    return gulp.src('src/libs/*.js')
        .pipe(gulp.dest('deploy/js'))
        .pipe(gulp.dest('debug/js'));
});

gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint', 'build-js', 'copy-libs']);
    gulp.watch('src/scss/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'sass', 'build-js', 'copy-libs']);
