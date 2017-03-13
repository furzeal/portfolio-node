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
                var topEdge = article.offset().top - 350;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcbnZhciBpc01vYmlsZSA9IC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbi8vIEZvcm1zXHJcbi8vIE1haWwgRm9ybVxyXG52YXIgbWFpbEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbC1mb3JtJyk7XHJcblxyXG5pZiAobWFpbEZvcm0pIHtcclxuICAgIG1haWxGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHByZXBhcmVTZW5kTWFpbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVTZW5kTWFpbChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgICB2YXIgcG9wdXAgPSAkKCcubC1zZWN0aW9uX19wb3B1cCcpO1xyXG4gICAgdmFyIHJlc3VsdENvbnRhaW5lciA9IHBvcHVwLmZpbmQoJy5sLXNlY3Rpb25fX3N0YXR1cycpO1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgdXNlcm5hbWU6IG1haWxGb3JtLnVzZXJuYW1lLnZhbHVlLFxyXG4gICAgICAgIGVtYWlsOiBtYWlsRm9ybS5lbWFpbC52YWx1ZSxcclxuICAgICAgICBtZXNzYWdlOiBtYWlsRm9ybS5tZXNzYWdlLnZhbHVlXHJcbiAgICB9O1xyXG4gICAgcmVzdWx0Q29udGFpbmVyLnRleHQoJ9Ce0YLQv9GA0LDQstC60LAg0YHQvtC+0LHRidC10L3QuNGPLi4uJyk7XHJcbiAgICBwb3B1cC5kZWxheSgyMDApLmZhZGVJbigxMDAwKTtcclxuICAgIHNlbmRBamF4SnNvbignd29ya3MnLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KGRhdGEpO1xyXG4gICAgICAgIHBvcHVwLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgZm9ybVswXS5yZXNldCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzZW5kQWpheEpzb24odXJsLCBkYXRhLCBjYikge1xyXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICBjYihyZXN1bHQuc3RhdHVzKTtcclxuICAgIH07XHJcbiAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlbmRHZXRBamF4SnNvbih1cmwsIGRhdGEsIGNiKSB7XHJcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgY2IocmVzdWx0KTtcclxuICAgIH07XHJcbiAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbn1cclxuXHJcblxyXG4vLyBNb2R1bGVzXHJcbnZhciBwYXJhbGxheCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubC1wYXJhbGxheF9fYmcnKSxcclxuICAgICAgICB1c2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmwtZGV2ZWxvcGVyX19jb250YWluZXIgLmMtdXNlcicpLFxyXG4gICAgICAgIHVzZXJCZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sLWRldmVsb3Blcl9fY29udGFpbmVyIC5jLWRldmVsb3Blcl9fYmcnKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG1vdmU6IGZ1bmN0aW9uIChibG9jaywgd2luZG93U2Nyb2xsLCBzdHJhZmVDb2VmZmljaWVudCkge1xyXG4gICAgICAgICAgICB2YXIgc3RyYWZlID0gLSh3aW5kb3dTY3JvbGwgLyBzdHJhZmVDb2VmZmljaWVudCkgKyAnJSc7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IGJsb2NrLnN0eWxlO1xyXG4gICAgICAgICAgICAvLyBWYXIgZm9yIHJlbmRlcmluZyBieSB2aWRlbyBwcm9jZXNzb3IgKHotYXhpcylcclxuICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUzZCgwLCAnICsgc3RyYWZlICsgJywgMCknO1xyXG4gICAgICAgICAgICBzdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XHJcbiAgICAgICAgICAgIHN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICh3aW5TY3JvbGwpIHtcclxuICAgICAgICAgICAgaWYgKHVzZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCQod2luZG93KS5pbm5lcldpZHRoKCkpO1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLmlubmVyV2lkdGgoKT43NjgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW92ZShiZywgd2luU2Nyb2xsLCAxMDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKHVzZXIsIC13aW5TY3JvbGwsIDkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlKHVzZXJCZywgLXdpblNjcm9sbCwgMTMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcbnZhciBza2lsbHMgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNraWxsR3JvdXBzID0gbnVsbDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBza2lsbEdyb3VwcyA9ICQoJy5jLXNraWxsc19fZ3JvdXAnKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coc2tpbGxHcm91cHMpO1xyXG4gICAgICAgICAgICBpZiAoc2tpbGxHcm91cHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2tpbGxHcm91cHMuZWFjaChmdW5jdGlvbiAoaSwgc2tpbGxHcm91cCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNraWxsSXRlbXMgPSAkKHNraWxsR3JvdXApLmZpbmQoJy5jLXNraWxsX19jaXJjbGVfb3V0ZXInKTtcclxuICAgICAgICAgICAgICAgIHNraWxsSXRlbXMuZWFjaChmdW5jdGlvbiAoaSwgc2tpbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBza2lsbC52YWx1ZSA9ICQoc2tpbGwpLmF0dHIoJ3N0cm9rZS1kYXNob2Zmc2V0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChza2lsbCkuYXR0cignc3Ryb2tlLWRhc2hvZmZzZXQnLCAnMTAwJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBncm93OiBmdW5jdGlvbiAod1Njcm9sbCkge1xyXG4gICAgICAgICAgICBpZiAoc2tpbGxHcm91cHMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgd2luZG93TWFyZ2luID0gd2luZG93LmlubmVySGVpZ2h0ICogMC45O1xyXG4gICAgICAgICAgICBza2lsbEdyb3Vwcy5lYWNoKGZ1bmN0aW9uIChpLCBza2lsbEdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBPZmZzZXQgPSBza2lsbEdyb3VwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3U2Nyb2xsOicgKyB3U2Nyb2xsKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3aW5kb3dNYXJnaW46JyArIHdpbmRvd01hcmdpbik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ3JvdXBPZmZzZXQ6JyArIGdyb3VwT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIC8vdmFyIHN0YXJ0QW5pbWF0ZSA9IHdTY3JvbGwgLSBncm91cE9mZnNldCArIHdpbmRvd01hcmdpbjtcclxuICAgICAgICAgICAgICAgIHZhciBzdGFydEFuaW1hdGUgPSAtZ3JvdXBPZmZzZXQgKyB3aW5kb3dNYXJnaW47XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRBbmltYXRlOicgKyBzdGFydEFuaW1hdGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBpeGVsc0VsYXBzZWQgPSBncm91cE9mZnNldCAtIHdTY3JvbGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudHNFbGFwc2VkID0gMTAwIC0gTWF0aC5jZWlsKHBpeGVsc0VsYXBzZWQgLyB3aW5kb3dNYXJnaW4gKiAxMDApO1xyXG4gICAgICAgICAgICAgICAgLy8gMTAwLzEwMCBiZWNhdXNlIHdlIGhhdmUgMTAwIGRhc2hhcnJheS4gSXQgY2FuIGJlIGRpZmZlcmVudCFcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50c0RyYXduID0gMTAwIC8gMTAwICogcGVyY2VudHNFbGFwc2VkO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNraWxsSXRlbXMgPSAkKHNraWxsR3JvdXApLmZpbmQoJy5jLXNraWxsX19jaXJjbGVfb3V0ZXInKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydEFuaW1hdGUgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkcmF3QW1vdW50ID0gMTAwIC0gcGVyY2VudHNEcmF3bjtcclxuICAgICAgICAgICAgICAgICAgICBza2lsbEl0ZW1zLmVhY2goZnVuY3Rpb24gKGksIHNraWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IDEwMCAtIHBhcnNlSW50KHNraWxsLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNraWxsT3BhY2l0eSA9IHZhbHVlIC8gMjAwICsgMC42O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2tpbGxPcGFjaXR5ID49IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNraWxsT3BhY2l0eSA9IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBza2lsbC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNob2Zmc2V0Jywgc2tpbGwudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHNraWxsKS5jc3MoJ29wYWNpdHknLCBza2lsbE9wYWNpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBza2lsbEl0ZW1zLmVhY2goZnVuY3Rpb24gKGksIHNraWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNraWxsLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hvZmZzZXQnLCAnMTAwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vLyBtYXBcclxuXHJcbnZhciBtYXA7XHJcbmZ1bmN0aW9uIGluaXRNYXAoKSB7XHJcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgbGF0TG5nQ2VudGVyID0ge2xhdDogNTUuOTAyLCBsbmc6IDM3LjczNzV9O1xyXG4gICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpPDYwMCl7XHJcbiAgICAvLyAgICAgbGF0TG5nQ2VudGVyID0ge2xhdDogNTUuOTAyLCBsbmc6IDM3LjczNzV9O1xyXG4gICAgLy8gfVxyXG4gICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcclxuICAgICAgICBjZW50ZXI6IGxhdExuZ0NlbnRlcixcclxuICAgICAgICB6b29tOiAxNyxcclxuICAgICAgICBkcmFnZ2FibGU6ICEoXCJvbnRvdWNoZW5kXCIgaW4gZG9jdW1lbnQpLFxyXG4gICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlLFxyXG4gICAgICAgIHN0eWxlczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMudGV4dC5maWxsXCIsXHJcbiAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0NDQ0NDRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZjJmMmYyXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5hdHRyYWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNhdHVyYXRpb25cIjogLTEwMFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxpZ2h0bmVzc1wiOiA0NVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdC5zdGF0aW9uLnJhaWxcIixcclxuICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9uXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxyXG4gICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNDM2OWFhXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXHJcbiAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcclxuICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaHVlXCI6IFwiIzAwNWVmZlwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSk7XHJcbi8vIG1hcmtlclxyXG4gICAgdmFyIGxhdExuZ0hvbWUgPSB7bGF0OiA1NS45MDA4NSwgbG5nOiAzNy43Mzg4NX07XHJcbiAgICB2YXIgaW1hZ2UgPSAnYXNzZXRzL2ltZy9tYXJrZXIucG5nJztcclxuICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICBwb3NpdGlvbjogbGF0TG5nSG9tZSxcclxuICAgICAgICBtYXA6IG1hcCxcclxuICAgICAgICBpY29uOiBpbWFnZVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIHNsaWRlciBpbml0aWFsaXphdGlvblxyXG5cclxuLy8gZm9yIHNsaWRlclxyXG52YXIgcmVtb3ZlQWN0aXZlQ2xhc3MgPSAoZnVuY3Rpb24gKHJlcUNsYXNzKSB7XHJcbiAgICByZXFDbGFzcy5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbn0pO1xyXG5cclxudmFyIGNoYW5nZURlc2NyaXB0aW9uID0gKGZ1bmN0aW9uIChkZXNjcmlwdGlvbiwgaW5kZXgpIHtcclxuICAgIHZhciBzbGlkZXJUaXRsZSA9IGRlc2NyaXB0aW9uLmZpbmQoJy5jLXNsaWRlci10aXRsZScpLFxyXG4gICAgICAgIHNsaWRlclNraWxscyA9IGRlc2NyaXB0aW9uLmZpbmQoJy5jLXNsaWRlci1pdGVtX19za2lsbHMnKSxcclxuICAgICAgICBzbGlkZXJMaW5rID0gZGVzY3JpcHRpb24uZmluZCgnLmMtc2xpZGVyLWJ0bicpO1xyXG4gICAgdmFyIGRhdGEgPXt9XHJcbiAgICBzZW5kR2V0QWpheEpzb24oJ2FwaS93b3JrcycsIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgLy8gdmFyIGpzb25PYmplY3QgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgdmFyIHdvcmtzQXJyYXkgPSAkLm1hcChkYXRhLCBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cod29ya3NBcnJheSk7XHJcbiAgICAgICAgc2xpZGVyVGl0bGUuY3NzKCdvcGFjaXR5JywgJzAnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2xpZGVyVGl0bGUudGV4dCh3b3Jrc0FycmF5W2luZGV4XS5uYW1lKTtcclxuICAgICAgICAgICAgc2xpZGVyVGl0bGUuY3NzKCdvcGFjaXR5JywgJzEnKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICAgIHNsaWRlclNraWxscy5jc3MoJ29wYWNpdHknLCAnMCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzbGlkZXJTa2lsbHMudGV4dCh3b3Jrc0FycmF5W2luZGV4XS50ZWNobm9sb2dpZXMpO1xyXG4gICAgICAgICAgICBzbGlkZXJTa2lsbHMuY3NzKCdvcGFjaXR5JywgJzEnKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICAgIHNsaWRlckxpbmsuYXR0cignaHJlZicsICh3b3Jrc0FycmF5W2luZGV4XS5saW5rKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cod29ya3NBcnJheVtpbmRleF0udGl0bGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdkb2N1bWVudC5yZWFkeScpO1xyXG4gICAgLy9zbGlkZXIuaW5pdCgpO1xyXG4gICAgcGFyYWxsYXguaW5pdCgpO1xyXG4gICAgc2tpbGxzLmluaXQoKTtcclxuICAgIC8vIHByZWxvYWRlclxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW1ncyA9IFtdO1xyXG4gICAgICAgICQoJyonKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGJhY2tncm91bmQgPSAkdGhpcy5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcclxuICAgICAgICAgICAgdmFyIGlzSW1nID0gJHRoaXMuaXMoJ2ltZycpO1xyXG4gICAgICAgICAgICB2YXIgcGF0aCA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoYmFja2dyb3VuZCAhPT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gYmFja2dyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGguaW5kZXhPZignLWdyYWRpZW50KCcpICE9PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpbWdzLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzSW1nKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gJHRoaXMuYXR0cignc3JjJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaW1ncy5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHBlcmNlbnRzVG90YWwgPSAxO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSAkKCc8aW1nPicsIHtcclxuICAgICAgICAgICAgICAgIGF0dHI6IHtcclxuICAgICAgICAgICAgICAgICAgICBzcmM6IGltZ3NbaV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGltYWdlLm9uZSh7XHJcbiAgICAgICAgICAgICAgICBsb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0UGVyY2VudHMoaW1ncy5sZW5ndGgsIHBlcmNlbnRzVG90YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnRzVG90YWwrKztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnRzVG90YWwrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFBlcmNlbnRzKHRvdGFsLCBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcbiAgICAgICAgICAgIGlmIChwZXJjZW50ID49IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnByZWxvYWRlcicpLmZhZGVPdXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKCcucHJlbG9hZGVyX192YWx1ZScpLnRleHQocGVyY2VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLy8gZmxpcHBlciZwYXJhbGxheFxyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgd2VsY29tZVNlY3Rpb24gPSAkKCcubC13ZWxjb21lJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cod2VsY29tZVNlY3Rpb24pO1xyXG4gICAgICAgIGlmICh3ZWxjb21lU2VjdGlvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdpbiB3ZWxjb21lJyk7XHJcbiAgICAgICAgLy8gZmxpcHBlclxyXG4gICAgICAgIHdlbGNvbWVTZWN0aW9uLm9uKCdjbGljaycsICdbZGF0YS1mbGlwPVwidG9nZ2xlXCJdJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IHdlbGNvbWVTZWN0aW9uLmZpbmQoJy5sLXdlbGNvbWVfX2F1dGgtYnRuJylcclxuICAgICAgICAgICAgdmFyIGZsaXBwZXIgPSB3ZWxjb21lU2VjdGlvbi5maW5kKCcubC1mbGlwcGVyJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZsaXBwZXIpO1xyXG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSA2MDA7XHJcbiAgICAgICAgICAgIGZsaXBwZXIudG9nZ2xlQ2xhc3MoJ2wtZmxpcHBlcl9iYWNrJyk7XHJcbiAgICAgICAgICAgIGlmIChmbGlwcGVyLmhhc0NsYXNzKCdsLWZsaXBwZXJfYmFjaycpKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gcGFyYWxsYXhcclxuICAgICAgICB2YXIgbGF5ZXJBbGwgPSAkKCcubC1wYXJhbGxheF9fYmcnKTtcclxuICAgICAgICB2YXIgY2xvdWRzID0gJCgnLmMtc3RhcnMtcGFyYWxsYXhfX2xheWVyJyk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIG1vdXNlWCA9IGUucGFnZVg7XHJcbiAgICAgICAgICAgIHZhciBtb3VzZVkgPSBlLnBhZ2VZO1xyXG4gICAgICAgICAgICB2YXIgdyA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gbW91c2VYO1xyXG4gICAgICAgICAgICB2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlWTtcclxuICAgICAgICAgICAgbGF5ZXJBbGwubWFwKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd1BvcyA9IHcgKiAoKGkgKyAxKSAvIDQwKTtcclxuICAgICAgICAgICAgICAgIHZhciBoUG9zID0gaCAqICgoaSArIDEpIC8gMzApO1xyXG4gICAgICAgICAgICAgICAgJChpdGVtKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHdQb3MgKyAncHgsJyArIGhQb3MgKyAncHgsIDApJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjbG91ZHMubWFwKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd1BvcyA9IHcgKiAoKGkgKiA5ICsgMSkgLyA5MCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaFBvcyA9IGggKiAoKGkgKiA0ICsgMSkgLyAxMjApO1xyXG4gICAgICAgICAgICAgICAgJChpdGVtKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHdQb3MgKyAncHgsJyArIGhQb3MgKyAncHgsIDApJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIC8vIHNsaWRlciBwcmV2X25leHQgYnV0dG9uc1xyXG4gICAgJCgnLmMtc2xpZGVyX19idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBzbGlkZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5jLXNsaWRlcicpLFxyXG4gICAgICAgICAgICAvLyB2aWV3IHZhcnNcclxuICAgICAgICAgICAgc2xpZGVzID0gc2xpZGVyLmZpbmQoJy5jLXNsaWRlcl9fc2xpZGVzJyksXHJcbiAgICAgICAgICAgIGl0ZW1zID0gc2xpZGVyLmZpbmQoJy5jLXNsaWRlc19faXRlbScpLFxyXG4gICAgICAgICAgICBhY3RpdmVTbGlkZSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLFxyXG4gICAgICAgICAgICBuZXh0U2xpZGUgPSBhY3RpdmVTbGlkZS5uZXh0KCksXHJcbiAgICAgICAgICAgIHByZXZTbGlkZSA9IGFjdGl2ZVNsaWRlLnByZXYoKSxcclxuICAgICAgICAgICAgZmlyc3RTbGlkZSA9IGl0ZW1zLmZpcnN0KCksXHJcbiAgICAgICAgICAgIGxhc3RTbGlkZSA9IGl0ZW1zLmxhc3QoKSxcclxuICAgICAgICAgICAgLy8gZGVzY3JpcHRpb24gdmFyc1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IHNsaWRlci5maW5kKCcuYy1zbGlkZXJfX2Rlc2NyaXB0aW9uJyksXHJcblxyXG4gICAgICAgICAgICAvLyBwYWdlciB2YXJzXHJcbiAgICAgICAgICAgIHBhZ2VyTGlzdCA9IHNsaWRlci5maW5kKCcuYy1wYWdlcl9fbGlzdCcpLFxyXG4gICAgICAgICAgICBwYWdlcyA9IHNsaWRlci5maW5kKCcuYy1wYWdlcl9faXRlbScpLFxyXG4gICAgICAgICAgICBhY3RpdmVQYWdlID0gcGFnZXMuZmlsdGVyKCcuYWN0aXZlJyksXHJcbiAgICAgICAgICAgIG5leHRQYWdlID0gYWN0aXZlUGFnZS5uZXh0KCksXHJcbiAgICAgICAgICAgIHByZXZQYWdlID0gYWN0aXZlUGFnZS5wcmV2KCksXHJcbiAgICAgICAgICAgIGZpcnN0UGFnZSA9IHBhZ2VzLmZpcnN0KCksXHJcbiAgICAgICAgICAgIGxhc3RQYWdlID0gcGFnZXMubGFzdCgpXHJcbiAgICAgICAgICAgIDtcclxuICAgICAgICBpZiAoJHRoaXMuaGFzQ2xhc3MoJ2Mtc2xpZGVyX19idXR0b25fbmV4dCcpKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXh0U2xpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhuZXh0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MobmV4dFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIG5leHRTbGlkZS5pbmRleCgpKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MoZmlyc3RTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhmaXJzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIGZpcnN0U2xpZGUuaW5kZXgoKSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJldlNsaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MocHJldlNsaWRlKTtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKHByZXZQYWdlKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZURlc2NyaXB0aW9uKGRlc2NyaXB0aW9uLCBwcmV2U2xpZGUuaW5kZXgoKSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKGxhc3RTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVBY3RpdmVDbGFzcyhsYXN0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgbGFzdFNsaWRlLmluZGV4KCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBzbGlkZXIgcGFnZXIgYnV0dG9uc1xyXG4gICAgJCgnLmMtcGFnZXJfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBpbmRleCA9ICR0aGlzLmluZGV4KCksXHJcbiAgICAgICAgICAgIHNsaWRlciA9ICQodGhpcykuY2xvc2VzdCgnLmMtc2xpZGVyJyksXHJcbiAgICAgICAgICAgIC8vIHZpZXcgdmFyc1xyXG4gICAgICAgICAgICBzbGlkZXMgPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVyX19zbGlkZXMnKSxcclxuICAgICAgICAgICAgaXRlbXMgPSBzbGlkZXIuZmluZCgnLmMtc2xpZGVzX19pdGVtJyksXHJcbiAgICAgICAgICAgIHNsaWRlVG9TaG93ID0gaXRlbXMuZXEoaW5kZXgpLFxyXG4gICAgICAgICAgICAvLyBkZXNjcmlwdGlvbiB2YXJzXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gc2xpZGVyLmZpbmQoJy5jLXNsaWRlcl9fZGVzY3JpcHRpb24nKSxcclxuICAgICAgICAgICAgc2xpZGVyVGl0bGUgPSBkZXNjcmlwdGlvbi5maW5kKCcuYy1zbGlkZXItdGl0bGUnKSxcclxuICAgICAgICAgICAgc2xpZGVyU2tpbGxzID0gZGVzY3JpcHRpb24uZmluZCgnLmMtc2xpZGVyLWl0ZW1fX3NraWxscycpLFxyXG4gICAgICAgICAgICBzbGlkZXJMaW5rID0gZGVzY3JpcHRpb24uZmluZCgnLmMtc2xpZGVyLWJ0bicpLFxyXG4gICAgICAgICAgICAvLyBwYWdlciB2YXJzXHJcbiAgICAgICAgICAgIHBhZ2VyTGlzdCA9IHNsaWRlci5maW5kKCcuYy1wYWdlcl9fbGlzdCcpLFxyXG4gICAgICAgICAgICBwYWdlcyA9IHNsaWRlci5maW5kKCcuYy1wYWdlcl9faXRlbScpLFxyXG4gICAgICAgICAgICBjbGlja2VkUGFnZSA9IHBhZ2VzLmVxKGluZGV4KVxyXG4gICAgICAgICAgICA7XHJcbiAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgICAgIGlmICghJHRoaXMuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUFjdGl2ZUNsYXNzKHNsaWRlVG9TaG93KTtcclxuICAgICAgICAgICAgcmVtb3ZlQWN0aXZlQ2xhc3MoY2xpY2tlZFBhZ2UpO1xyXG4gICAgICAgICAgICBjaGFuZ2VEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgc2xpZGVUb1Nob3cuaW5kZXgoKSlcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBuYXZcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jLW1lbnUtaWNvbicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSB0cmlnZ2VyLmNsb3Nlc3QoJy5jLW1lbnUtd3JhcHBlcl9tYWluJyk7XHJcbiAgICAgICAgICAgIHZhciBtZW51ID0gd3JhcHBlci5maW5kKCcuYy1tZW51Jyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdyYXBwZXIpO1xyXG4gICAgICAgICAgICBpZiAod3JhcHBlci5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgICAgICBtZW51LmZhZGVPdXQoNTAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtZW51LnNob3coMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8vIGJsb2dcclxuXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjb250YWluZXIgPSAkKCcuYy1ibG9nJyk7XHJcbiAgICAgICAgdmFyIHNpZGViYXIgPSBjb250YWluZXIuZmluZCgnLmMtYmxvZy1zaWRlYmFyJyk7XHJcbiAgICAgICAgaWYgKHNpZGViYXIubGVuZ3RoID09PSAwIHx8IGlzTW9iaWxlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy92YXIgY29udGFpbmVyQm90dG9tID0gY29udGFpbmVyLm9mZnNldCgpLnRvcCArIGNvbnRhaW5lci5oZWlnaHQoKSAtIDQwO1xyXG4gICAgICAgIHZhciBlZGdlVG9wID0gc2lkZWJhci5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgLy92YXIgc2lkZWJhckhlaWdodCA9IHNpZGViYXIuaGVpZ2h0KCk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChlZGdlVG9wIDwgJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSB7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmFkZENsYXNzKCdjLWJsb2ctc2lkZWJhcl9maXhlZCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5yZW1vdmVDbGFzcygnYy1ibG9nLXNpZGViYXJfZml4ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoKTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcnRpY2xlQWxsID0gJCgnLmMtYXJ0aWNsZScpO1xyXG4gICAgICAgIHZhciBsaW5rc0FsbCA9ICQoJy5jLWJsb2ctc2lkZWJhcl9fbGluaycpO1xyXG4gICAgICAgIGlmIChhcnRpY2xlQWxsLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHNob3dTZWN0aW9uKHdpbmRvdy5sb2NhdGlvbi5oYXNoLCBmYWxzZSk7XHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd1NlY3Rpb24oc2VjdGlvbiwgaXNBbmltYXRlKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBzZWN0aW9uLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICAgIHZhciByZXFTZWN0aW9uID0gYXJ0aWNsZUFsbC5maWx0ZXIoJ1tkYXRhLWlkPVwiJyArIHRhcmdldCArICdcIl0nKTtcclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gNzUwO1xyXG4gICAgICAgICAgICBpZiAocmVxU2VjdGlvbi5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciByZXFTZWN0aW9uUG9zID0gcmVxU2VjdGlvbi5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIGlmIChpc0FuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgICQoJ2JvZHksIGh0bWwnKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHJlcVNlY3Rpb25Qb3NcclxuICAgICAgICAgICAgICAgIH0sIGR1cmF0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJ2JvZHksIGh0bWwnKS5zY3JvbGxUb3AocmVxU2VjdGlvblBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrU2VjdGlvbigpIHtcclxuICAgICAgICAgICAgYXJ0aWNsZUFsbC5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJ0aWNsZSA9ICQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9wRWRnZSA9IGFydGljbGUub2Zmc2V0KCkudG9wIC0gMzUwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvdHRvbUVkZ2UgPSB0b3BFZGdlICsgYXJ0aWNsZS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciB0b3BTY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9wRWRnZSA8IHRvcFNjcm9sbCAmJiBib3R0b21FZGdlID4gdG9wU2Nyb2xsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRJZCA9IGFydGljbGUuZGF0YSgnaWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVxTGluayA9IGxpbmtzQWxsLmZpbHRlcignW2hyZWY9XCIjJyArIGN1cnJlbnRJZCArICdcIl0nKTtcclxuICAgICAgICAgICAgICAgICAgICByZXFMaW5rLmNsb3Nlc3QoJy5jLWJsb2ctc2lkZWJhcl9faXRlbScpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGN1cnJlbnRJZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tTZWN0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jLWJsb2ctc2lkZWJhcl9fbGluaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHNpZGViYXIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5jLWJsb2ctc2lkZWJhcicpO1xyXG4gICAgICAgICAgICBpZiAoc2lkZWJhci5oYXNDbGFzcygnYWN0aXZlJykpIHNpZGViYXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBzaG93U2VjdGlvbigkKHRoaXMpLmF0dHIoJ2hyZWYnKSwgdHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYy1ibG9nLXNpZGViYXJfX2J1dHRvbicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgc2lkZWJhciA9IHRyaWdnZXIuY2xvc2VzdCgnLmMtYmxvZy1zaWRlYmFyJyk7XHJcbiAgICAgICAgICAgIHNpZGViYXIudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoKTtcclxuXHJcbiAgICAvLyBuZXh0L3ByZXYgc2VjdGlvbnMgc2Nyb2xsXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1tb3ZlXScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGJ0biA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBidG4uYXR0cignZGF0YS1tb3ZlJyk7XHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2Nyb2xsVG9Qb3NpdGlvbihwb3NpdGlvbiwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCAxMDAwO1xyXG4gICAgICAgICAgICAgICAgJChcImJvZHksIGh0bWxcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGJ0bi5jbG9zZXN0KCcubC1zZWN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb250YWluZXIuaGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9Qb3NpdGlvbihjb250YWluZXIuaGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KSgpO1xyXG5cclxuLy8gQURNSU4gVEFCU1xyXG4gICAgLy8gdGFicyBtYW5hZ2VyXHJcbiAgICAkKCcuYy10YWJzX19pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgaW5kZXggPSAkdGhpcy5pbmRleCgpLFxyXG4gICAgICAgICAgICBhZG1pblNlY3Rpb24gPSAkKHRoaXMpLmNsb3Nlc3QoJy5sLWFkbWluJyksXHJcbiAgICAgICAgICAgIC8vdGFicyA9IGFkbWluU2VjdGlvbi5maW5kKCcuYy10YWJzX19pdGVtJyksXHJcbiAgICAgICAgICAgIGNvbnRlbnRzID0gYWRtaW5TZWN0aW9uLmZpbmQoJy5jLWNvbnRlbnQtcGFuZWxfX2l0ZW0nKSxcclxuICAgICAgICAgICAgY29udGVudFRvU2hvdyA9IGNvbnRlbnRzLmVxKGluZGV4KVxyXG5cclxuICAgICAgICAgICAgO1xyXG4gICAgICAgIGlmICghJHRoaXMuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgY29udGVudFRvU2hvdy5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyBVcGxvYWQgdHJpZ2dlclxyXG4gICAgJCgnI3VwbG9hZGZpbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKFwiI2ZpbGVcIikudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBmaWxlVXBsb2FkKHVybCwgZGF0YSwgY2IpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgY2IocmVzdWx0LnN0YXR1cyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZChkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGxvYWQgd29ya1xyXG4gICAgY29uc3Qgd29ya3NGb3JtID0gJCgnI2FkbWluLXdvcmtzJyk7XHJcblxyXG4gICAgaWYgKHdvcmtzRm9ybSkge1xyXG4gICAgICAgIHdvcmtzRm9ybS5vbignc3VibWl0JywgcHJlcGFyZVNlbmRGaWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVwYXJlU2VuZEZpbGUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZm9ybSA9ICQodGhpcyk7XHJcbiAgICAgICAgdmFyIHBvcHVwID0gJCgnLmwtYWRtaW5fX3BvcHVwJyk7XHJcbiAgICAgICAgdmFyIHJlc3VsdENvbnRhaW5lciA9IHBvcHVwLmZpbmQoJy5sLWFkbWluX19zdGF0dXMnKTtcclxuICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICB2YXIgZmlsZSA9ICQoJyNmaWxlJykuZ2V0KDApLmZpbGVzWzBdO1xyXG4gICAgICAgIHZhciBuYW1lID0gJCgnI25hbWUnKS52YWwoKTtcclxuICAgICAgICB2YXIgdGVjaG5vbG9naWVzID0gJCgnI3RlY2hub2xvZ2llcycpLnZhbCgpO1xyXG4gICAgICAgIHZhciBsaW5rID0gJCgnI2xpbmsnKS52YWwoKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ltYWdlJywgZmlsZSwgZmlsZS5uYW1lKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ25hbWUnLCBuYW1lKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ3RlY2hub2xvZ2llcycsIHRlY2hub2xvZ2llcyk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKCdsaW5rJywgbGluayk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0Q29udGFpbmVyKTtcclxuICAgICAgICByZXN1bHRDb250YWluZXIudGV4dCgnVXBsb2FkaW5nLi4uJyk7XHJcbiAgICAgICAgcG9wdXAuZGVsYXkoMjAwKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgZmlsZVVwbG9hZCgnL2FkbWluL3dvcmtzJywgZm9ybURhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICByZXN1bHRDb250YWluZXIudGV4dChkYXRhKTtcclxuICAgICAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgICAgZm9ybVswXS5yZXNldCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEJsb2cgRm9ybVxyXG4gICAgdmFyIGJsb2dGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkbWluLWJsb2cnKTtcclxuXHJcbiAgICBpZiAoYmxvZ0Zvcm0pIHtcclxuICAgICAgICBibG9nRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBwcmVwYXJlU2VuZFBvc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZXBhcmVTZW5kUG9zdChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBmb3JtID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgcG9wdXAgPSAkKCcubC1hZG1pbl9fcG9wdXAnKTtcclxuICAgICAgICB2YXIgcmVzdWx0Q29udGFpbmVyID0gcG9wdXAuZmluZCgnLmwtYWRtaW5fX3N0YXR1cycpO1xyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB0aXRsZTogYmxvZ0Zvcm0udGl0bGUudmFsdWUsXHJcbiAgICAgICAgICAgIGRhdGU6IGJsb2dGb3JtLmRhdGUudmFsdWUsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGJsb2dGb3JtLmNvbnRlbnQudmFsdWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KCdTYXZpbmcgZGF0YS4uLicpO1xyXG4gICAgICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG4gICAgICAgIHNlbmRBamF4SnNvbignL2FkbWluL2Jsb2cnLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgcmVzdWx0Q29udGFpbmVyLnRleHQoZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVwLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICAgIGZvcm1bMF0ucmVzZXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTa2lsbHMgZm9ybVxyXG5cclxuICAgIHZhciBza2lsbHNGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkbWluLXNraWxscycpO1xyXG5cclxuICAgIGlmIChza2lsbHNGb3JtKSB7XHJcbiAgICAgICAgc2tpbGxzRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBwcmVwYXJlU2VuZFNraWxscyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNlbmRTa2lsbHMoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcG9wdXAgPSAkKCcubC1hZG1pbl9fcG9wdXAnKTtcclxuICAgICAgICB2YXIgcmVzdWx0Q29udGFpbmVyID0gcG9wdXAuZmluZCgnLmwtYWRtaW5fX3N0YXR1cycpO1xyXG4gICAgICAgIHZhciBza2lsbHMgPSAkKCcuYy1hZG1pbi1za2lsbHMnKTtcclxuICAgICAgICB2YXIgc2tpbGxHcm91cHMgPSBza2lsbHMuZmluZCgnLmMtYWRtaW4tc2tpbGxzX19ncm91cCcpO1xyXG4gICAgICAgIHZhciBkYXRhID0ge307XHJcblxyXG4gICAgICAgIHNraWxsR3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNraWxsR3JvdXAgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgZ3JvdXBUaXRsZSA9IHNraWxsR3JvdXAuZmluZCgnLmMtYWRtaW4tZ3JvdXBfX3RpdGxlJykudGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBza2lsbEdyb3VwLmZpbmQoJy5jLWFkbWluLXNraWxsJyk7XHJcbiAgICAgICAgICAgIHZhciBpdGVtT2JqID0ge307XHJcblxyXG4gICAgICAgICAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHZhciBza2lsbE5hbWUgPSBpdGVtLmZpbmQoJy5jLWFkbWluLXNraWxsX190aXRsZScpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBza2lsbFZhbHVlID0gaXRlbS5maW5kKCcuYy1hZG1pbi1mb3JtX19pbnB1dF9za2lsbHMnKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpdGVtT2JqW3NraWxsTmFtZV0gPSBza2lsbFZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGF0YVtncm91cFRpdGxlXSA9IGl0ZW1PYmo7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXN1bHRDb250YWluZXIudGV4dCgnU2F2aW5nIGRhdGEuLi4nKTtcclxuICAgICAgICBwb3B1cC5kZWxheSgyMDApLmZhZGVJbigxMDAwKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBzZW5kQWpheEpzb24oJy9hZG1pbi9hYm91dCcsIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICByZXN1bHRDb250YWluZXIudGV4dChkYXRhKTtcclxuICAgICAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBdXRoIGZvcm1cclxuXHJcbiAgICAvLyBDaGVja2JveFxyXG4gICAgdmFyIGNoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmMtY2hlY2tib3hfX2lucHV0Jyk7XHJcblxyXG4gICAgaWYgKGNoZWNrYm94KSB7XHJcbiAgICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmaWVsZF9lcnJvcicpLnJlbW92ZUNsYXNzKCdmaWVsZF9vaycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBhdXRoRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhdXRoLWZvcm0nKTtcclxuXHJcbiAgICBpZiAoYXV0aEZvcm0pIHtcclxuICAgICAgICBhdXRoRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBwcmVwYXJlU2VuZEF1dGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHByZXBhcmVTZW5kQXV0aChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwb3B1cCA9ICQoJy5sLXNlY3Rpb25fX3BvcHVwJyk7XHJcbiAgICAgICAgdmFyIHJlc3VsdENvbnRhaW5lciA9IHBvcHVwLmZpbmQoJy5sLXNlY3Rpb25fX3N0YXR1cycpO1xyXG4gICAgICAgIHZhciBmb3JtID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgdmFsaWRhdGlvbkluZm8gPSB2YWxpZGF0ZUF1dGgoZm9ybSk7XHJcbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uSW5mby5pc1ZhbGlkYXRlZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWxpZGF0aW9uSW5mby5lcnJvcnMpO1xyXG4gICAgICAgICAgICBwb3B1cC5kZWxheSgyMDApLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICAgJCh2YWxpZGF0aW9uSW5mby5lcnJvcnMpLmVhY2goZnVuY3Rpb24gKGksIGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwb3B1cC5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aEZvcm0udXNlcm5hbWUudmFsdWUsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBhdXRoRm9ybS5wYXNzd29yZC52YWx1ZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlc3VsdENvbnRhaW5lci50ZXh0KCfQn9GA0L7QstC10YDQutCwINC00LDQvdC90YvRhS4uLicpO1xyXG4gICAgICAgIHBvcHVwLmRlbGF5KDIwMCkuZmFkZUluKDEwMDApO1xyXG5cclxuICAgICAgICBzZW5kQWpheEpzb24oJy9hZG1pbicsIGRhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICByZXN1bHRDb250YWluZXIudGV4dChkYXRhKTtcclxuICAgICAgICAgICAgcG9wdXAuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5yZWRpcmVjdCk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhID09ICfQkNCy0YLQvtGA0LjQt9Cw0YbQuNGPINGD0YHQv9C10YjQvdCwIScpXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2FkbWluJztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUF1dGgoZm9ybSkge1xyXG4gICAgICAgIHZhciBpbnB1dHMgPSBmb3JtLmZpbmQoJ1tyZXF1aXJlZF0nKTtcclxuICAgICAgICB2YXIgaXNWYWxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHZhciBlcnJvcnMgPSBbXTtcclxuICAgICAgICB2YXIgZmxhZzEgPSBmYWxzZTtcclxuICAgICAgICB2YXIgZmxhZzIgPSBmYWxzZTtcclxuICAgICAgICBpbnB1dHMucmVtb3ZlQ2xhc3MoJ2ZpZWxkLS1lcnJvcicpO1xyXG4gICAgICAgIGlucHV0cy5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dCA9ICQoaXRlbSk7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGlucHV0LnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGlucHV0LmF0dHIoJ3R5cGUnKTtcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5pcygnOmNoZWNrZWQnKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbnB1dC5hZGRDbGFzcygnZmllbGRfZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmxhZzEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKCfQktGLINGC0L7Rh9C90L4g0L3QtSDRgNC+0LHQvtGCPycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWcxID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS50cmltKCkgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0LmFkZENsYXNzKCdmaWVsZF9lcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgaXNWYWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICghZmxhZzIpXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goJ9CS0Ysg0LfQsNCx0YvQu9C4INCy0LLQtdGB0YLQuCDQtNCw0L3QvdGL0LUnKTtcclxuICAgICAgICAgICAgICAgIGZsYWcyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlucHV0LnJlbW92ZUNsYXNzKCdmaWVsZF9lcnJvcicpLmFkZENsYXNzKCdmaWVsZF9vaycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwiaXNWYWxpZGF0ZWRcIjogaXNWYWxpZGF0ZWQsXHJcbiAgICAgICAgICAgIFwiZXJyb3JzXCI6IGVycm9yc1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxufSk7XHJcblxyXG4vLyBFdmVudHNcclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdsb2FkZWQnKTtcclxufSk7XHJcblxyXG53aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgd2luU2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG4gICAgcGFyYWxsYXguaW5pdCh3aW5TY3JvbGwpO1xyXG4gICAgLy9pZiAod2luU2Nyb2xsID4gaW5uZXJIZWlnaHQgLyAxLjgpIHtcclxuICAgIHNraWxscy5ncm93KHdpblNjcm9sbCk7XHJcbiAgICAvL31cclxufTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdmb2N1cycsICcuYy1mb3JtX19pbnB1dCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdmaWVsZF9lcnJvcicpLnJlbW92ZUNsYXNzKCdmaWVsZF9vaycpO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLm9uKCdyZXNldCcsICcuYy1mb3JtJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICQodGhpcykuZmluZCgnLmMtZm9ybV9faW5wdXQnKS5yZW1vdmVDbGFzcygnZmllbGRfZXJyb3InKS5yZW1vdmVDbGFzcygnZmllbGRfb2snKTtcclxufSk7Il19
