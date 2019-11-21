"use strict";

const
  // modules
  gulp = require('gulp'),
  noop = require('gulp-noop'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  htmlclean = require('gulp-htmlclean'),
  concat = require('gulp-concat'),
  terser = require('gulp-terser'),
  stripdebug = require('gulp-strip-debug'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),

// folders
  src = 'src/',
  build = 'build/'
  ;

// Optimize Images
function images() {
  return gulp
    .src("./src/images/**/*")
    .pipe(newer("./build/images"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./build/images"));
}
exports.images = images;

// HTML processing
function html() {

  return gulp.src(src + '*.html')
    .pipe(newer(build))
    .pipe(htmlclean())
    .pipe(gulp.dest(build));
}
exports.html = html;

// JavaScript processing
function js() {

  return gulp.src(src + 'js/**/*')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(stripdebug())
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build + 'js/'));
}
exports.js = js;

// CSS processing
function css() {

  return gulp.src(src + 'scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: '/images/',
      precision: 3,
      errLogToConsole: true
    }).on('error', sass.logError))
    .pipe(postcss([
      assets({ loadPaths: ['images/'] }),
      autoprefixer,
      mqpacker,
      cssnano
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(build + 'css/'));
}
exports.css = gulp.series(images, css);

// watch for file changes
function watch(done) {

  // image changes
  gulp.watch(src + 'images/**/*', images);

  // html changes
  gulp.watch(src + '*.html', html);

  // css changes
  gulp.watch(src + 'scss/**/*', css);

  // js changes
  gulp.watch(src + 'js/**/*', js);

  done();

}
exports.watch = watch;

// define tasks
const taskList = gulp.parallel(exports.html, exports.js, exports.css);
exports.build = taskList;

// default task
exports.default = gulp.series(exports.build, exports.watch);