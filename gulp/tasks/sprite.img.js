'use strict';

module.exports = function () {
  $.gulp.task('sprite:img', function () {
    var spriteData = $.gulp.src('./source/sprite/*.{png,gif,jpg,jpeg}')
    //var spriteData = $.gulp.src('./source/sprite/\*.\*')
      .pipe($.gp.spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss'
      }));

    // Pipe image stream onto disk
    var imgStream = spriteData.img
      .pipe($.gulp.dest($.config.root + '/assets/img'));

    // Pipe SCSS stream onto disk
    var cssStream = spriteData.css
      .pipe($.gulp.dest('./source/style/common'));

    // Return a merged stream to handle both `end` events
    return $.merge(imgStream, cssStream);
  })
};
