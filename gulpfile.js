'use strick'

// components gulp
var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');
var imagemin   = require('gulp-imagemin');

// start server reload
livereload.listen();


// path to the resources
var rootDir = '.';
var sourceDir = rootDir + '/src'; // здесь хранятся все исходники
var destDir = rootDir + '/build/development'; // здесь хранится все на выходе

// блок с настройками компонентов
// здесь я храню настройки для задач
// удалил отсюда все кроме scripts для наглядности
var components = {
  scripts: {
    source: sourceDir + '/scripts/scripts.js',
    dest: destDir + '/scripts',    
    watchJS: sourceDir + '/scripts/**/*.js',
    options: {
      paths: ['./node_modules', sourceDir],
      debug: true,
      fullPaths: true
    }
  },
  jade: {
    source: sourceDir + '/templates/index.jade',
    dest: destDir,
    watchHTML: sourceDir + '/templates/**/*.jade'
  },
  sass: {
    source: sourceDir + '/sass/main.scss',   
    dest: destDir + '/style',
    watchCSS: sourceDir + '/sass/**/*.scss'
  },
  files: {
    source: sourceDir + '/files',
    dest: destDir + '/files',
    watchFils: sourceDir + '/files'
  }
 
};


/**
 * Error handler 
 * @param e
 */
var error = function (e) {
  console.error('Error in plugin "' + e.plugin + '"');
  console.error('   "' + e.message + '"');
  console.error('   In file "' + e.fileName + '", line "' + e.lineNumber + '".');
  console.log('--------------------------------------');
  console.log(e);
};



//DEVELOPMENT
// jade compiller
gulp.task('jade', function() {
    return gulp.src(components.jade.source)
        .pipe(jade({pretty:true}).on('error', error)) 
        .pipe(gulp.dest(components.jade.dest))
        .pipe(livereload());
});

// sass compiller
gulp.task('sass', function () {
  return gulp.src(components.sass.source)
    .pipe(sass().on('error', error))
    .pipe(gulp.dest(components.sass.dest))
    .pipe(livereload());
});


// scripts compiller
gulp.task('scripts', function () {
  return gulp.src(components.scripts.source)
    .pipe(browserify(components.scripts.options).on('error', error))
    .pipe(gulp.dest(components.scripts.dest))
    .pipe(livereload());
});

// compress image
gulp.task('imagemin', function(){
    return gulp.src(components.files.source + '/images/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(components.files.dest + '/images'))
        .pipe(livereload());;
});

// watch changes in the files
gulp.task('watch', ['jade', 'sass', 'scripts', 'imagemin'], function () {
  gulp.watch(components.jade.watchHTML, ['jade']);
  gulp.watch(components.sass.watchCSS, ['sass']);
  gulp.watch(components.scripts.watchJS, ['scripts']);
  gulp.watch(components.scripts.watchFils + '/images/**/*.*', ['imagemin']);
});

// PRODUCTION
