'use strict';
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Forms
// Mail Form
var mailForm = document.querySelector('#mail-form');

if (mailForm) {
    mailForm.addEventListener('submit', prepareSendMail);
}

function prepareSendMail(e) {
    e.preventDefault();
    var form = $(this);
    var popup = $('.l-section__popup');
    var resultContainer = popup.find('.l-section__status');
    var data = {
        username: mailForm.username.value,
        email: mailForm.email.value,
        message: mailForm.message.value
    };
    resultContainer.text('Отправка сообщения...');
    popup.delay(200).fadeIn(1000);
    sendAjaxJson('works', data, function (data) {
        console.log(data);
        resultContainer.text(data);
        popup.fadeOut(1000);
        form[0].reset();
    });
}


function sendAjaxJson(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result.status);
    };
    xhr.send(JSON.stringify(data));
}

function sendGetAjaxJson(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result);
    };
    xhr.send(JSON.stringify(data));
}


// Modules
var parallax = (function () {
    var bg = document.querySelector('.l-parallax__bg'),
        user = document.querySelector('.l-developer__container .c-user'),
        userBg = document.querySelector('.l-developer__container .c-developer__bg');

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
            if (user == null) {
                return;
            }
            console.log($(window).innerWidth());
            if ($(window).innerWidth() > 768) {
                this.move(bg, winScroll, 100);
                this.move(user, -winScroll, 9);
                this.move(userBg, -winScroll, 13);
            }
        }
    }
})();


var skills = (function () {
    var skillGroups = null;
    return {
        init: function () {
            skillGroups = $('.c-skills__group');
            console.log(skillGroups);
            if (skillGroups.length === 0) {
                return;
            }
            skillGroups.each(function (i, skillGroup) {
                var skillItems = $(skillGroup).find('.c-skill__circle_outer');
                skillItems.each(function (i, skill) {
                    skill.value = $(skill).attr('stroke-dashoffset');
                    $(skill).attr('stroke-dashoffset', '100');
                });
            });
        },
        grow: function (wScroll) {
            if (skillGroups.length === 0)
                return;
            var windowMargin = window.innerHeight * 0.9;
            skillGroups.each(function (i, skillGroup) {
                var groupOffset = skillGroup.getBoundingClientRect().top;
                console.log('wScroll:' + wScroll);
                console.log('windowMargin:' + windowMargin);
                console.log('groupOffset:' + groupOffset);
                //var startAnimate = wScroll - groupOffset + windowMargin;
                var startAnimate = -groupOffset + windowMargin;
                console.log('startAnimate:' + startAnimate);
                var pixelsElapsed = groupOffset - wScroll;
                var percentsElapsed = 100 - Math.ceil(pixelsElapsed / windowMargin * 100);
                // 100/100 because we have 100 dasharray. It can be different!
                var percentsDrawn = 100 / 100 * percentsElapsed;
                var skillItems = $(skillGroup).find('.c-skill__circle_outer');
                if (startAnimate >= 0) {
                    var drawAmount = 100 - percentsDrawn;
                    skillItems.each(function (i, skill) {
                        var value = 100 - parseInt(skill.value);
                        var skillOpacity = value / 200 + 0.6;
                        if (skillOpacity >= 1) {
                            skillOpacity = 1
                        }
                        skill.setAttribute('stroke-dashoffset', skill.value);
                        $(skill).css('opacity', skillOpacity);
                    });
                } else {
                    skillItems.each(function (i, skill) {
                        skill.setAttribute('stroke-dashoffset', '100');
                    });
                }
            });
        }
    };
})();

// map

var map;
function initMap() {
    if (!document.getElementById('map'))
        return;
    var latLngCenter = {lat: 55.902, lng: 37.7375};
    // if ($(window).width()<600){
    //     latLngCenter = {lat: 55.902, lng: 37.7375};
    // }
    map = new google.maps.Map(document.getElementById('map'), {
        center: latLngCenter,
        zoom: 17,
        draggable: !("ontouchend" in document),
        scrollwheel: false,
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.station.rail",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#4369aa"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#005eff"
                    }
                ]
            }
        ]
    });
// marker
    var latLngHome = {lat: 55.90085, lng: 37.73885};
    var image = 'assets/img/marker.png';
    var marker = new google.maps.Marker({
        position: latLngHome,
        map: map,
        icon: image
    });
}

// slider initialization

// for slider
var removeActiveClass = (function (reqClass) {
    reqClass.addClass('active').siblings().removeClass('active');
});

var changeDescription = (function (description, index) {
    var sliderTitle = description.find('.c-slider-title'),
        sliderSkills = description.find('.c-slider-item__skills'),
        sliderLink = description.find('.c-slider-btn');
    var data = {}
    sendGetAjaxJson('api/works', data, function (data) {
        // var jsonObject = JSON.parse(data);
        //
        console.log(data);
        var worksArray = $.map(data, function (el) {
            return el
        });
        console.log(worksArray);
        sliderTitle.css('opacity', '0');
        setTimeout(function () {
            sliderTitle.text(worksArray[index].name);
            sliderTitle.css('opacity', '1');
        }, 400);
        sliderSkills.css('opacity', '0');
        setTimeout(function () {
            sliderSkills.text(worksArray[index].technologies);
            sliderSkills.css('opacity', '1');
        }, 400);
        sliderLink.attr('href', (worksArray[index].link));
        console.log(worksArray[index].title);
        console.log(index);
    });
});

$(document).ready(function () {
    console.log('document.ready');
    //slider.init();
    parallax.init();
    skills.init();
    // preloader
    (function () {
        var imgs = [];
        $('*').each(function () {
            var $this = $(this);
            var background = $this.css('background-image');
            var isImg = $this.is('img');
            var path = '';
            if (background !== 'none') {
                path = background.replace('url("', '').replace('")', '');
                if (path.indexOf('-gradient(') !== -1)
                    return;
                imgs.push(path);
            }
            if (isImg) {
                path = $this.attr('src');
                if (!path)
                    return;
                imgs.push(path);
            }
        });
        var percentsTotal = 1;
        for (var i = 0; i < imgs.length; i++) {
            var image = $('<img>', {
                attr: {
                    src: imgs[i]
                }
            });
            image.one({
                load: function () {
                    setPercents(imgs.length, percentsTotal);
                    percentsTotal++;
                },
                error: function () {
                    percentsTotal++;
                }
            });
        }
        function setPercents(total, current) {
            var percent = Math.ceil(current / total * 100);
            if (percent >= 100) {
                $('.preloader').fadeOut();
            }
            $('.preloader__value').text(percent);
        }
    })();


    // flipper&parallax
    (function () {
        var welcomeSection = $('.l-welcome');
        console.log(welcomeSection);
        if (welcomeSection.length == 0) {
            return;
        }
        console.log('in welcome');
        // flipper
        welcomeSection.on('click', '[data-flip="toggle"]', function (e) {
            console.log('clicked');
            e.preventDefault();
            var trigger = welcomeSection.find('.l-welcome__auth-btn')
            var flipper = welcomeSection.find('.l-flipper');
            console.log(flipper);
            var duration = 600;
            flipper.toggleClass('l-flipper_back');
            if (flipper.hasClass('l-flipper_back')) {
                trigger.removeClass('active');
            } else {
                trigger.addClass('active');
            }
        });
        // parallax
        var layerAll = $('.l-parallax__bg');
        var clouds = $('.c-stars-parallax__layer');

        $(window).on('mousemove', function (e) {
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            var w = (window.innerWidth / 2) - mouseX;
            var h = (window.innerHeight / 2) - mouseY;
            layerAll.map(function (i, item) {
                var wPos = w * ((i + 1) / 40);
                var hPos = h * ((i + 1) / 30);
                $(item).css({
                    'transform': 'translate3d(' + wPos + 'px,' + hPos + 'px, 0)'
                });
            });
            clouds.map(function (i, item) {
                var wPos = w * ((i * 9 + 1) / 90);
                var hPos = h * ((i * 4 + 1) / 120);
                $(item).css({
                    'transform': 'translate3d(' + wPos + 'px,' + hPos + 'px, 0)'
                });
            });
        });

    })();


    // slider prev_next buttons
    $('.c-slider__button').on('click', function (e) {
        e.preventDefault();
        var
            $this = $(this),
            slider = $(this).closest('.c-slider'),
            // view vars
            slides = slider.find('.c-slider__slides'),
            items = slider.find('.c-slides__item'),
            activeSlide = items.filter('.active'),
            nextSlide = activeSlide.next(),
            prevSlide = activeSlide.prev(),
            firstSlide = items.first(),
            lastSlide = items.last(),
            // description vars
            description = slider.find('.c-slider__description'),

            // pager vars
            pagerList = slider.find('.c-pager__list'),
            pages = slider.find('.c-pager__item'),
            activePage = pages.filter('.active'),
            nextPage = activePage.next(),
            prevPage = activePage.prev(),
            firstPage = pages.first(),
            lastPage = pages.last()
            ;
        if ($this.hasClass('c-slider__button_next')) {
            if (nextSlide.length) {
                removeActiveClass(nextSlide);
                removeActiveClass(nextPage);
                changeDescription(description, nextSlide.index())
            } else {
                removeActiveClass(firstSlide);
                removeActiveClass(firstPage);
                changeDescription(description, firstSlide.index())
            }

        } else {
            if (prevSlide.length) {
                removeActiveClass(prevSlide);
                removeActiveClass(prevPage);
                changeDescription(description, prevSlide.index())
            } else {
                removeActiveClass(lastSlide);
                removeActiveClass(lastPage);
                changeDescription(description, lastSlide.index())
            }
        }
    });

    // slider pager buttons
    $('.c-pager__item').on('click', function (e) {
        e.preventDefault();
        var
            $this = $(this),
            index = $this.index(),
            slider = $(this).closest('.c-slider'),
            // view vars
            slides = slider.find('.c-slider__slides'),
            items = slider.find('.c-slides__item'),
            slideToShow = items.eq(index),
            // description vars
            description = slider.find('.c-slider__description'),
            sliderTitle = description.find('.c-slider-title'),
            sliderSkills = description.find('.c-slider-item__skills'),
            sliderLink = description.find('.c-slider-btn'),
            // pager vars
            pagerList = slider.find('.c-pager__list'),
            pages = slider.find('.c-pager__item'),
            clickedPage = pages.eq(index)
            ;
        console.log(index);
        if (!$this.hasClass('active')) {
            removeActiveClass(slideToShow);
            removeActiveClass(clickedPage);
            changeDescription(description, slideToShow.index())
        }
    });

    // nav
    (function () {
        $(document).on('click', '.c-menu-icon', function (e) {
            var trigger = $(this);
            var wrapper = trigger.closest('.c-menu-wrapper_main');
            var menu = wrapper.find('.c-menu');
            console.log(wrapper);
            if (wrapper.hasClass('open')) {
                menu.fadeOut(500, function () {
                    wrapper.removeClass('open');
                });
            } else {
                menu.show(0, function () {
                    wrapper.addClass('open');
                });
            }
        });
    })();

    // blog

    (function () {
        var container = $('.c-blog');
        var sidebar = container.find('.c-blog-sidebar');
        if (sidebar.length === 0 || isMobile)
            return;
        //var containerBottom = container.offset().top + container.height() - 40;
        var edgeTop = sidebar.offset().top;
        //var sidebarHeight = sidebar.height();
        console.log($(window).innerWidth);
        if ($(window).innerWidth() > 768) {
            $(window).on('scroll', function () {
                if (edgeTop < $(window).scrollTop()) {
                    sidebar.addClass('c-blog-sidebar_fixed');
                } else {
                    sidebar.removeClass('c-blog-sidebar_fixed');
                }
            });
        }
    })();

    (function () {
        var articleAll = $('.c-article');
        var linksAll = $('.c-blog-sidebar__link');
        if (articleAll.length === 0)
            return;
        showSection(window.location.hash, false);
        function showSection(section, isAnimate) {
            var target = section.replace('#', '');
            var reqSection = articleAll.filter('[data-id="' + target + '"]');
            var duration = 750;
            if (reqSection.length === 0)
                return;
            var reqSectionPos = reqSection.offset().top;
            if (isAnimate) {
                $('body, html').animate({
                    scrollTop: reqSectionPos
                }, duration);
            } else {
                $('body, html').scrollTop(reqSectionPos);
            }
        }

        function checkSection() {
            articleAll.each(function (i, item) {
                var article = $(item);
                var topEdge = article.offset().top - 0.55 * $(window).innerHeight();

                var bottomEdge = topEdge + article.height();
                var topScroll = $(window).scrollTop();
                if (topEdge < topScroll && bottomEdge > topScroll) {
                    var currentId = article.data('id');
                    var reqLink = linksAll.filter('[href="#' + currentId + '"]');
                    reqLink.closest('.c-blog-sidebar__item').addClass('active').siblings().removeClass('active');
                    window.location.hash = currentId;
                }
            });
        }

        $(window).on('scroll', function () {
            checkSection();
        });
        $(document).on('click', '.c-blog-sidebar__link', function (e) {
            e.preventDefault();
            var sidebar = $(this).closest('.c-blog-sidebar');
            if (sidebar.hasClass('active')) sidebar.removeClass('active');
            showSection($(this).attr('href'), true);
        });

        $(document).on('click', '.c-blog-sidebar__button', function (e) {
            e.preventDefault();
            var trigger = $(this);
            var sidebar = trigger.closest('.c-blog-sidebar');
            sidebar.toggleClass('active');
        });
    })();

    // next/prev sections scroll
    (function () {
        $(document).on('click', '[data-move]', function (e) {
            e.preventDefault();
            var btn = $(this);
            var target = btn.attr('data-move');
            var container = null;

            function scrollToPosition(position, duration) {
                console.log(position);
                var position = position || 0;
                var duration = duration || 1000;
                $("body, html").animate({
                    scrollTop: position
                }, duration);
            }

            if (target == 'top') {
                scrollToPosition();
            }
            if (target == 'next') {
                container = btn.closest('.l-section');
                console.log(container.height());
                scrollToPosition(container.height());
            }
        });
    })();

// ADMIN TABS
    // tabs manager
    $('.c-tabs__item').on('click', function (e) {
        e.preventDefault();
        var
            $this = $(this),
            index = $this.index(),
            adminSection = $(this).closest('.l-admin'),
            //tabs = adminSection.find('.c-tabs__item'),
            contents = adminSection.find('.c-content-panel__item'),
            contentToShow = contents.eq(index)

            ;
        if (!$this.hasClass('active')) {
            $this.addClass('active').siblings().removeClass('active');
            contentToShow.addClass('active').siblings().removeClass('active');
        }
    });
    // Upload trigger
    $('#uploadfile').on('click', function (e) {
        e.preventDefault();
        $("#file").trigger('click');
    });


    function fileUpload(url, data, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function (e) {
            var result = JSON.parse(xhr.responseText);
            cb(result.status);
        };
        xhr.send(data);
    }

    // Upload work
    const worksForm = $('#admin-works');

    if (worksForm) {
        worksForm.on('submit', prepareSendFile);
    }

    function prepareSendFile(e) {
        e.preventDefault();
        var form = $(this);
        var popup = $('.l-admin__popup');
        var resultContainer = popup.find('.l-admin__status');
        var formData = new FormData();
        var file = $('#file').get(0).files[0];
        var name = $('#name').val();
        var technologies = $('#technologies').val();
        var link = $('#link').val();
        formData.append('image', file, file.name);
        formData.append('name', name);
        formData.append('technologies', technologies);
        formData.append('link', link);
        console.log(resultContainer);
        resultContainer.text('Uploading...');
        popup.delay(200).fadeIn(1000);
        fileUpload('/admin/works', formData, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
            form[0].reset();
        });
    }

    // Blog Form
    var blogForm = document.querySelector('#admin-blog');

    if (blogForm) {
        blogForm.addEventListener('submit', prepareSendPost);
    }

    function prepareSendPost(e) {
        e.preventDefault();
        var form = $(this);
        var popup = $('.l-admin__popup');
        var resultContainer = popup.find('.l-admin__status');
        var data = {
            title: blogForm.title.value,
            date: blogForm.date.value,
            content: blogForm.content.value
        };
        resultContainer.text('Saving data...');
        popup.delay(200).fadeIn(1000);
        sendAjaxJson('/admin/blog', data, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
            form[0].reset();
        });
    }

    // Skills form

    var skillsForm = document.querySelector('#admin-skills');

    if (skillsForm) {
        skillsForm.addEventListener('submit', prepareSendSkills);
    }

    function prepareSendSkills(e) {
        e.preventDefault();
        var popup = $('.l-admin__popup');
        var resultContainer = popup.find('.l-admin__status');
        var skills = $('.c-admin-skills');
        var skillGroups = skills.find('.c-admin-skills__group');
        var data = {};

        skillGroups.each(function () {

            var skillGroup = $(this);
            var groupTitle = skillGroup.find('.c-admin-group__title').text();
            var items = skillGroup.find('.c-admin-skill');
            var itemObj = {};

            items.each(function () {
                var item = $(this);
                var skillName = item.find('.c-admin-skill__title').text();
                var skillValue = item.find('.c-admin-form__input_skills').val();

                itemObj[skillName] = skillValue;
            });
            data[groupTitle] = itemObj;

        });

        resultContainer.text('Saving data...');
        popup.delay(200).fadeIn(1000);
        console.log(data);
        sendAjaxJson('/admin/about', data, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
        });
    }

    // Auth form

    // Checkbox
    var checkbox = document.querySelector('.c-checkbox__input');

    if (checkbox) {
        checkbox.addEventListener('change', function () {
            $(this).removeClass('field_error').removeClass('field_ok');
        });
    }

    var authForm = document.querySelector('#auth-form');

    if (authForm) {
        authForm.addEventListener('submit', prepareSendAuth);
    }

    function prepareSendAuth(e) {
        e.preventDefault();
        var popup = $('.l-section__popup');
        var resultContainer = popup.find('.l-section__status');
        var form = $(this);
        var validationInfo = validateAuth(form);
        if (!validationInfo.isValidated) {
            console.log(validationInfo.errors);
            popup.delay(200).fadeIn(1000);
            $(validationInfo.errors).each(function (i, err) {
                console.log(err);
                resultContainer.text(err);
            });
            popup.fadeOut(1000);
            return;
        }
        var data = {
            username: authForm.username.value,
            password: authForm.password.value,
        };
        resultContainer.text('Проверка данных...');
        popup.delay(200).fadeIn(1000);

        sendAjaxJson('/admin', data, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
            console.log(data.redirect);
            if (data == 'Авторизация успешна!')
                window.location = '/admin';
        });
    }

    function validateAuth(form) {
        var inputs = form.find('[required]');
        var isValidated = true;
        var errors = [];
        var flag1 = false;
        var flag2 = false;
        inputs.removeClass('field--error');
        inputs.each(function (i, item) {
            var input = $(item);
            var value = input.val();
            var type = input.attr('type');
            if (type == 'checkbox') {
                if (!input.is(':checked')) {

                    input.addClass('field_error');
                    isValidated = false;
                    if (!flag1)
                        errors.push('Вы точно не робот?');
                    flag1 = true;
                }
            } else if (value.trim() == '') {
                input.addClass('field_error');
                isValidated = false;
                if (!flag2)
                    errors.push('Вы забыли ввести данные');
                flag2 = true;
            } else {
                input.removeClass('field_error').addClass('field_ok');
            }

        });
        return {
            "isValidated": isValidated,
            "errors": errors
        };
    }


});

// Events
$(window).on('load', function () {
    $('body').addClass('loaded');
});

window.onscroll = function () {
    var winScroll = window.pageYOffset;
    parallax.init(winScroll);
    //if (winScroll > innerHeight / 1.8) {
    skills.grow(winScroll);
    //}
};

$(document).on('focus', '.c-form__input', function (e) {
    $(this).removeClass('field_error').removeClass('field_ok');
});

$(document).on('reset', '.c-form', function (e) {
    $(this).find('.c-form__input').removeClass('field_error').removeClass('field_ok');
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxudmFyIGlzTW9iaWxlID0gL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuLy8gRm9ybXNcclxuLy8gTWFpbCBGb3JtXHJcbnZhciBtYWlsRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWlsLWZvcm0nKTtcclxuXHJcbmlmIChtYWlsRm9ybSkge1xyXG4gICAgbWFpbEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRNYWlsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlcGFyZVNlbmRNYWlsKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBmb3JtID0gJCh0aGlzKTtcclxuICAgIHZhciBwb3B1cCA9ICQoJy5sLXNlY3Rpb25fX3BvcHVwJyk7XHJcbiAgICB2YXIgcmVzdWx0Q29udGFpbmVyID0gcG9wdXAuZmluZCgnLmwtc2VjdGlvbl9fc3RhdHVzJyk7XHJcbiAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICB1c2VybmFtZTogbWFpbEZvcm0udXNlcm5hbWUudmFsdWUsXHJcbiAgICAgICAgZW1haWw6IG1haWxGb3JtLmVtYWlsLnZhbHVlLFxyXG4gICAgICAgIG1lc3NhZ2U6IG1haWxGb3JtLm1lc3NhZ2UudmFsdWVcclxuICAgIH07XHJcbiAgICByZXN1bHRDb250YWluZXIudGV4dCgn0J7RgtC/0YDQsNCy0LrQsCDRgdC+0L7QsdGJ0LXQvdC40Y8uLi4nKTtcclxuICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG4gICAgc2VuZEFqYXhKc29uKCd3b3JrcycsIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZGF0YSk7XHJcbiAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBmb3JtWzBdLnJlc2V0KCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNlbmRBamF4SnNvbih1cmwsIGRhdGEsIGNiKSB7XHJcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGNiKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgfTtcclxuICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZEdldEFqYXhKc29uKHVybCwgZGF0YSwgY2IpIHtcclxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgfTtcclxuICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5cclxuXHJcbi8vIE1vZHVsZXNcclxudmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sLXBhcmFsbGF4X19iZycpLFxyXG4gICAgICAgIHVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubC1kZXZlbG9wZXJfX2NvbnRhaW5lciAuYy11c2VyJyksXHJcbiAgICAgICAgdXNlckJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmwtZGV2ZWxvcGVyX19jb250YWluZXIgLmMtZGV2ZWxvcGVyX19iZycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbW92ZTogZnVuY3Rpb24gKGJsb2NrLCB3aW5kb3dTY3JvbGwsIHN0cmFmZUNvZWZmaWNpZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBzdHJhZmUgPSAtKHdpbmRvd1Njcm9sbCAvIHN0cmFmZUNvZWZmaWNpZW50KSArICclJztcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gYmxvY2suc3R5bGU7XHJcbiAgICAgICAgICAgIC8vIFZhciBmb3IgcmVuZGVyaW5nIGJ5IHZpZGVvIHByb2Nlc3NvciAoei1heGlzKVxyXG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyBzdHJhZmUgKyAnLCAwKSc7XHJcbiAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuICAgICAgICAgICAgc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHdpblNjcm9sbCkge1xyXG4gICAgICAgICAgICBpZiAodXNlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJCh3aW5kb3cpLmlubmVyV2lkdGgoKSk7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuaW5uZXJXaWR0aCgpID4gNzY4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUoYmcsIHdpblNjcm9sbCwgMTAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZSh1c2VyLCAtd2luU2Nyb2xsLCA5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZSh1c2VyQmcsIC13aW5TY3JvbGwsIDEzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuXHJcblxyXG52YXIgc2tpbGxzID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBza2lsbEdyb3VwcyA9IG51bGw7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2tpbGxHcm91cHMgPSAkKCcuYy1za2lsbHNfX2dyb3VwJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNraWxsR3JvdXBzKTtcclxuICAgICAgICAgICAgaWYgKHNraWxsR3JvdXBzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNraWxsR3JvdXBzLmVhY2goZnVuY3Rpb24gKGksIHNraWxsR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBza2lsbEl0ZW1zID0gJChza2lsbEdyb3VwKS5maW5kKCcuYy1za2lsbF9fY2lyY2xlX291dGVyJyk7XHJcbiAgICAgICAgICAgICAgICBza2lsbEl0ZW1zLmVhY2goZnVuY3Rpb24gKGksIHNraWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpbGwudmFsdWUgPSAkKHNraWxsKS5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoc2tpbGwpLmF0dHIoJ3N0cm9rZS1kYXNob2Zmc2V0JywgJzEwMCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JvdzogZnVuY3Rpb24gKHdTY3JvbGwpIHtcclxuICAgICAgICAgICAgaWYgKHNraWxsR3JvdXBzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHdpbmRvd01hcmdpbiA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOTtcclxuICAgICAgICAgICAgc2tpbGxHcm91cHMuZWFjaChmdW5jdGlvbiAoaSwgc2tpbGxHcm91cCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwT2Zmc2V0ID0gc2tpbGxHcm91cC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd1Njcm9sbDonICsgd1Njcm9sbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd2luZG93TWFyZ2luOicgKyB3aW5kb3dNYXJnaW4pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dyb3VwT2Zmc2V0OicgKyBncm91cE9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAvL3ZhciBzdGFydEFuaW1hdGUgPSB3U2Nyb2xsIC0gZ3JvdXBPZmZzZXQgKyB3aW5kb3dNYXJnaW47XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRBbmltYXRlID0gLWdyb3VwT2Zmc2V0ICsgd2luZG93TWFyZ2luO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0QW5pbWF0ZTonICsgc3RhcnRBbmltYXRlKTtcclxuICAgICAgICAgICAgICAgIHZhciBwaXhlbHNFbGFwc2VkID0gZ3JvdXBPZmZzZXQgLSB3U2Nyb2xsO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRzRWxhcHNlZCA9IDEwMCAtIE1hdGguY2VpbChwaXhlbHNFbGFwc2VkIC8gd2luZG93TWFyZ2luICogMTAwKTtcclxuICAgICAgICAgICAgICAgIC8vIDEwMC8xMDAgYmVjYXVzZSB3ZSBoYXZlIDEwMCBkYXNoYXJyYXkuIEl0IGNhbiBiZSBkaWZmZXJlbnQhXHJcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudHNEcmF3biA9IDEwMCAvIDEwMCAqIHBlcmNlbnRzRWxhcHNlZDtcclxuICAgICAgICAgICAgICAgIHZhciBza2lsbEl0ZW1zID0gJChza2lsbEdyb3VwKS5maW5kKCcuYy1za2lsbF9fY2lyY2xlX291dGVyJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRBbmltYXRlID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZHJhd0Ftb3VudCA9IDEwMCAtIHBlcmNlbnRzRHJhd247XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpbGxJdGVtcy5lYWNoKGZ1bmN0aW9uIChpLCBza2lsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAxMDAgLSBwYXJzZUludChza2lsbC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBza2lsbE9wYWNpdHkgPSB2YWx1ZSAvIDIwMCArIDAuNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNraWxsT3BhY2l0eSA+PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBza2lsbE9wYWNpdHkgPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2tpbGwuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaG9mZnNldCcsIHNraWxsLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChza2lsbCkuY3NzKCdvcGFjaXR5Jywgc2tpbGxPcGFjaXR5KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpbGxJdGVtcy5lYWNoKGZ1bmN0aW9uIChpLCBza2lsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBza2lsbC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNob2Zmc2V0JywgJzEwMCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLy8gbWFwXHJcblxyXG52YXIgbWFwO1xyXG5mdW5jdGlvbiBpbml0TWFwKCkge1xyXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJykpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIGxhdExuZ0NlbnRlciA9IHtsYXQ6IDU1LjkwMiwgbG5nOiAzNy43Mzc1fTtcclxuICAgIC8vIGlmICgkKHdpbmRvdykud2lkdGgoKTw2MDApe1xyXG4gICAgLy8gICAgIGxhdExuZ0NlbnRlciA9IHtsYXQ6IDU1LjkwMiwgbG5nOiAzNy43Mzc1fTtcclxuICAgIC8vIH1cclxuICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XHJcbiAgICAgICAgY2VudGVyOiBsYXRMbmdDZW50ZXIsXHJcbiAgICAgICAgem9vbTogMTcsXHJcbiAgICAgICAgZHJhZ2dhYmxlOiAhKFwib250b3VjaGVuZFwiIGluIGRvY3VtZW50KSxcclxuICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXHJcbiAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZSxcclxuICAgICAgICBzdHlsZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNDQ0NDQ0XCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiI2YyZjJmMlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYXR0cmFjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzYXR1cmF0aW9uXCI6IC0xMDBcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaWdodG5lc3NcIjogNDVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLmljb25cIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXRcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInRyYW5zaXQuc3RhdGlvbi5yYWlsXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzQzNjlhYVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImh1ZVwiOiBcIiMwMDVlZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH0pO1xyXG4vLyBtYXJrZXJcclxuICAgIHZhciBsYXRMbmdIb21lID0ge2xhdDogNTUuOTAwODUsIGxuZzogMzcuNzM4ODV9O1xyXG4gICAgdmFyIGltYWdlID0gJ2Fzc2V0cy9pbWcvbWFya2VyLnBuZyc7XHJcbiAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgcG9zaXRpb246IGxhdExuZ0hvbWUsXHJcbiAgICAgICAgbWFwOiBtYXAsXHJcbiAgICAgICAgaWNvbjogaW1hZ2VcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBzbGlkZXIgaW5pdGlhbGl6YXRpb25cclxuXHJcbi8vIGZvciBzbGlkZXJcclxudmFyIHJlbW92ZUFjdGl2ZUNsYXNzID0gKGZ1bmN0aW9uIChyZXFDbGFzcykge1xyXG4gICAgcmVxQ2xhc3MuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG59KTtcclxuXHJcbnZhciBjaGFuZ2VEZXNjcmlwdGlvbiA9IChmdW5jdGlvbiAoZGVzY3JpcHRpb24sIGluZGV4KSB7XHJcbiAgICB2YXIgc2xpZGVyVGl0bGUgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItdGl0bGUnKSxcclxuICAgICAgICBzbGlkZXJTa2lsbHMgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItaXRlbV9fc2tpbGxzJyksXHJcbiAgICAgICAgc2xpZGVyTGluayA9IGRlc2NyaXB0aW9uLmZpbmQoJy5jLXNsaWRlci1idG4nKTtcclxuICAgIHZhciBkYXRhID0ge31cclxuICAgIHNlbmRHZXRBamF4SnNvbignYXBpL3dvcmtzJywgZGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAvLyB2YXIganNvbk9iamVjdCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB2YXIgd29ya3NBcnJheSA9ICQubWFwKGRhdGEsIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3Jrc0FycmF5KTtcclxuICAgICAgICBzbGlkZXJUaXRsZS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzbGlkZXJUaXRsZS50ZXh0KHdvcmtzQXJyYXlbaW5kZXhdLm5hbWUpO1xyXG4gICAgICAgICAgICBzbGlkZXJUaXRsZS5jc3MoJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgIH0sIDQwMCk7XHJcbiAgICAgICAgc2xpZGVyU2tpbGxzLmNzcygnb3BhY2l0eScsICcwJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNsaWRlclNraWxscy50ZXh0KHdvcmtzQXJyYXlbaW5kZXhdLnRlY2hub2xvZ2llcyk7XHJcbiAgICAgICAgICAgIHNsaWRlclNraWxscy5jc3MoJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgIH0sIDQwMCk7XHJcbiAgICAgICAgc2xpZGVyTGluay5hdHRyKCdocmVmJywgKHdvcmtzQXJyYXlbaW5kZXhdLmxpbmspKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3Jrc0FycmF5W2luZGV4XS50aXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2RvY3VtZW50LnJlYWR5Jyk7XHJcbiAgICAvL3NsaWRlci5pbml0KCk7XHJcbiAgICBwYXJhbGxheC5pbml0KCk7XHJcbiAgICBza2lsbHMuaW5pdCgpO1xyXG4gICAgLy8gcHJlbG9hZGVyXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbWdzID0gW107XHJcbiAgICAgICAgJCgnKicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xyXG4gICAgICAgICAgICB2YXIgaXNJbWcgPSAkdGhpcy5pcygnaW1nJyk7XHJcbiAgICAgICAgICAgIHZhciBwYXRoID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChiYWNrZ3JvdW5kICE9PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKCctZ3JhZGllbnQoJykgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGltZ3MucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNJbWcpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSAkdGhpcy5hdHRyKCdzcmMnKTtcclxuICAgICAgICAgICAgICAgIGlmICghcGF0aClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpbWdzLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcGVyY2VudHNUb3RhbCA9IDE7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xyXG4gICAgICAgICAgICAgICAgYXR0cjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogaW1nc1tpXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaW1hZ2Uub25lKHtcclxuICAgICAgICAgICAgICAgIGxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudHNUb3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudHNUb3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2V0UGVyY2VudHModG90YWwsIGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcclxuICAgICAgICAgICAgaWYgKHBlcmNlbnQgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucHJlbG9hZGVyJykuZmFkZU91dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQoJy5wcmVsb2FkZXJfX3ZhbHVlJykudGV4dChwZXJjZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICAvLyBmbGlwcGVyJnBhcmFsbGF4XHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB3ZWxjb21lU2VjdGlvbiA9ICQoJy5sLXdlbGNvbWUnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3ZWxjb21lU2VjdGlvbik7XHJcbiAgICAgICAgaWYgKHdlbGNvbWVTZWN0aW9uLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2luIHdlbGNvbWUnKTtcclxuICAgICAgICAvLyBmbGlwcGVyXHJcbiAgICAgICAgd2VsY29tZVNlY3Rpb24ub24oJ2NsaWNrJywgJ1tkYXRhLWZsaXA9XCJ0b2dnbGVcIl0nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gd2VsY29tZVNlY3Rpb24uZmluZCgnLmwtd2VsY29tZV9fYXV0aC1idG4nKVxyXG4gICAgICAgICAgICB2YXIgZmxpcHBlciA9IHdlbGNvbWVTZWN0aW9uLmZpbmQoJy5sLWZsaXBwZXInKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZmxpcHBlcik7XHJcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IDYwMDtcclxuICAgICAgICAgICAgZmxpcHBlci50b2dnbGVDbGFzcygnbC1mbGlwcGVyX2JhY2snKTtcclxuICAgICAgICAgICAgaWYgKGZsaXBwZXIuaGFzQ2xhc3MoJ2wtZmxpcHBlcl9iYWNrJykpIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBwYXJhbGxheFxyXG4gICAgICAgIHZhciBsYXllckFsbCA9ICQoJy5sLXBhcmFsbGF4X19iZycpO1xyXG4gICAgICAgIHZhciBjbG91ZHMgPSAkKCcuYy1zdGFycy1wYXJhbGxheF9fbGF5ZXInKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgbW91c2VYID0gZS5wYWdlWDtcclxuICAgICAgICAgICAgdmFyIG1vdXNlWSA9IGUucGFnZVk7XHJcbiAgICAgICAgICAgIHZhciB3ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSBtb3VzZVg7XHJcbiAgICAgICAgICAgIHZhciBoID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gbW91c2VZO1xyXG4gICAgICAgICAgICBsYXllckFsbC5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB3UG9zID0gdyAqICgoaSArIDEpIC8gNDApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhQb3MgPSBoICogKChpICsgMSkgLyAzMCk7XHJcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd1BvcyArICdweCwnICsgaFBvcyArICdweCwgMCknXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNsb3Vkcy5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB3UG9zID0gdyAqICgoaSAqIDkgKyAxKSAvIDkwKTtcclxuICAgICAgICAgICAgICAgIHZhciBoUG9zID0gaCAqICgoaSAqIDQgKyAxKSAvIDEyMCk7XHJcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd1BvcyArICdweCwnICsgaFBvcyArICdweCwgMCknXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLy8gc2xpZGVyIHByZXZfbmV4dCBidXR0b25zXHJcbiAgICAkKCcuYy1zbGlkZXJfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIHNsaWRlciA9ICQodGhpcykuY2xvc2VzdCgnLmMtc2xpZGVyJyksXHJcbiAgICAgICAgICAgIC8vIHZpZXcgdmFyc1xyXG4gICAgICAgICAgICBzbGlkZXMgPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVyX19zbGlkZXMnKSxcclxuICAgICAgICAgICAgaXRlbXMgPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVzX19pdGVtJyksXHJcbiAgICAgICAgICAgIGFjdGl2ZVNsaWRlID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcbiAgICAgICAgICAgIG5leHRTbGlkZSA9IGFjdGl2ZVNsaWRlLm5leHQoKSxcclxuICAgICAgICAgICAgcHJldlNsaWRlID0gYWN0aXZlU2xpZGUucHJldigpLFxyXG4gICAgICAgICAgICBmaXJzdFNsaWRlID0gaXRlbXMuZmlyc3QoKSxcclxuICAgICAgICAgICAgbGFzdFNsaWRlID0gaXRlbXMubGFzdCgpLFxyXG4gICAgICAgICAgICAvLyBkZXNjcmlwdGlvbiB2YXJzXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gc2xpZGVyLmZpbmQoJy5jLXNsaWRlcl9fZGVzY3JpcHRpb24nKSxcclxuXHJcbiAgICAgICAgICAgIC8vIHBhZ2VyIHZhcnNcclxuICAgICAgICAgICAgcGFnZXJMaXN0ID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19saXN0JyksXHJcbiAgICAgICAgICAgIHBhZ2VzID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UgPSBwYWdlcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuICAgICAgICAgICAgbmV4dFBhZ2UgPSBhY3RpdmVQYWdlLm5leHQoKSxcclxuICAgICAgICAgICAgcHJldlBhZ2UgPSBhY3RpdmVQYWdlLnByZXYoKSxcclxuICAgICAgICAgICAgZmlyc3RQYWdlID0gcGFnZXMuZmlyc3QoKSxcclxuICAgICAgICAgICAgbGFzdFBhZ2UgPSBwYWdlcy5sYXN0KClcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnYy1zbGlkZXJfX2J1dHRvbl9uZXh0JykpIHtcclxuICAgICAgICAgICAgaWYgKG5leHRTbGlkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKG5leHRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhuZXh0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgbmV4dFNsaWRlLmluZGV4KCkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhmaXJzdFNsaWRlKTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKGZpcnN0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgZmlyc3RTbGlkZS5pbmRleCgpKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmV2U2xpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhwcmV2U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MocHJldlBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIHByZXZTbGlkZS5pbmRleCgpKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MobGFzdFNsaWRlKTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKGxhc3RQYWdlKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uLCBsYXN0U2xpZGUuaW5kZXgoKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHNsaWRlciBwYWdlciBidXR0b25zXHJcbiAgICAkKCcuYy1wYWdlcl9faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGluZGV4ID0gJHRoaXMuaW5kZXgoKSxcclxuICAgICAgICAgICAgc2xpZGVyID0gJCh0aGlzKS5jbG9zZXN0KCcuYy1zbGlkZXInKSxcclxuICAgICAgICAgICAgLy8gdmlldyB2YXJzXHJcbiAgICAgICAgICAgIHNsaWRlcyA9IHNsaWRlci5maW5kKCcuYy1zbGlkZXJfX3NsaWRlcycpLFxyXG4gICAgICAgICAgICBpdGVtcyA9IHNsaWRlci5maW5kKCcuYy1zbGlkZXNfX2l0ZW0nKSxcclxuICAgICAgICAgICAgc2xpZGVUb1Nob3cgPSBpdGVtcy5lcShpbmRleCksXHJcbiAgICAgICAgICAgIC8vIGRlc2NyaXB0aW9uIHZhcnNcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVyX19kZXNjcmlwdGlvbicpLFxyXG4gICAgICAgICAgICBzbGlkZXJUaXRsZSA9IGRlc2NyaXB0aW9uLmZpbmQoJy5jLXNsaWRlci10aXRsZScpLFxyXG4gICAgICAgICAgICBzbGlkZXJTa2lsbHMgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItaXRlbV9fc2tpbGxzJyksXHJcbiAgICAgICAgICAgIHNsaWRlckxpbmsgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItYnRuJyksXHJcbiAgICAgICAgICAgIC8vIHBhZ2VyIHZhcnNcclxuICAgICAgICAgICAgcGFnZXJMaXN0ID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19saXN0JyksXHJcbiAgICAgICAgICAgIHBhZ2VzID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGNsaWNrZWRQYWdlID0gcGFnZXMuZXEoaW5kZXgpXHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgaWYgKCEkdGhpcy5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3Moc2xpZGVUb1Nob3cpO1xyXG4gICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhjbGlja2VkUGFnZSk7XHJcbiAgICAgICAgICAgIGNoYW5nZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uLCBzbGlkZVRvU2hvdy5pbmRleCgpKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIG5hdlxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmMtbWVudS1pY29uJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9IHRyaWdnZXIuY2xvc2VzdCgnLmMtbWVudS13cmFwcGVyX21haW4nKTtcclxuICAgICAgICAgICAgdmFyIG1lbnUgPSB3cmFwcGVyLmZpbmQoJy5jLW1lbnUnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cod3JhcHBlcik7XHJcbiAgICAgICAgICAgIGlmICh3cmFwcGVyLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgICAgIG1lbnUuZmFkZU91dCg1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lbnUuc2hvdygwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLy8gYmxvZ1xyXG5cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJy5jLWJsb2cnKTtcclxuICAgICAgICB2YXIgc2lkZWJhciA9IGNvbnRhaW5lci5maW5kKCcuYy1ibG9nLXNpZGViYXInKTtcclxuICAgICAgICBpZiAoc2lkZWJhci5sZW5ndGggPT09IDAgfHwgaXNNb2JpbGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvL3ZhciBjb250YWluZXJCb3R0b20gPSBjb250YWluZXIub2Zmc2V0KCkudG9wICsgY29udGFpbmVyLmhlaWdodCgpIC0gNDA7XHJcbiAgICAgICAgdmFyIGVkZ2VUb3AgPSBzaWRlYmFyLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAvL3ZhciBzaWRlYmFySGVpZ2h0ID0gc2lkZWJhci5oZWlnaHQoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygkKHdpbmRvdykuaW5uZXJXaWR0aCk7XHJcbiAgICAgICAgaWYgKCQod2luZG93KS5pbm5lcldpZHRoKCkgPiA3NjgpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWRnZVRvcCA8ICQod2luZG93KS5zY3JvbGxUb3AoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXIuYWRkQ2xhc3MoJ2MtYmxvZy1zaWRlYmFyX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXIucmVtb3ZlQ2xhc3MoJ2MtYmxvZy1zaWRlYmFyX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJ0aWNsZUFsbCA9ICQoJy5jLWFydGljbGUnKTtcclxuICAgICAgICB2YXIgbGlua3NBbGwgPSAkKCcuYy1ibG9nLXNpZGViYXJfX2xpbmsnKTtcclxuICAgICAgICBpZiAoYXJ0aWNsZUFsbC5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBzaG93U2VjdGlvbih3aW5kb3cubG9jYXRpb24uaGFzaCwgZmFsc2UpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dTZWN0aW9uKHNlY3Rpb24sIGlzQW5pbWF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gc2VjdGlvbi5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgICAgICB2YXIgcmVxU2VjdGlvbiA9IGFydGljbGVBbGwuZmlsdGVyKCdbZGF0YS1pZD1cIicgKyB0YXJnZXQgKyAnXCJdJyk7XHJcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IDc1MDtcclxuICAgICAgICAgICAgaWYgKHJlcVNlY3Rpb24ubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcmVxU2VjdGlvblBvcyA9IHJlcVNlY3Rpb24ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICBpZiAoaXNBbmltYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5LCBodG1sJykuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiByZXFTZWN0aW9uUG9zXHJcbiAgICAgICAgICAgICAgICB9LCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5LCBodG1sJykuc2Nyb2xsVG9wKHJlcVNlY3Rpb25Qb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGVja1NlY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFydGljbGVBbGwuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFydGljbGUgPSAkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcEVkZ2UgPSBhcnRpY2xlLm9mZnNldCgpLnRvcCAtIDAuNTUgKiAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgYm90dG9tRWRnZSA9IHRvcEVkZ2UgKyBhcnRpY2xlLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvcFNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b3BFZGdlIDwgdG9wU2Nyb2xsICYmIGJvdHRvbUVkZ2UgPiB0b3BTY3JvbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudElkID0gYXJ0aWNsZS5kYXRhKCdpZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXFMaW5rID0gbGlua3NBbGwuZmlsdGVyKCdbaHJlZj1cIiMnICsgY3VycmVudElkICsgJ1wiXScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcUxpbmsuY2xvc2VzdCgnLmMtYmxvZy1zaWRlYmFyX19pdGVtJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gY3VycmVudElkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVja1NlY3Rpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmMtYmxvZy1zaWRlYmFyX19saW5rJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhciA9ICQodGhpcykuY2xvc2VzdCgnLmMtYmxvZy1zaWRlYmFyJyk7XHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyLmhhc0NsYXNzKCdhY3RpdmUnKSkgc2lkZWJhci5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHNob3dTZWN0aW9uKCQodGhpcykuYXR0cignaHJlZicpLCB0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jLWJsb2ctc2lkZWJhcl9fYnV0dG9uJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyID0gdHJpZ2dlci5jbG9zZXN0KCcuYy1ibG9nLXNpZGViYXInKTtcclxuICAgICAgICAgICAgc2lkZWJhci50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8vIG5leHQvcHJldiBzZWN0aW9ucyBzY3JvbGxcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLW1vdmVdJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgYnRuID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGJ0bi5hdHRyKCdkYXRhLW1vdmUnKTtcclxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzY3JvbGxUb1Bvc2l0aW9uKHBvc2l0aW9uLCBkdXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gcG9zaXRpb24gfHwgMDtcclxuICAgICAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IDEwMDA7XHJcbiAgICAgICAgICAgICAgICAkKFwiYm9keSwgaHRtbFwiKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICB9LCBkdXJhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09ICduZXh0Jykge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gYnRuLmNsb3Nlc3QoJy5sLXNlY3Rpb24nKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbnRhaW5lci5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1Bvc2l0aW9uKGNvbnRhaW5lci5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pKCk7XHJcblxyXG4vLyBBRE1JTiBUQUJTXHJcbiAgICAvLyB0YWJzIG1hbmFnZXJcclxuICAgICQoJy5jLXRhYnNfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBpbmRleCA9ICR0aGlzLmluZGV4KCksXHJcbiAgICAgICAgICAgIGFkbWluU2VjdGlvbiA9ICQodGhpcykuY2xvc2VzdCgnLmwtYWRtaW4nKSxcclxuICAgICAgICAgICAgLy90YWJzID0gYWRtaW5TZWN0aW9uLmZpbmQoJy5jLXRhYnNfX2l0ZW0nKSxcclxuICAgICAgICAgICAgY29udGVudHMgPSBhZG1pblNlY3Rpb24uZmluZCgnLmMtY29udGVudC1wYW5lbF9faXRlbScpLFxyXG4gICAgICAgICAgICBjb250ZW50VG9TaG93ID0gY29udGVudHMuZXEoaW5kZXgpXHJcblxyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgaWYgKCEkdGhpcy5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBjb250ZW50VG9TaG93LmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIFVwbG9hZCB0cmlnZ2VyXHJcbiAgICAkKCcjdXBsb2FkZmlsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICQoXCIjZmlsZVwiKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbGVVcGxvYWQodXJsLCBkYXRhLCBjYikge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICBjYihyZXN1bHQuc3RhdHVzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwbG9hZCB3b3JrXHJcbiAgICBjb25zdCB3b3Jrc0Zvcm0gPSAkKCcjYWRtaW4td29ya3MnKTtcclxuXHJcbiAgICBpZiAod29ya3NGb3JtKSB7XHJcbiAgICAgICAgd29ya3NGb3JtLm9uKCdzdWJtaXQnLCBwcmVwYXJlU2VuZEZpbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZXBhcmVTZW5kRmlsZShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBmb3JtID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgcG9wdXAgPSAkKCcubC1hZG1pbl9fcG9wdXAnKTtcclxuICAgICAgICB2YXIgcmVzdWx0Q29udGFpbmVyID0gcG9wdXAuZmluZCgnLmwtYWRtaW5fX3N0YXR1cycpO1xyXG4gICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIHZhciBmaWxlID0gJCgnI2ZpbGUnKS5nZXQoMCkuZmlsZXNbMF07XHJcbiAgICAgICAgdmFyIG5hbWUgPSAkKCcjbmFtZScpLnZhbCgpO1xyXG4gICAgICAgIHZhciB0ZWNobm9sb2dpZXMgPSAkKCcjdGVjaG5vbG9naWVzJykudmFsKCk7XHJcbiAgICAgICAgdmFyIGxpbmsgPSAkKCcjbGluaycpLnZhbCgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnaW1hZ2UnLCBmaWxlLCBmaWxlLm5hbWUpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnbmFtZScsIG5hbWUpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgndGVjaG5vbG9naWVzJywgdGVjaG5vbG9naWVzKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2xpbmsnLCBsaW5rKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRDb250YWluZXIpO1xyXG4gICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KCdVcGxvYWRpbmcuLi4nKTtcclxuICAgICAgICBwb3B1cC5kZWxheSgyMDApLmZhZGVJbigxMDAwKTtcclxuICAgICAgICBmaWxlVXBsb2FkKCcvYWRtaW4vd29ya3MnLCBmb3JtRGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1cC5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgICBmb3JtWzBdLnJlc2V0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQmxvZyBGb3JtXHJcbiAgICB2YXIgYmxvZ0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRtaW4tYmxvZycpO1xyXG5cclxuICAgIGlmIChibG9nRm9ybSkge1xyXG4gICAgICAgIGJsb2dGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHByZXBhcmVTZW5kUG9zdCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNlbmRQb3N0KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciBwb3B1cCA9ICQoJy5sLWFkbWluX19wb3B1cCcpO1xyXG4gICAgICAgIHZhciByZXN1bHRDb250YWluZXIgPSBwb3B1cC5maW5kKCcubC1hZG1pbl9fc3RhdHVzJyk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBibG9nRm9ybS50aXRsZS52YWx1ZSxcclxuICAgICAgICAgICAgZGF0ZTogYmxvZ0Zvcm0uZGF0ZS52YWx1ZSxcclxuICAgICAgICAgICAgY29udGVudDogYmxvZ0Zvcm0uY29udGVudC52YWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoJ1NhdmluZyBkYXRhLi4uJyk7XHJcbiAgICAgICAgcG9wdXAuZGVsYXkoMjAwKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgc2VuZEFqYXhKc29uKCcvYWRtaW4vYmxvZycsIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICByZXN1bHRDb250YWluZXIudGV4dChkYXRhKTtcclxuICAgICAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgICAgZm9ybVswXS5yZXNldCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNraWxscyBmb3JtXHJcblxyXG4gICAgdmFyIHNraWxsc0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRtaW4tc2tpbGxzJyk7XHJcblxyXG4gICAgaWYgKHNraWxsc0Zvcm0pIHtcclxuICAgICAgICBza2lsbHNGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHByZXBhcmVTZW5kU2tpbGxzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVwYXJlU2VuZFNraWxscyhlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwb3B1cCA9ICQoJy5sLWFkbWluX19wb3B1cCcpO1xyXG4gICAgICAgIHZhciByZXN1bHRDb250YWluZXIgPSBwb3B1cC5maW5kKCcubC1hZG1pbl9fc3RhdHVzJyk7XHJcbiAgICAgICAgdmFyIHNraWxscyA9ICQoJy5jLWFkbWluLXNraWxscycpO1xyXG4gICAgICAgIHZhciBza2lsbEdyb3VwcyA9IHNraWxscy5maW5kKCcuYy1hZG1pbi1za2lsbHNfX2dyb3VwJyk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgc2tpbGxHcm91cHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2tpbGxHcm91cCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBncm91cFRpdGxlID0gc2tpbGxHcm91cC5maW5kKCcuYy1hZG1pbi1ncm91cF9fdGl0bGUnKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHNraWxsR3JvdXAuZmluZCgnLmMtYWRtaW4tc2tpbGwnKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1PYmogPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNraWxsTmFtZSA9IGl0ZW0uZmluZCgnLmMtYWRtaW4tc2tpbGxfX3RpdGxlJykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNraWxsVmFsdWUgPSBpdGVtLmZpbmQoJy5jLWFkbWluLWZvcm1fX2lucHV0X3NraWxscycpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW1PYmpbc2tpbGxOYW1lXSA9IHNraWxsVmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkYXRhW2dyb3VwVGl0bGVdID0gaXRlbU9iajtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KCdTYXZpbmcgZGF0YS4uLicpO1xyXG4gICAgICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIHNlbmRBamF4SnNvbignL2FkbWluL2Fib3V0JywgZGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1cC5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEF1dGggZm9ybVxyXG5cclxuICAgIC8vIENoZWNrYm94XHJcbiAgICB2YXIgY2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYy1jaGVja2JveF9faW5wdXQnKTtcclxuXHJcbiAgICBpZiAoY2hlY2tib3gpIHtcclxuICAgICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX2Vycm9yJykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX29rJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGF1dGhGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2F1dGgtZm9ybScpO1xyXG5cclxuICAgIGlmIChhdXRoRm9ybSkge1xyXG4gICAgICAgIGF1dGhGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHByZXBhcmVTZW5kQXV0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNlbmRBdXRoKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIHBvcHVwID0gJCgnLmwtc2VjdGlvbl9fcG9wdXAnKTtcclxuICAgICAgICB2YXIgcmVzdWx0Q29udGFpbmVyID0gcG9wdXAuZmluZCgnLmwtc2VjdGlvbl9fc3RhdHVzJyk7XHJcbiAgICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciB2YWxpZGF0aW9uSW5mbyA9IHZhbGlkYXRlQXV0aChmb3JtKTtcclxuICAgICAgICBpZiAoIXZhbGlkYXRpb25JbmZvLmlzVmFsaWRhdGVkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbGlkYXRpb25JbmZvLmVycm9ycyk7XHJcbiAgICAgICAgICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKHZhbGlkYXRpb25JbmZvLmVycm9ycykuZWFjaChmdW5jdGlvbiAoaSwgZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHBvcHVwLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoRm9ybS51c2VybmFtZS52YWx1ZSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGF1dGhGb3JtLnBhc3N3b3JkLnZhbHVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoJ9Cf0YDQvtCy0LXRgNC60LAg0LTQsNC90L3Ri9GFLi4uJyk7XHJcbiAgICAgICAgcG9wdXAuZGVsYXkoMjAwKS5mYWRlSW4oMTAwMCk7XHJcblxyXG4gICAgICAgIHNlbmRBamF4SnNvbignL2FkbWluJywgZGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1cC5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnJlZGlyZWN0KTtcclxuICAgICAgICAgICAgaWYgKGRhdGEgPT0gJ9CQ0LLRgtC+0YDQuNC30LDRhtC40Y8g0YPRgdC/0LXRiNC90LAhJylcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvYWRtaW4nO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlQXV0aChmb3JtKSB7XHJcbiAgICAgICAgdmFyIGlucHV0cyA9IGZvcm0uZmluZCgnW3JlcXVpcmVkXScpO1xyXG4gICAgICAgIHZhciBpc1ZhbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xyXG4gICAgICAgIHZhciBmbGFnMSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBmbGFnMiA9IGZhbHNlO1xyXG4gICAgICAgIGlucHV0cy5yZW1vdmVDbGFzcygnZmllbGQtLWVycm9yJyk7XHJcbiAgICAgICAgaW5wdXRzLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIGlucHV0ID0gJChpdGVtKTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gaW5wdXQudmFsKCk7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gaW5wdXQuYXR0cigndHlwZScpO1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmlzKCc6Y2hlY2tlZCcpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmFkZENsYXNzKCdmaWVsZF9lcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmbGFnMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goJ9CS0Ysg0YLQvtGH0L3QviDQvdC1INGA0L7QsdC+0YI/Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZzEgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLnRyaW0oKSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQuYWRkQ2xhc3MoJ2ZpZWxkX2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICBpc1ZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmbGFnMilcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCgn0JLRiyDQt9Cw0LHRi9C70Lgg0LLQstC10YHRgtC4INC00LDQvdC90YvQtScpO1xyXG4gICAgICAgICAgICAgICAgZmxhZzIgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQucmVtb3ZlQ2xhc3MoJ2ZpZWxkX2Vycm9yJykuYWRkQ2xhc3MoJ2ZpZWxkX29rJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJpc1ZhbGlkYXRlZFwiOiBpc1ZhbGlkYXRlZCxcclxuICAgICAgICAgICAgXCJlcnJvcnNcIjogZXJyb3JzXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG59KTtcclxuXHJcbi8vIEV2ZW50c1xyXG4kKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2xvYWRlZCcpO1xyXG59KTtcclxuXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3aW5TY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcbiAgICBwYXJhbGxheC5pbml0KHdpblNjcm9sbCk7XHJcbiAgICAvL2lmICh3aW5TY3JvbGwgPiBpbm5lckhlaWdodCAvIDEuOCkge1xyXG4gICAgc2tpbGxzLmdyb3cod2luU2Nyb2xsKTtcclxuICAgIC8vfVxyXG59O1xyXG5cclxuJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5jLWZvcm1fX2lucHV0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX2Vycm9yJykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX29rJyk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkub24oJ3Jlc2V0JywgJy5jLWZvcm0nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgJCh0aGlzKS5maW5kKCcuYy1mb3JtX19pbnB1dCcpLnJlbW92ZUNsYXNzKCdmaWVsZF9lcnJvcicpLnJlbW92ZUNsYXNzKCdmaWVsZF9vaycpO1xyXG59KTsiXX0=
