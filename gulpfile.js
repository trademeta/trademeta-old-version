var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    concat = require('gulp-concat'),
    rename=require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    replace = require('gulp-replace'),
    gulpif = require('gulp-if'),
    cache = require('gulp-cache'),
    del = require('del'),
    path = require('path');

gulp.task('sass',function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
});

gulp.task('css',function () {
    return gulp.src('src/css/*.css')
        .pipe(gulp.dest('app/css'))
});

gulp.task('css:prefix',function () {
    return gulp.src('app/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
});

gulp.task('css:min',function () {
    return gulp.src('app/css/*.css')
        .pipe(gulpif(function (file) {
            return file.basename.indexOf('.min') < 0
        }, cssmin()))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('scripts',function () {
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('app/js'))
});

gulp.task('scripts:min',function () {
    return gulp.src(['src/js/*.js','!src/js/script.js','src/js/script.js'])
        .pipe(gulpif(function (file) {
            return file.basename.indexOf('.min') < 0
        }, uglify()))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('jade',function () {
    return gulp.src('src/jade/*.jade')
        .pipe(jade({pretty:true}))
        .pipe(gulp.dest('app'))
});

gulp.task('html:min',function () {
    return gulp.src('src/jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('dist'))
});
//Изменение списка подключаемых стилей на один сгруппированный стиль
gulp.task('replace:css',function () {
    return gulp.src('src/jade/includes/template.jade')
        .pipe(replace('include ../additional/allcss','include ../additional/single-css'))
        .pipe(gulp.dest('src/jade/includes'))
});
//Изменение списка подключаемых скриптов на один сгруппированный скрипт
gulp.task('replace:script',function () {
    return gulp.src('src/jade/index.jade')
        .pipe(replace('include additional/allscripts','include additional/single-script'))
        .pipe(gulp.dest('src/jade'))
});

gulp.task('img',function () {
    return gulp.src('src/img/**/*', {since: gulp.lastRun('img')})
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('app/img'))
});

gulp.task('img:dist',function () {
    return gulp.src('app/img/*')
        .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts:app',function () {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('app/fonts'))
});

gulp.task('fonts:dist',function () {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('php:app',function () {
    return gulp.src('src/php/*')
        .pipe(gulp.dest('app/php'))
});

gulp.task('php:dist',function () {
    return gulp.src('src/php/*')
        .pipe(gulp.dest('dist/php'))
});

gulp.task('serve',function () {
    browserSync.init({
        server: 'app'
    });
    browserSync.watch('app/**/*').on('change', browserSync.reload);
});

gulp.task('clean',function () {
    return del(['app/*','dist/*']);
});

gulp.task('watch',function () {
    gulp.watch('src/scss/*.scss', gulp.series('sass'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
    gulp.watch('src/jade/**/*.jade', gulp.series('jade'));
});

gulp.task('default',gulp.parallel('watch', 'serve'));
gulp.task('app',gulp.series('img','fonts:app','php:app','sass','css','scripts','jade', gulp.parallel('watch', 'serve')));
gulp.task('build',gulp.series('fonts:dist','php:dist','img:dist','css:prefix','css:min','scripts:min','replace:css','replace:script','html:min'));

