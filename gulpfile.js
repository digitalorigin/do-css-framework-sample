const gulp  = require('gulp');
const concat  = require('gulp-concat');
const sass  = require('gulp-sass');
const sassGlob  = require('gulp-sass-glob');
const autoprefixer  = require('gulp-autoprefixer');
const runSequence  = require('run-sequence');
const browserSync  = require('browser-sync');
const preprocess  = require('preprocess');

const config = {
    src: './src/',
    dest: './build/',
};

const sassConfig = {
    src: config.src + 'scss/**/*.scss',
    sassIncludePaths: ['node_modules/@digital-origin/do-css-framework/scss']
};

const htmlConfig = {
    src: config.src + '*.html',
};

gulp.task('start', function(cb) {
  runSequence(['sass'], ['html'], 'watch', cb);
});

gulp.task('html', function() {
  return gulp.src(htmlConfig.src)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});


gulp.task('sass', function () {
  return gulp.src(sassConfig.src)
    .pipe(sassGlob())
    .pipe(sass({
      sourceComments: true,
      outputStyle: 'nested',
      includePaths: sassConfig.sassIncludePaths
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'ie 8', 'safari 8']
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(config.dest))
});

gulp.task('browserSync', function() {

  const DEFAULT_FILE = 'index.html';
  // const ASSET_EXTENSION_REGEX = new RegExp(`\\b(?!\\?)\\.(${config.assetExtensions.join('|')})\\b(?!\\.)`, 'i');

  browserSync.init({
    open: false,
    server: {
      baseDir: config.dest,
    },
  	port: 3000,
  	ui: {
    	port: 3001
    },
    ghostMode: {
      links: false
    }
  });

});


gulp.task('watch', ['browserSync'], function() {
  gulp.watch(sassConfig.src,  function() { runSequence('sass', 'html') });
  gulp.watch(htmlConfig.src, ['html']);
});
