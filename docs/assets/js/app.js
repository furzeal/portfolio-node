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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG4vLyBNb2R1bGVzXHJcblxyXG52YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmwtZGV2ZWxvcGVyX19iZycpLFxyXG4gICAgICAgIHVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubC1kZXZlbG9wZXJfX2NvbnRhaW5lcicpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbW92ZTogZnVuY3Rpb24gKGJsb2NrLCB3aW5kb3dTY3JvbGwsIHN0cmFmZUNvZWZmaWNpZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBzdHJhZmUgPSAtKHdpbmRvd1Njcm9sbCAvIHN0cmFmZUNvZWZmaWNpZW50KSArICclJztcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gYmxvY2suc3R5bGU7XHJcbiAgICAgICAgICAgIC8vIFZhciBmb3IgcmVuZGVyaW5nIGJ5IHZpZGVvIHByb2Nlc3NvciAoei1heGlzKVxyXG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyBzdHJhZmUgKyAnLCAwKSc7XHJcbiAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuICAgICAgICAgICAgc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHdpblNjcm9sbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoYmcsIHdpblNjcm9sbCwgMTAwKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHVzZXIsIHdpblNjcm9sbCwgNyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuLy8gRXZlbnRzXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3aW5TY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG4gICAgcGFyYWxsYXguaW5pdCh3aW5TY3JvbGwpO1xyXG59XHJcbiJdfQ==
