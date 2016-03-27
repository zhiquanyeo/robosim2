// Include gulp
var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var del = require('del');
var runSequence = require('run-sequence');


// Locations
var JS_DIR = 'js';
var JS_LIB_DIR = 'js/libs';
var CSS_DIR = 'css';


// Copy tasks
var COPY_LIB_TASK_PREFIX = 'copy-libs-';

var LIB_LIST = ['jquery', 'jqueryui'];

// Generate the list of libs
var COPY_LIB_TASKS_DEV = [];
var COPY_LIB_TASKS_PROD = [];

for (var i = 0; i < LIB_LIST.length; i++) {
    COPY_LIB_TASKS_DEV.push(COPY_LIB_TASK_PREFIX + 'dev-' + LIB_LIST[i]);
    COPY_LIB_TASKS_PROD.push(COPY_LIB_TASK_PREFIX + 'prod-' + LIB_LIST[i]);
}

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

gulp.task('build-app:dev', function () {
    return gulp.src('src/js/*.js')
           .pipe(concat('robosim2.js'))
           .pipe(gulp.dest('debug/js'));
});

gulp.task('build-app:prod', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('robosim2.js'))
        .pipe(rename('robosim2.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('deploy/js'));
});

gulp.task('build-app:all', ['build-app:dev', 'build-app:prod']);

// <<< BEGIN SECTION lib-copy >>>
// === Library Copy Routines for various libs ===
// -- jQuery
gulp.task('copy-libs-dev-jquery', function () {
    return gulp.src('src/libs/jquery/jquery.js')
           .pipe(gulp.dest('debug/' + JS_LIB_DIR)); 
});

gulp.task('copy-libs-prod-jquery', function () {
    return gulp.src('src/libs/jquery/jquery.min.js')
           .pipe(gulp.dest('deploy/' + JS_LIB_DIR));
});

// -- jQueryUI
gulp.task('copy-libs-dev-jqueryui-js', function () {
    return gulp.src('src/libs/jquery-ui/jquery-ui.js')
           .pipe(gulp.dest('debug/' + JS_LIB_DIR)); 
});

gulp.task('copy-libs-dev-jqueryui-css', function () {
    return gulp.src(['src/libs/jquery-ui/*.css', '!src/libs/jquery-ui/*.min.css'])
           .pipe(gulp.dest('debug/' + CSS_DIR));
});

gulp.task('copy-libs-prod-jqueryui-js', function () {
    return gulp.src('src/libs/jquery-ui/jquery-ui.min.js')
           .pipe(gulp.dest('deploy/' + JS_LIB_DIR)); 
});

gulp.task('copy-libs-prod-jqueryui-css', function () {
    return gulp.src('src/libs/jquery-ui/*.min.css')
           .pipe(gulp.dest('deploy/' + CSS_DIR));
});

gulp.task('copy-libs-dev-jqueryui', ['copy-libs-dev-jqueryui-js', 'copy-libs-dev-jqueryui-css']);
gulp.task('copy-libs-prod-jqueryui', ['copy-libs-prod-jqueryui-js', 'copy-libs-prod-jqueryui-css']);


// Finally, the overarching lib copying tasks
gulp.task('copy-libs:dev', COPY_LIB_TASKS_DEV);
gulp.task('copy-libs:prod', COPY_LIB_TASKS_PROD);
// <<< END SECTION lib-copy >>>

gulp.task('copy-libs:all', ['copy-libs:dev', 'copy-libs:prod']);

gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['lint', 'build-app:all', 'copy-libs:all']);
    gulp.watch('src/scss/*.scss', ['sass']);
});

gulp.task('copy-html:dev', function () {
    return gulp.src('./index.html')
           .pipe(gulp.dest('debug')); 
});

gulp.task('copy-html:prod', function () {
    return gulp.src('./index.html')
           .pipe(gulp.dest('deploy')); 
});

gulp.task('copy-html:all', ['copy-html:dev', 'copy-html:prod']);

// Building involves injecting the relevant files
gulp.task('build:dev', ['copy-libs:dev', 'copy-html:dev', 'build-app:dev'], function () {
    return gulp.src('./debug/index.html')
           .pipe(inject(gulp.src('./debug/' + JS_LIB_DIR + '/*.js', {read: false, base: './debug'}), {name: 'jslibs', relative: true}))
           .pipe(inject(gulp.src('./debug/' + CSS_DIR + '/*.css', {read: false, base: './debug'}), {relative: true}))
           .pipe(inject(gulp.src('./debug/' + JS_DIR, {read: false, base: './debug'}), {name: 'jsapp', relative: true}))
           .pipe(gulp.dest('./debug'));
});

gulp.task('build:prod', ['copy-libs:prod', 'copy-html:prod', 'build-app:prod'], function () {
    return gulp.src('./deploy/index.html')
           .pipe(inject(gulp.src('./deploy/' + JS_LIB_DIR + '/*.js', {read: false, base: './deploy'}), {name: 'jslibs', relative: true}))
           .pipe(inject(gulp.src('./deploy/' + CSS_DIR + '/*.css', {read: false, base: './deploy'}), {relative: true}))
           .pipe(inject(gulp.src('./deploy/' + JS_DIR, {read: false, base: './deploy'}), {name: 'jsapp', relative: true}))
           .pipe(gulp.dest('./deploy'));
});

// Build task - Build JS file for dev/prod, copy libs, build HTML 
gulp.task('build:all', ['build:dev', 'build:prod']);

gulp.task('clean:dev', function () {
    return del([
        'debug/**/*'
    ]);
});

gulp.task('clean:prod', function () {
    return del([
        'deploy/**/*'
    ]);
});

gulp.task('clean:all', ['clean:dev', 'clean:prod']);

gulp.task('default', ['lint', 'sass', 'build-app:all', 'copy-libs:all']);
