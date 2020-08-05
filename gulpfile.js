var { watch, src, dest, series, parallel } = require('gulp'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('autoprefixer-stylus'),
    jsImport = require('gulp-js-import'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon')

/* var gulp = require('gulp')

gulp.task('nodemon', function () {
    
}) */

const start = (done) => {
    nodemon({
        script: 'src/server.js',
        ext: 'js',
        env: { NODE_ENV: 'development' },
        done,
    })
}

function watchSrc() {
    watch('./src/assets/css/**/*.styl', css)
    watch(['./src/assets/js/**/*.js'], js)
}

const css = () => {
    return src('./src/assets/css/**/*.styl')
        .pipe(
            stylus({
                'include css': true,
                use: [autoprefixer('iOS >= 7', 'last 1 Chrome version')],
                compress: true,
                linenos: false,
                import: __dirname + '/src/assets/css/settings.styl',
            })
        )
        .pipe(rename('app.min.css'))
        .pipe(concat('app.min.css'))
        .pipe(dest('./src/public/css'))
}

const js = () => {
    return src(['./src/assets/js/**/*.js'], {
        sourcemaps: false,
    })
        .pipe(jsImport({ hideConsole: true }))
        .pipe(concat('scripts.js'))
        .pipe(
            minify({
                ext: {
                    src: '.js',
                    min: '.min.js',
                },
                exclude: ['tasks'],
                ignoreFiles: ['.combo.js', '-min.js'],
            })
        )
        .pipe(dest('./src/public/js', { sourcemaps: false }))
}

exports.js = js
exports.css = css
exports.start = start

exports.init = series(css, js, start)

exports.default = parallel(series(watchSrc), start)
