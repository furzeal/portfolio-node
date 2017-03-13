'use strict';

global.$ = {
  package: require('./package.json'),
  config: require('./gulp/config'),
  path: {
    task: require('./gulp/paths/tasks.js'),
    jsFoundation: require('./gulp/paths/js.foundation.js'),
    cssFoundation: require('./gulp/paths/css.foundation.js'),
    app: require('./gulp/paths/app.js')
  },
  gulp: require('gulp'),
  del: require('del'),
  merge: require('merge-stream'),
  browserSync: require('browser-sync').create(),
  nodemon: require('nodemon'),
  gp: require('gulp-load-plugins')()
};

$.path.task.forEach(function(taskPath) {
  require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
  'clean',
  'sprite:img',
  $.gulp.parallel(
    'sass',
    'js:foundation',
    'js:process',
    'copy:image',
    'copy:icon',
    'copy:font',
    'css:foundation',
    'sprite:svg'
  ),
  $.gulp.parallel(
    'nodemon'
  ),
  $.gulp.parallel(
    'watch',
    'serve'
  )
));
