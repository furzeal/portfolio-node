'use strict';
// Modules

var parallax = (function () {
    var bg = document.querySelector('.l-developer__bg'),
        user = document.querySelector('.l-developer__container');

    return {
        move: function (block, windowScroll, strafeCoefficient) {
            var strafe = -(windowScroll / strafeCoefficient) + '%';
            var style = block.style;
            // Var for rendering by video processor (z-axis)
            var transformString = 'translate3d(0, ' + strafe + ', 0)';
            style.transform = transformString;
            style.webkitTransform = transformString;
        },
        init: function (winScroll) {
            this.move(bg, winScroll, 100);
            this.move(user, winScroll, 7);
        }
    }
})();

// Events
window.onscroll = function () {
    var winScroll = window.pageYOffset;

    parallax.init(winScroll);
}
