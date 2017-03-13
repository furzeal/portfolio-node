'use strict';

module.exports = function() {
  $.gulp.task('copy:icon', function() {
    return $.gulp.src('./source/favicon.*', { since: $.gulp.lastRun('copy:icon') })
      .pipe($.gulp.dest($.config.root));
  });
};
