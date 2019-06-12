$(document).ready(function () {

  var $wnd = $(window);
  var $top = $(".page-top");
  var $html = $("html, body");
  var $header = $(".header");
  var $menu = $(".main-menu");
  var headerHeight = 80;
  var $hamburger = $(".hamburger");

  // забираем utm из адресной строки и пишем в sessionStorage, чтобы отправить их на сервер при form submit
  var utms = parseGET();
  // проверяем есть ли utm в адресной строке, если есть то пишем в sessionStorage
  if (utms && Object.keys(utms).length > 0) {
    window.sessionStorage.setItem('utms', JSON.stringify(utms));
  } else {
    // если нет то берем utm из sessionStorage
    utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
  }

  // Инициализируем анимацию (для мобильных отключен)
  new WOW({ mobile: false }).init();

  if ($wnd.width() < 992) {
    headerHeight = 80;
  }

  // jquery.maskedinput для ПК и планшет (мобильном не подключаем)
  if ($wnd.width() > 479) {
    $("input[type=tel]").mask("+7 (999) 999 99 99", {
      completed: function () {
        $(this).removeClass('error');
      }
    });
  }

  $wnd.scroll(function () { onscroll(); });

  var onscroll = function () {
    if ($wnd.scrollTop() > $wnd.height()) {
      $top.addClass('active');
    } else {
      $top.removeClass('active');
    }

    if ($wnd.scrollTop() > 0) {
      $header.addClass('header--scrolled');
    } else {
      $header.removeClass('header--scrolled');
    }

    var scrollPos = $wnd.scrollTop() + headerHeight;

    // добавляет клас active в ссылку меню, когда находимся на блоке, куда эта ссылка ссылается
    $menu.find(".link").each(function () {
      var link = $(this);
      var id = link.find('a').attr('href');

      if (id.length > 1 && id.charAt(0) == '#' && $(id).length > 0) {
        var section = $(id);
        var sectionTop = section.offset().top;

        if (sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
          link.addClass('active');
        } else {
          link.removeClass('active');
        }
      }
    });
  }

  onscroll();

  // при нажатии на меню плавно скролит к соответсвующему блоку
  $(".main-menu .link a").click(function (e) {
    var $href = $(this).attr('href');
    if ($href.length > 1 && $href.charAt(0) == '#' && $($href).length > 0) {
      e.preventDefault();
      // отнимаем высоту шапки, для того чтобы шапка не прикрывала верхнию часть блока
      var top = $($href).offset().top - headerHeight;
      $html.stop().animate({ scrollTop: top }, "slow", "swing");
    }

    // как только доходим до блока, скрываем меню
    if ($wnd.width() <= 991) {
      toggleHamburger();
    }
  });

  $top.click(function () {
    $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
  });

  $(".top").click(function () {
    $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
  });

  $('.advantage__text').each(function() {
    var $titleWidth = $(this).siblings('.advantage__title').width();
    $(this).css('margin-left', -$titleWidth / 2);
  });

  $('.counter__minus, .counter__plus').click(function() {
    var $this = $(this);
    var step = $this.hasClass('counter__minus') ? -1 : 1;
    var $counter = $this.siblings('.counter__value');
    var val = +$counter.val() + step;
    $counter.val(val < 0 ? 0 : val);
  });


  // при изменении объязателных полей проверяем можно ли удалять класс error
  $("input:required, textarea:required").keyup(function () {
    var $this = $(this);
    if ($this.attr('type') != 'tel') {
      checkInput($this);
    }
  });

  $hamburger.click(function () {
    toggleHamburger();
    return false;
  });

  // показывает и скрывает меню, а также меняет состояние гамбургера
  function toggleHamburger() {
    $this = $hamburger;
    if (!$this.hasClass("is-active")) {
      $this.addClass('is-active');
      $menu.slideDown('700');
    } else {
      $this.removeClass('is-active');
      $menu.slideUp('700');
    }
  }

  // при закрытии модального окна удаляем error клас формы в модальном окне
  $(document).on('closing', '.remodal', function (e) {
    $(this).find(".input, .textarea").removeClass("error");
    var form = $(this).find("form");
    if (form.length > 0) {
      form[0].reset();
    }
  });

  $('.item-type input').change(function() {
    var $this = $(this);
    var $tr = $this.closest('.tr');
    var isChecked = $this.prop('checked');
    if (isChecked) {
      $tr.find('.item-season').addClass('active');
    } else {
      $tr.find('.item-season').removeClass('active')
         .find('[type=checkbox]').prop('checked', false);

      $tr.find('.counter').removeClass('active')
         .find('input').val(0);
    }
  });

  $('.item-season input').change(function() {
    var $this = $(this);
    var $tr = $this.closest('.tr');
    var $season = $this.closest('.item-season');
    var index = $season.index() + 1;
    var isChecked = $this.prop('checked');
    if (isChecked) {
      $season.addClass('item-season--active');
      $tr.find('.counter:nth-child(' + index + ')').addClass('active')
        .find('input').val(1);
    } else {
      $season.removeClass('item-season--active');
      $season.next('.input-div').val('');
      $tr.find('.counter:nth-child(' + index + ')').removeClass('active')
         .find('input').val(0);
    }
  });

  $('.katalog__type__title').click(function() {
    $(this).toggleClass('active');
  });

  $(".ajax-submit").click(function (e) {
    var $form = $(this).closest('form');
    var $requireds = $form.find(':required');
    var formValid = true;

    // проверяем объязательные (required) поля этой формы
    $requireds.each(function () {
      $elem = $(this);

      // если поле пусто, то ему добавляем класс error
      if (!$elem.val() || !checkInput($elem)) {
        $elem.addClass('error');
        formValid = false;
      }
    });

    if (formValid) {
      // если нет utm
      if (Object.keys(utms).length === 0) {
        utms['utm'] = "Прямой переход";
      }
      // создаем скрытые поля для utm внутрии формы
      for (var key in utms) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = utms[key];
        $form[0].appendChild(input);
      }
    } else {
      e.preventDefault();
    }
  });

  $(".carousel-logo").owlCarousel({
    loop: false,
    smartSpeed: 500,
    margin: 0,
    navText: ['', ''],
    responsive: {
      0: { items: 1, mouseDrag: false, dots: false, nav: true },
      576: { items: 2, mouseDrag: true, dots: false, nav: true },
      992: { items: 3, mouseDrag: true, dots: false, nav: true },
      1200: { items: 4, mouseDrag: true, dots: false, nav: true },
    },
  });

  $(".carousel-production").owlCarousel({
    loop: false,
    smartSpeed: 500,
    margin: 30,
    navText: ['', ''],
    responsive: {
      0: { items: 1, mouseDrag: false, dots: false, nav: true },
      580: { items: 2, mouseDrag: true, dots: false, nav: true },
    },
  });
  
  $(".carousel-employee").owlCarousel({
    loop: false,
    smartSpeed: 500,
    margin: 30,
    navText: ['', ''],
    responsive: {
      0: { items: 1, mouseDrag: false, dots: false, nav: true },
      580: { items: 2, mouseDrag: true, dots: false, nav: true },
    },
  });

  $(".carousel-pismo").owlCarousel({
    loop: false,
    smartSpeed: 500,
    margin: 30,
    navText: ['', ''],
    responsive: {
      0: { items: 1, mouseDrag: false, dots: false, nav: true },
      768: { items: 2, mouseDrag: true, dots: false, nav: true },
    },
  });

  $('.carousel-comand').slick({
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    draggable: false,
    centerPadding: '0px',
    responsive: [
       {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
          }      
       },
       {
          breakpoint: 768,
          settings: {
             slidesToShow: 1,
          }      
       }
    ]
  });

});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// в основном для проверки поле email
function checkInput($input) {
  if ($input.val()) {
    if ($input.attr('type') != 'email' || validateEmail($input.val())) {
      $input.removeClass('error');
      return true;
    }
  }
  return false;
}

// забирает utm тэги из адресной строки
function parseGET(url) {
  var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  if (!url || url == '') url = decodeURI(document.location.search);

  if (url.indexOf('?') < 0) return Array();
  url = url.split('?');
  url = url[1];
  var GET = {}, params = [], key = [];

  if (url.indexOf('#') != -1) {
    url = url.substr(0, url.indexOf('#'));
  }

  if (url.indexOf('&') > -1) {
    params = url.split('&');
  } else {
    params[0] = url;
  }

  for (var r = 0; r < params.length; r++) {
    for (var z = 0; z < namekey.length; z++) {
      if (params[r].indexOf(namekey[z] + '=') > -1) {
        if (params[r].indexOf('=') > -1) {
          key = params[r].split('=');
          GET[key[0]] = key[1];
        }
      }
    }
  }

  return (GET);
};