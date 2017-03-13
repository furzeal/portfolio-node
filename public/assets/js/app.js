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
            if ($(window).innerWidth()>768) {
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
    var data ={}
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
        $(window).on('scroll', function () {
            if (edgeTop < $(window).scrollTop()) {
                sidebar.addClass('c-blog-sidebar_fixed');
            } else {
                sidebar.removeClass('c-blog-sidebar_fixed');
            }
        });
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
                var topEdge = article.offset().top - 0.55*$(window).innerHeight();
                console.log($(window).innerHeight);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxudmFyIGlzTW9iaWxlID0gL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuLy8gRm9ybXNcclxuLy8gTWFpbCBGb3JtXHJcbnZhciBtYWlsRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWlsLWZvcm0nKTtcclxuXHJcbmlmIChtYWlsRm9ybSkge1xyXG4gICAgbWFpbEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRNYWlsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcHJlcGFyZVNlbmRNYWlsKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBmb3JtID0gJCh0aGlzKTtcclxuICAgIHZhciBwb3B1cCA9ICQoJy5sLXNlY3Rpb25fX3BvcHVwJyk7XHJcbiAgICB2YXIgcmVzdWx0Q29udGFpbmVyID0gcG9wdXAuZmluZCgnLmwtc2VjdGlvbl9fc3RhdHVzJyk7XHJcbiAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICB1c2VybmFtZTogbWFpbEZvcm0udXNlcm5hbWUudmFsdWUsXHJcbiAgICAgICAgZW1haWw6IG1haWxGb3JtLmVtYWlsLnZhbHVlLFxyXG4gICAgICAgIG1lc3NhZ2U6IG1haWxGb3JtLm1lc3NhZ2UudmFsdWVcclxuICAgIH07XHJcbiAgICByZXN1bHRDb250YWluZXIudGV4dCgn0J7RgtC/0YDQsNCy0LrQsCDRgdC+0L7QsdGJ0LXQvdC40Y8uLi4nKTtcclxuICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG4gICAgc2VuZEFqYXhKc29uKCd3b3JrcycsIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZGF0YSk7XHJcbiAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBmb3JtWzBdLnJlc2V0KCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHNlbmRBamF4SnNvbih1cmwsIGRhdGEsIGNiKSB7XHJcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIGNiKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgfTtcclxuICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZEdldEFqYXhKc29uKHVybCwgZGF0YSwgY2IpIHtcclxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBjYihyZXN1bHQpO1xyXG4gICAgfTtcclxuICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxufVxyXG5cclxuXHJcbi8vIE1vZHVsZXNcclxudmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sLXBhcmFsbGF4X19iZycpLFxyXG4gICAgICAgIHVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubC1kZXZlbG9wZXJfX2NvbnRhaW5lciAuYy11c2VyJyksXHJcbiAgICAgICAgdXNlckJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmwtZGV2ZWxvcGVyX19jb250YWluZXIgLmMtZGV2ZWxvcGVyX19iZycpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbW92ZTogZnVuY3Rpb24gKGJsb2NrLCB3aW5kb3dTY3JvbGwsIHN0cmFmZUNvZWZmaWNpZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBzdHJhZmUgPSAtKHdpbmRvd1Njcm9sbCAvIHN0cmFmZUNvZWZmaWNpZW50KSArICclJztcclxuICAgICAgICAgICAgdmFyIHN0eWxlID0gYmxvY2suc3R5bGU7XHJcbiAgICAgICAgICAgIC8vIFZhciBmb3IgcmVuZGVyaW5nIGJ5IHZpZGVvIHByb2Nlc3NvciAoei1heGlzKVxyXG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyBzdHJhZmUgKyAnLCAwKSc7XHJcbiAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuICAgICAgICAgICAgc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHdpblNjcm9sbCkge1xyXG4gICAgICAgICAgICBpZiAodXNlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJCh3aW5kb3cpLmlubmVyV2lkdGgoKSk7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuaW5uZXJXaWR0aCgpPjc2OCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKGJnLCB3aW5TY3JvbGwsIDEwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUodXNlciwgLXdpblNjcm9sbCwgOSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmUodXNlckJnLCAtd2luU2Nyb2xsLCAxMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxudmFyIHNraWxscyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2tpbGxHcm91cHMgPSBudWxsO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNraWxsR3JvdXBzID0gJCgnLmMtc2tpbGxzX19ncm91cCcpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhza2lsbEdyb3Vwcyk7XHJcbiAgICAgICAgICAgIGlmIChza2lsbEdyb3Vwcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBza2lsbEdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChpLCBza2lsbEdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2tpbGxJdGVtcyA9ICQoc2tpbGxHcm91cCkuZmluZCgnLmMtc2tpbGxfX2NpcmNsZV9vdXRlcicpO1xyXG4gICAgICAgICAgICAgICAgc2tpbGxJdGVtcy5lYWNoKGZ1bmN0aW9uIChpLCBza2lsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNraWxsLnZhbHVlID0gJChza2lsbCkuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHNraWxsKS5hdHRyKCdzdHJva2UtZGFzaG9mZnNldCcsICcxMDAnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyb3c6IGZ1bmN0aW9uICh3U2Nyb2xsKSB7XHJcbiAgICAgICAgICAgIGlmIChza2lsbEdyb3Vwcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dNYXJnaW4gPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjk7XHJcbiAgICAgICAgICAgIHNraWxsR3JvdXBzLmVhY2goZnVuY3Rpb24gKGksIHNraWxsR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cE9mZnNldCA9IHNraWxsR3JvdXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dTY3JvbGw6JyArIHdTY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dpbmRvd01hcmdpbjonICsgd2luZG93TWFyZ2luKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdncm91cE9mZnNldDonICsgZ3JvdXBPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgLy92YXIgc3RhcnRBbmltYXRlID0gd1Njcm9sbCAtIGdyb3VwT2Zmc2V0ICsgd2luZG93TWFyZ2luO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0QW5pbWF0ZSA9IC1ncm91cE9mZnNldCArIHdpbmRvd01hcmdpbjtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGFydEFuaW1hdGU6JyArIHN0YXJ0QW5pbWF0ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGl4ZWxzRWxhcHNlZCA9IGdyb3VwT2Zmc2V0IC0gd1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50c0VsYXBzZWQgPSAxMDAgLSBNYXRoLmNlaWwocGl4ZWxzRWxhcHNlZCAvIHdpbmRvd01hcmdpbiAqIDEwMCk7XHJcbiAgICAgICAgICAgICAgICAvLyAxMDAvMTAwIGJlY2F1c2Ugd2UgaGF2ZSAxMDAgZGFzaGFycmF5LiBJdCBjYW4gYmUgZGlmZmVyZW50IVxyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRzRHJhd24gPSAxMDAgLyAxMDAgKiBwZXJjZW50c0VsYXBzZWQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2tpbGxJdGVtcyA9ICQoc2tpbGxHcm91cCkuZmluZCgnLmMtc2tpbGxfX2NpcmNsZV9vdXRlcicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0QW5pbWF0ZSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRyYXdBbW91bnQgPSAxMDAgLSBwZXJjZW50c0RyYXduO1xyXG4gICAgICAgICAgICAgICAgICAgIHNraWxsSXRlbXMuZWFjaChmdW5jdGlvbiAoaSwgc2tpbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gMTAwIC0gcGFyc2VJbnQoc2tpbGwudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2tpbGxPcGFjaXR5ID0gdmFsdWUgLyAyMDAgKyAwLjY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChza2lsbE9wYWNpdHkgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2tpbGxPcGFjaXR5ID0gMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNraWxsLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hvZmZzZXQnLCBza2lsbC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc2tpbGwpLmNzcygnb3BhY2l0eScsIHNraWxsT3BhY2l0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNraWxsSXRlbXMuZWFjaChmdW5jdGlvbiAoaSwgc2tpbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2tpbGwuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaG9mZnNldCcsICcxMDAnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8vIG1hcFxyXG5cclxudmFyIG1hcDtcclxuZnVuY3Rpb24gaW5pdE1hcCgpIHtcclxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIHZhciBsYXRMbmdDZW50ZXIgPSB7bGF0OiA1NS45MDIsIGxuZzogMzcuNzM3NX07XHJcbiAgICAvLyBpZiAoJCh3aW5kb3cpLndpZHRoKCk8NjAwKXtcclxuICAgIC8vICAgICBsYXRMbmdDZW50ZXIgPSB7bGF0OiA1NS45MDIsIGxuZzogMzcuNzM3NX07XHJcbiAgICAvLyB9XHJcbiAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xyXG4gICAgICAgIGNlbnRlcjogbGF0TG5nQ2VudGVyLFxyXG4gICAgICAgIHpvb206IDE3LFxyXG4gICAgICAgIGRyYWdnYWJsZTogIShcIm9udG91Y2hlbmRcIiBpbiBkb2N1bWVudCksXHJcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxyXG4gICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWUsXHJcbiAgICAgICAgc3R5bGVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy50ZXh0LmZpbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzQ0NDQ0NFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmMmYyZjJcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmF0dHJhY3Rpb25cIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2F0dXJhdGlvblwiOiAtMTAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGlnaHRuZXNzXCI6IDQ1XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVscy5pY29uXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0XCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0LnN0YXRpb24ucmFpbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0MzY5YWFcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJodWVcIjogXCIjMDA1ZWZmXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9KTtcclxuLy8gbWFya2VyXHJcbiAgICB2YXIgbGF0TG5nSG9tZSA9IHtsYXQ6IDU1LjkwMDg1LCBsbmc6IDM3LjczODg1fTtcclxuICAgIHZhciBpbWFnZSA9ICdhc3NldHMvaW1nL21hcmtlci5wbmcnO1xyXG4gICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgIHBvc2l0aW9uOiBsYXRMbmdIb21lLFxyXG4gICAgICAgIG1hcDogbWFwLFxyXG4gICAgICAgIGljb246IGltYWdlXHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gc2xpZGVyIGluaXRpYWxpemF0aW9uXHJcblxyXG4vLyBmb3Igc2xpZGVyXHJcbnZhciByZW1vdmVBY3RpdmVDbGFzcyA9IChmdW5jdGlvbiAocmVxQ2xhc3MpIHtcclxuICAgIHJlcUNsYXNzLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxufSk7XHJcblxyXG52YXIgY2hhbmdlRGVzY3JpcHRpb24gPSAoZnVuY3Rpb24gKGRlc2NyaXB0aW9uLCBpbmRleCkge1xyXG4gICAgdmFyIHNsaWRlclRpdGxlID0gZGVzY3JpcHRpb24uZmluZCgnLmMtc2xpZGVyLXRpdGxlJyksXHJcbiAgICAgICAgc2xpZGVyU2tpbGxzID0gZGVzY3JpcHRpb24uZmluZCgnLmMtc2xpZGVyLWl0ZW1fX3NraWxscycpLFxyXG4gICAgICAgIHNsaWRlckxpbmsgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItYnRuJyk7XHJcbiAgICB2YXIgZGF0YSA9e31cclxuICAgIHNlbmRHZXRBamF4SnNvbignYXBpL3dvcmtzJywgZGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAvLyB2YXIganNvbk9iamVjdCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB2YXIgd29ya3NBcnJheSA9ICQubWFwKGRhdGEsIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3Jrc0FycmF5KTtcclxuICAgICAgICBzbGlkZXJUaXRsZS5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzbGlkZXJUaXRsZS50ZXh0KHdvcmtzQXJyYXlbaW5kZXhdLm5hbWUpO1xyXG4gICAgICAgICAgICBzbGlkZXJUaXRsZS5jc3MoJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgIH0sIDQwMCk7XHJcbiAgICAgICAgc2xpZGVyU2tpbGxzLmNzcygnb3BhY2l0eScsICcwJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNsaWRlclNraWxscy50ZXh0KHdvcmtzQXJyYXlbaW5kZXhdLnRlY2hub2xvZ2llcyk7XHJcbiAgICAgICAgICAgIHNsaWRlclNraWxscy5jc3MoJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgIH0sIDQwMCk7XHJcbiAgICAgICAgc2xpZGVyTGluay5hdHRyKCdocmVmJywgKHdvcmtzQXJyYXlbaW5kZXhdLmxpbmspKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3b3Jrc0FycmF5W2luZGV4XS50aXRsZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2RvY3VtZW50LnJlYWR5Jyk7XHJcbiAgICAvL3NsaWRlci5pbml0KCk7XHJcbiAgICBwYXJhbGxheC5pbml0KCk7XHJcbiAgICBza2lsbHMuaW5pdCgpO1xyXG4gICAgLy8gcHJlbG9hZGVyXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbWdzID0gW107XHJcbiAgICAgICAgJCgnKicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xyXG4gICAgICAgICAgICB2YXIgaXNJbWcgPSAkdGhpcy5pcygnaW1nJyk7XHJcbiAgICAgICAgICAgIHZhciBwYXRoID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChiYWNrZ3JvdW5kICE9PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsICcnKS5yZXBsYWNlKCdcIiknLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKCctZ3JhZGllbnQoJykgIT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGltZ3MucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNJbWcpIHtcclxuICAgICAgICAgICAgICAgIHBhdGggPSAkdGhpcy5hdHRyKCdzcmMnKTtcclxuICAgICAgICAgICAgICAgIGlmICghcGF0aClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpbWdzLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcGVyY2VudHNUb3RhbCA9IDE7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xyXG4gICAgICAgICAgICAgICAgYXR0cjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogaW1nc1tpXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaW1hZ2Uub25lKHtcclxuICAgICAgICAgICAgICAgIGxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRQZXJjZW50cyhpbWdzLmxlbmd0aCwgcGVyY2VudHNUb3RhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudHNUb3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudHNUb3RhbCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gc2V0UGVyY2VudHModG90YWwsIGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcclxuICAgICAgICAgICAgaWYgKHBlcmNlbnQgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucHJlbG9hZGVyJykuZmFkZU91dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQoJy5wcmVsb2FkZXJfX3ZhbHVlJykudGV4dChwZXJjZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICAvLyBmbGlwcGVyJnBhcmFsbGF4XHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB3ZWxjb21lU2VjdGlvbiA9ICQoJy5sLXdlbGNvbWUnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh3ZWxjb21lU2VjdGlvbik7XHJcbiAgICAgICAgaWYgKHdlbGNvbWVTZWN0aW9uLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2luIHdlbGNvbWUnKTtcclxuICAgICAgICAvLyBmbGlwcGVyXHJcbiAgICAgICAgd2VsY29tZVNlY3Rpb24ub24oJ2NsaWNrJywgJ1tkYXRhLWZsaXA9XCJ0b2dnbGVcIl0nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gd2VsY29tZVNlY3Rpb24uZmluZCgnLmwtd2VsY29tZV9fYXV0aC1idG4nKVxyXG4gICAgICAgICAgICB2YXIgZmxpcHBlciA9IHdlbGNvbWVTZWN0aW9uLmZpbmQoJy5sLWZsaXBwZXInKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZmxpcHBlcik7XHJcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IDYwMDtcclxuICAgICAgICAgICAgZmxpcHBlci50b2dnbGVDbGFzcygnbC1mbGlwcGVyX2JhY2snKTtcclxuICAgICAgICAgICAgaWYgKGZsaXBwZXIuaGFzQ2xhc3MoJ2wtZmxpcHBlcl9iYWNrJykpIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBwYXJhbGxheFxyXG4gICAgICAgIHZhciBsYXllckFsbCA9ICQoJy5sLXBhcmFsbGF4X19iZycpO1xyXG4gICAgICAgIHZhciBjbG91ZHMgPSAkKCcuYy1zdGFycy1wYXJhbGxheF9fbGF5ZXInKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgbW91c2VYID0gZS5wYWdlWDtcclxuICAgICAgICAgICAgdmFyIG1vdXNlWSA9IGUucGFnZVk7XHJcbiAgICAgICAgICAgIHZhciB3ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSBtb3VzZVg7XHJcbiAgICAgICAgICAgIHZhciBoID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gbW91c2VZO1xyXG4gICAgICAgICAgICBsYXllckFsbC5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB3UG9zID0gdyAqICgoaSArIDEpIC8gNDApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhQb3MgPSBoICogKChpICsgMSkgLyAzMCk7XHJcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd1BvcyArICdweCwnICsgaFBvcyArICdweCwgMCknXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNsb3Vkcy5tYXAoZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciB3UG9zID0gdyAqICgoaSAqIDkgKyAxKSAvIDkwKTtcclxuICAgICAgICAgICAgICAgIHZhciBoUG9zID0gaCAqICgoaSAqIDQgKyAxKSAvIDEyMCk7XHJcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd1BvcyArICdweCwnICsgaFBvcyArICdweCwgMCknXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLy8gc2xpZGVyIHByZXZfbmV4dCBidXR0b25zXHJcbiAgICAkKCcuYy1zbGlkZXJfX2J1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIHNsaWRlciA9ICQodGhpcykuY2xvc2VzdCgnLmMtc2xpZGVyJyksXHJcbiAgICAgICAgICAgIC8vIHZpZXcgdmFyc1xyXG4gICAgICAgICAgICBzbGlkZXMgPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVyX19zbGlkZXMnKSxcclxuICAgICAgICAgICAgaXRlbXMgPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVzX19pdGVtJyksXHJcbiAgICAgICAgICAgIGFjdGl2ZVNsaWRlID0gaXRlbXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcbiAgICAgICAgICAgIG5leHRTbGlkZSA9IGFjdGl2ZVNsaWRlLm5leHQoKSxcclxuICAgICAgICAgICAgcHJldlNsaWRlID0gYWN0aXZlU2xpZGUucHJldigpLFxyXG4gICAgICAgICAgICBmaXJzdFNsaWRlID0gaXRlbXMuZmlyc3QoKSxcclxuICAgICAgICAgICAgbGFzdFNsaWRlID0gaXRlbXMubGFzdCgpLFxyXG4gICAgICAgICAgICAvLyBkZXNjcmlwdGlvbiB2YXJzXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gc2xpZGVyLmZpbmQoJy5jLXNsaWRlcl9fZGVzY3JpcHRpb24nKSxcclxuXHJcbiAgICAgICAgICAgIC8vIHBhZ2VyIHZhcnNcclxuICAgICAgICAgICAgcGFnZXJMaXN0ID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19saXN0JyksXHJcbiAgICAgICAgICAgIHBhZ2VzID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGFjdGl2ZVBhZ2UgPSBwYWdlcy5maWx0ZXIoJy5hY3RpdmUnKSxcclxuICAgICAgICAgICAgbmV4dFBhZ2UgPSBhY3RpdmVQYWdlLm5leHQoKSxcclxuICAgICAgICAgICAgcHJldlBhZ2UgPSBhY3RpdmVQYWdlLnByZXYoKSxcclxuICAgICAgICAgICAgZmlyc3RQYWdlID0gcGFnZXMuZmlyc3QoKSxcclxuICAgICAgICAgICAgbGFzdFBhZ2UgPSBwYWdlcy5sYXN0KClcclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnYy1zbGlkZXJfX2J1dHRvbl9uZXh0JykpIHtcclxuICAgICAgICAgICAgaWYgKG5leHRTbGlkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKG5leHRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhuZXh0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgbmV4dFNsaWRlLmluZGV4KCkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhmaXJzdFNsaWRlKTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKGZpcnN0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgZmlyc3RTbGlkZS5pbmRleCgpKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmV2U2xpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhwcmV2U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MocHJldlBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIHByZXZTbGlkZS5pbmRleCgpKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MobGFzdFNsaWRlKTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKGxhc3RQYWdlKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uLCBsYXN0U2xpZGUuaW5kZXgoKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHNsaWRlciBwYWdlciBidXR0b25zXHJcbiAgICAkKCcuYy1wYWdlcl9faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGluZGV4ID0gJHRoaXMuaW5kZXgoKSxcclxuICAgICAgICAgICAgc2xpZGVyID0gJCh0aGlzKS5jbG9zZXN0KCcuYy1zbGlkZXInKSxcclxuICAgICAgICAgICAgLy8gdmlldyB2YXJzXHJcbiAgICAgICAgICAgIHNsaWRlcyA9IHNsaWRlci5maW5kKCcuYy1zbGlkZXJfX3NsaWRlcycpLFxyXG4gICAgICAgICAgICBpdGVtcyA9IHNsaWRlci5maW5kKCcuYy1zbGlkZXNfX2l0ZW0nKSxcclxuICAgICAgICAgICAgc2xpZGVUb1Nob3cgPSBpdGVtcy5lcShpbmRleCksXHJcbiAgICAgICAgICAgIC8vIGRlc2NyaXB0aW9uIHZhcnNcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVyX19kZXNjcmlwdGlvbicpLFxyXG4gICAgICAgICAgICBzbGlkZXJUaXRsZSA9IGRlc2NyaXB0aW9uLmZpbmQoJy5jLXNsaWRlci10aXRsZScpLFxyXG4gICAgICAgICAgICBzbGlkZXJTa2lsbHMgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItaXRlbV9fc2tpbGxzJyksXHJcbiAgICAgICAgICAgIHNsaWRlckxpbmsgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItYnRuJyksXHJcbiAgICAgICAgICAgIC8vIHBhZ2VyIHZhcnNcclxuICAgICAgICAgICAgcGFnZXJMaXN0ID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19saXN0JyksXHJcbiAgICAgICAgICAgIHBhZ2VzID0gc2xpZGVyLmZpbmQoJy5jLXBhZ2VyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGNsaWNrZWRQYWdlID0gcGFnZXMuZXEoaW5kZXgpXHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAgICAgaWYgKCEkdGhpcy5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3Moc2xpZGVUb1Nob3cpO1xyXG4gICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhjbGlja2VkUGFnZSk7XHJcbiAgICAgICAgICAgIGNoYW5nZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uLCBzbGlkZVRvU2hvdy5pbmRleCgpKVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIG5hdlxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmMtbWVudS1pY29uJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgd3JhcHBlciA9IHRyaWdnZXIuY2xvc2VzdCgnLmMtbWVudS13cmFwcGVyX21haW4nKTtcclxuICAgICAgICAgICAgdmFyIG1lbnUgPSB3cmFwcGVyLmZpbmQoJy5jLW1lbnUnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cod3JhcHBlcik7XHJcbiAgICAgICAgICAgIGlmICh3cmFwcGVyLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgICAgIG1lbnUuZmFkZU91dCg1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lbnUuc2hvdygwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLy8gYmxvZ1xyXG5cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJy5jLWJsb2cnKTtcclxuICAgICAgICB2YXIgc2lkZWJhciA9IGNvbnRhaW5lci5maW5kKCcuYy1ibG9nLXNpZGViYXInKTtcclxuICAgICAgICBpZiAoc2lkZWJhci5sZW5ndGggPT09IDAgfHwgaXNNb2JpbGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvL3ZhciBjb250YWluZXJCb3R0b20gPSBjb250YWluZXIub2Zmc2V0KCkudG9wICsgY29udGFpbmVyLmhlaWdodCgpIC0gNDA7XHJcbiAgICAgICAgdmFyIGVkZ2VUb3AgPSBzaWRlYmFyLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAvL3ZhciBzaWRlYmFySGVpZ2h0ID0gc2lkZWJhci5oZWlnaHQoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGVkZ2VUb3AgPCAkKHdpbmRvdykuc2Nyb2xsVG9wKCkpIHtcclxuICAgICAgICAgICAgICAgIHNpZGViYXIuYWRkQ2xhc3MoJ2MtYmxvZy1zaWRlYmFyX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLnJlbW92ZUNsYXNzKCdjLWJsb2ctc2lkZWJhcl9maXhlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFydGljbGVBbGwgPSAkKCcuYy1hcnRpY2xlJyk7XHJcbiAgICAgICAgdmFyIGxpbmtzQWxsID0gJCgnLmMtYmxvZy1zaWRlYmFyX19saW5rJyk7XHJcbiAgICAgICAgaWYgKGFydGljbGVBbGwubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgc2hvd1NlY3Rpb24od2luZG93LmxvY2F0aW9uLmhhc2gsIGZhbHNlKTtcclxuICAgICAgICBmdW5jdGlvbiBzaG93U2VjdGlvbihzZWN0aW9uLCBpc0FuaW1hdGUpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHNlY3Rpb24ucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgICAgdmFyIHJlcVNlY3Rpb24gPSBhcnRpY2xlQWxsLmZpbHRlcignW2RhdGEtaWQ9XCInICsgdGFyZ2V0ICsgJ1wiXScpO1xyXG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSA3NTA7XHJcbiAgICAgICAgICAgIGlmIChyZXFTZWN0aW9uLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHJlcVNlY3Rpb25Qb3MgPSByZXFTZWN0aW9uLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgaWYgKGlzQW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcmVxU2VjdGlvblBvc1xyXG4gICAgICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keSwgaHRtbCcpLnNjcm9sbFRvcChyZXFTZWN0aW9uUG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tTZWN0aW9uKCkge1xyXG4gICAgICAgICAgICBhcnRpY2xlQWxsLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnRpY2xlID0gJChpdGVtKTtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BFZGdlID0gYXJ0aWNsZS5vZmZzZXQoKS50b3AgLSAwLjU1KiQod2luZG93KS5pbm5lckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJCh3aW5kb3cpLmlubmVySGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHZhciBib3R0b21FZGdlID0gdG9wRWRnZSArIGFydGljbGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wU2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRvcEVkZ2UgPCB0b3BTY3JvbGwgJiYgYm90dG9tRWRnZSA+IHRvcFNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50SWQgPSBhcnRpY2xlLmRhdGEoJ2lkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcUxpbmsgPSBsaW5rc0FsbC5maWx0ZXIoJ1tocmVmPVwiIycgKyBjdXJyZW50SWQgKyAnXCJdJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxTGluay5jbG9zZXN0KCcuYy1ibG9nLXNpZGViYXJfX2l0ZW0nKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBjdXJyZW50SWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNoZWNrU2VjdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYy1ibG9nLXNpZGViYXJfX2xpbmsnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBzaWRlYmFyID0gJCh0aGlzKS5jbG9zZXN0KCcuYy1ibG9nLXNpZGViYXInKTtcclxuICAgICAgICAgICAgaWYgKHNpZGViYXIuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBzaWRlYmFyLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgc2hvd1NlY3Rpb24oJCh0aGlzKS5hdHRyKCdocmVmJyksIHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmMtYmxvZy1zaWRlYmFyX19idXR0b24nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXIgPSB0cmlnZ2VyLmNsb3Nlc3QoJy5jLWJsb2ctc2lkZWJhcicpO1xyXG4gICAgICAgICAgICBzaWRlYmFyLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLy8gbmV4dC9wcmV2IHNlY3Rpb25zIHNjcm9sbFxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtbW92ZV0nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBidG4gPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gYnRuLmF0dHIoJ2RhdGEtbW92ZScpO1xyXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNjcm9sbFRvUG9zaXRpb24ocG9zaXRpb24sIGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBwb3NpdGlvbiB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgMTAwMDtcclxuICAgICAgICAgICAgICAgICQoXCJib2R5LCBodG1sXCIpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIH0sIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PSAndG9wJykge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9Qb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT0gJ25leHQnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIgPSBidG4uY2xvc2VzdCgnLmwtc2VjdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29udGFpbmVyLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvUG9zaXRpb24oY29udGFpbmVyLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoKTtcclxuXHJcbi8vIEFETUlOIFRBQlNcclxuICAgIC8vIHRhYnMgbWFuYWdlclxyXG4gICAgJCgnLmMtdGFic19faXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGluZGV4ID0gJHRoaXMuaW5kZXgoKSxcclxuICAgICAgICAgICAgYWRtaW5TZWN0aW9uID0gJCh0aGlzKS5jbG9zZXN0KCcubC1hZG1pbicpLFxyXG4gICAgICAgICAgICAvL3RhYnMgPSBhZG1pblNlY3Rpb24uZmluZCgnLmMtdGFic19faXRlbScpLFxyXG4gICAgICAgICAgICBjb250ZW50cyA9IGFkbWluU2VjdGlvbi5maW5kKCcuYy1jb250ZW50LXBhbmVsX19pdGVtJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnRUb1Nob3cgPSBjb250ZW50cy5lcShpbmRleClcclxuXHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICBpZiAoISR0aGlzLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGNvbnRlbnRUb1Nob3cuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gVXBsb2FkIHRyaWdnZXJcclxuICAgICQoJyN1cGxvYWRmaWxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgJChcIiNmaWxlXCIpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gZmlsZVVwbG9hZCh1cmwsIGRhdGEsIGNiKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIGNiKHJlc3VsdC5zdGF0dXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBsb2FkIHdvcmtcclxuICAgIGNvbnN0IHdvcmtzRm9ybSA9ICQoJyNhZG1pbi13b3JrcycpO1xyXG5cclxuICAgIGlmICh3b3Jrc0Zvcm0pIHtcclxuICAgICAgICB3b3Jrc0Zvcm0ub24oJ3N1Ym1pdCcsIHByZXBhcmVTZW5kRmlsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNlbmRGaWxlKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciBwb3B1cCA9ICQoJy5sLWFkbWluX19wb3B1cCcpO1xyXG4gICAgICAgIHZhciByZXN1bHRDb250YWluZXIgPSBwb3B1cC5maW5kKCcubC1hZG1pbl9fc3RhdHVzJyk7XHJcbiAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgdmFyIGZpbGUgPSAkKCcjZmlsZScpLmdldCgwKS5maWxlc1swXTtcclxuICAgICAgICB2YXIgbmFtZSA9ICQoJyNuYW1lJykudmFsKCk7XHJcbiAgICAgICAgdmFyIHRlY2hub2xvZ2llcyA9ICQoJyN0ZWNobm9sb2dpZXMnKS52YWwoKTtcclxuICAgICAgICB2YXIgbGluayA9ICQoJyNsaW5rJykudmFsKCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdpbWFnZScsIGZpbGUsIGZpbGUubmFtZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCduYW1lJywgbmFtZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCd0ZWNobm9sb2dpZXMnLCB0ZWNobm9sb2dpZXMpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnbGluaycsIGxpbmspO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdENvbnRhaW5lcik7XHJcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoJ1VwbG9hZGluZy4uLicpO1xyXG4gICAgICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG4gICAgICAgIGZpbGVVcGxvYWQoJy9hZG1pbi93b3JrcycsIGZvcm1EYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVwLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICAgIGZvcm1bMF0ucmVzZXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBCbG9nIEZvcm1cclxuICAgIHZhciBibG9nRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZG1pbi1ibG9nJyk7XHJcblxyXG4gICAgaWYgKGJsb2dGb3JtKSB7XHJcbiAgICAgICAgYmxvZ0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRQb3N0KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVwYXJlU2VuZFBvc3QoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIHBvcHVwID0gJCgnLmwtYWRtaW5fX3BvcHVwJyk7XHJcbiAgICAgICAgdmFyIHJlc3VsdENvbnRhaW5lciA9IHBvcHVwLmZpbmQoJy5sLWFkbWluX19zdGF0dXMnKTtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IGJsb2dGb3JtLnRpdGxlLnZhbHVlLFxyXG4gICAgICAgICAgICBkYXRlOiBibG9nRm9ybS5kYXRlLnZhbHVlLFxyXG4gICAgICAgICAgICBjb250ZW50OiBibG9nRm9ybS5jb250ZW50LnZhbHVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXN1bHRDb250YWluZXIudGV4dCgnU2F2aW5nIGRhdGEuLi4nKTtcclxuICAgICAgICBwb3B1cC5kZWxheSgyMDApLmZhZGVJbigxMDAwKTtcclxuICAgICAgICBzZW5kQWpheEpzb24oJy9hZG1pbi9ibG9nJywgZGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1cC5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgICBmb3JtWzBdLnJlc2V0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2tpbGxzIGZvcm1cclxuXHJcbiAgICB2YXIgc2tpbGxzRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZG1pbi1za2lsbHMnKTtcclxuXHJcbiAgICBpZiAoc2tpbGxzRm9ybSkge1xyXG4gICAgICAgIHNraWxsc0Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRTa2lsbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZXBhcmVTZW5kU2tpbGxzKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIHBvcHVwID0gJCgnLmwtYWRtaW5fX3BvcHVwJyk7XHJcbiAgICAgICAgdmFyIHJlc3VsdENvbnRhaW5lciA9IHBvcHVwLmZpbmQoJy5sLWFkbWluX19zdGF0dXMnKTtcclxuICAgICAgICB2YXIgc2tpbGxzID0gJCgnLmMtYWRtaW4tc2tpbGxzJyk7XHJcbiAgICAgICAgdmFyIHNraWxsR3JvdXBzID0gc2tpbGxzLmZpbmQoJy5jLWFkbWluLXNraWxsc19fZ3JvdXAnKTtcclxuICAgICAgICB2YXIgZGF0YSA9IHt9O1xyXG5cclxuICAgICAgICBza2lsbEdyb3Vwcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBza2lsbEdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGdyb3VwVGl0bGUgPSBza2lsbEdyb3VwLmZpbmQoJy5jLWFkbWluLWdyb3VwX190aXRsZScpLnRleHQoKTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gc2tpbGxHcm91cC5maW5kKCcuYy1hZG1pbi1za2lsbCcpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbU9iaiA9IHt9O1xyXG5cclxuICAgICAgICAgICAgaXRlbXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2tpbGxOYW1lID0gaXRlbS5maW5kKCcuYy1hZG1pbi1za2lsbF9fdGl0bGUnKS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2tpbGxWYWx1ZSA9IGl0ZW0uZmluZCgnLmMtYWRtaW4tZm9ybV9faW5wdXRfc2tpbGxzJykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbU9ialtza2lsbE5hbWVdID0gc2tpbGxWYWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRhdGFbZ3JvdXBUaXRsZV0gPSBpdGVtT2JqO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoJ1NhdmluZyBkYXRhLi4uJyk7XHJcbiAgICAgICAgcG9wdXAuZGVsYXkoMjAwKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgc2VuZEFqYXhKc29uKCcvYWRtaW4vYWJvdXQnLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVwLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXV0aCBmb3JtXHJcblxyXG4gICAgLy8gQ2hlY2tib3hcclxuICAgIHZhciBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jLWNoZWNrYm94X19pbnB1dCcpO1xyXG5cclxuICAgIGlmIChjaGVja2JveCkge1xyXG4gICAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZmllbGRfZXJyb3InKS5yZW1vdmVDbGFzcygnZmllbGRfb2snKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYXV0aEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXV0aC1mb3JtJyk7XHJcblxyXG4gICAgaWYgKGF1dGhGb3JtKSB7XHJcbiAgICAgICAgYXV0aEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRBdXRoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVwYXJlU2VuZEF1dGgoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcG9wdXAgPSAkKCcubC1zZWN0aW9uX19wb3B1cCcpO1xyXG4gICAgICAgIHZhciByZXN1bHRDb250YWluZXIgPSBwb3B1cC5maW5kKCcubC1zZWN0aW9uX19zdGF0dXMnKTtcclxuICAgICAgICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIHZhbGlkYXRpb25JbmZvID0gdmFsaWRhdGVBdXRoKGZvcm0pO1xyXG4gICAgICAgIGlmICghdmFsaWRhdGlvbkluZm8uaXNWYWxpZGF0ZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codmFsaWRhdGlvbkluZm8uZXJyb3JzKTtcclxuICAgICAgICAgICAgcG9wdXAuZGVsYXkoMjAwKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAgICQodmFsaWRhdGlvbkluZm8uZXJyb3JzKS5lYWNoKGZ1bmN0aW9uIChpLCBlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb250YWluZXIudGV4dChlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGF1dGhGb3JtLnVzZXJuYW1lLnZhbHVlLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogYXV0aEZvcm0ucGFzc3dvcmQudmFsdWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXN1bHRDb250YWluZXIudGV4dCgn0J/RgNC+0LLQtdGA0LrQsCDQtNCw0L3QvdGL0YUuLi4nKTtcclxuICAgICAgICBwb3B1cC5kZWxheSgyMDApLmZhZGVJbigxMDAwKTtcclxuXHJcbiAgICAgICAgc2VuZEFqYXhKc29uKCcvYWRtaW4nLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVwLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEucmVkaXJlY3QpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSA9PSAn0JDQstGC0L7RgNC40LfQsNGG0LjRjyDRg9GB0L/QtdGI0L3QsCEnKVxyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9hZG1pbic7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVBdXRoKGZvcm0pIHtcclxuICAgICAgICB2YXIgaW5wdXRzID0gZm9ybS5maW5kKCdbcmVxdWlyZWRdJyk7XHJcbiAgICAgICAgdmFyIGlzVmFsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZXJyb3JzID0gW107XHJcbiAgICAgICAgdmFyIGZsYWcxID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIGZsYWcyID0gZmFsc2U7XHJcbiAgICAgICAgaW5wdXRzLnJlbW92ZUNsYXNzKCdmaWVsZC0tZXJyb3InKTtcclxuICAgICAgICBpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgaW5wdXQgPSAkKGl0ZW0pO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBpbnB1dC52YWwoKTtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBpbnB1dC5hdHRyKCd0eXBlJyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuaXMoJzpjaGVja2VkJykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuYWRkQ2xhc3MoJ2ZpZWxkX2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZsYWcxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCgn0JLRiyDRgtC+0YfQvdC+INC90LUg0YDQvtCx0L7Rgj8nKTtcclxuICAgICAgICAgICAgICAgICAgICBmbGFnMSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUudHJpbSgpID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC5hZGRDbGFzcygnZmllbGRfZXJyb3InKTtcclxuICAgICAgICAgICAgICAgIGlzVmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWZsYWcyKVxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKCfQktGLINC30LDQsdGL0LvQuCDQstCy0LXRgdGC0Lgg0LTQsNC90L3Ri9C1Jyk7XHJcbiAgICAgICAgICAgICAgICBmbGFnMiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC5yZW1vdmVDbGFzcygnZmllbGRfZXJyb3InKS5hZGRDbGFzcygnZmllbGRfb2snKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcImlzVmFsaWRhdGVkXCI6IGlzVmFsaWRhdGVkLFxyXG4gICAgICAgICAgICBcImVycm9yc1wiOiBlcnJvcnNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbn0pO1xyXG5cclxuLy8gRXZlbnRzXHJcbiQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbG9hZGVkJyk7XHJcbn0pO1xyXG5cclxud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHdpblNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICAgIHBhcmFsbGF4LmluaXQod2luU2Nyb2xsKTtcclxuICAgIC8vaWYgKHdpblNjcm9sbCA+IGlubmVySGVpZ2h0IC8gMS44KSB7XHJcbiAgICBza2lsbHMuZ3Jvdyh3aW5TY3JvbGwpO1xyXG4gICAgLy99XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5vbignZm9jdXMnLCAnLmMtZm9ybV9faW5wdXQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZmllbGRfZXJyb3InKS5yZW1vdmVDbGFzcygnZmllbGRfb2snKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5vbigncmVzZXQnLCAnLmMtZm9ybScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAkKHRoaXMpLmZpbmQoJy5jLWZvcm1fX2lucHV0JykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX2Vycm9yJykucmVtb3ZlQ2xhc3MoJ2ZpZWxkX29rJyk7XHJcbn0pOyJdfQ==
