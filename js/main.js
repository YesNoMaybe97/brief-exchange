$(function() {
     //tiles
     currencyData.forEach(function(tile) {
        $('.currency-tiles').append(
         '<div class="currency-tile mix" id="'+tile.id+'" data-order="'+tile.rating+'" data-name="'+tile.country+'">'+
             '<div class="tile-header">'+
                 '<div class="cur-name">'+tile.currencyName+' ('+tile.id+')</div>'+
                 '<div class="cur-country">'+tile.country+'</div>'+
             '</div>'+
             '<div class="cur-exchange-value"></div>'+
             '<div class="cur-course"><i class="fa fa-angle-up"'+'aria-hidden="true"></i></div>'+
         '</div>'
        )
 
        $('.currency-list > ol').append(
         '<li class="currency-list-item"><div class="list-cur-id">'+tile.id+'</div><div class="list-cur-name">'+tile.currencyName+'</div></li>'
        )
     });

    //convert form currency changing

    var changeCurrency = function() {
        var curId = $(this).find('.list-cur-id');
        $('#currency-id').text(curId.text());
    }

    $('.currency-list-item').click(changeCurrency);

    //preview display handling

    var previewHandler = function(val,cur) {
        $('.base-currency-id').text(cur);
        var country;

        currencyData.forEach(function(curObj) {
            if (curObj.id == cur) country = curObj.country;
        })
       
        $('.base-currency-country').find('span').text(country);
    }

    //currency-list-handling

    $('.open-list-button, .overlay, .currency-list-item').click(
        function() {
            var button = $('.open-list-button');
    
            $('.currency-list, .overlay').fadeToggle(200);
            if (button.hasClass('list-opened')) 
                button.removeClass('list-opened')
            else button.addClass('list-opened');
        }
    );

    //converting logic (getting data from form and json, then - converting)

    var convert = function(element) {

        if(element) {
            var value = element.find('input').val();
            var currency = $('#currency-id').html();
            //refresh animation
            $('.currency-tiles').fadeOut(100);
            $('.currency-tiles').fadeIn(100);
        } else { //default values
            var value = localStorage.value;
            var currency = localStorage.currency;
        }

        localStorage.value = value;
        localStorage.currency = currency;

        $('#currency-id').text(localStorage.currency);

        $.getJSON("http://api.fixer.io/latest?base="+currency,
        function(data) {
            var rates = data.rates;
            var date = data.date;

            $('#update-date').text(date);
            $('.currency-tile').each(function() {
                var id = $(this).attr('id');
                if (rates[id] != rates[currency]) {
                    $(this).children('.cur-exchange-value').text(
                        (rates[id]*value).toFixed(2)
                    );
                    $(this).children('.cur-course').text(
                        rates[id].toFixed(4)
                    );
                } else {
                    $(this).children('.cur-exchange-value').text(
                        value
                    );
                    $(this).children('.cur-course').text(
                        1
                    );
                }
            })
        });

        previewHandler(value,currency);

        $('input').val(value);
    }

    // -- convert call - action --

    $('#convert-form, #preview-form').submit(function() {
        convert($(this));
        return false;
    });

    // default convert values
    
    if (!localStorage.value) localStorage.value = 100;
    if (!localStorage.currency) localStorage.currency = 'PLN';
    convert();

    //modal handling

    $('.open-about-modal').click(function() {
        $('.about-modal').addClass('modal-opened');
        $('.overlay-darken').addClass('overlay-visible');
    })

    $('.overlay-darken, .close-modal').click(function() {
        $('.about-modal').removeClass('modal-opened');
        $('.overlay-darken').removeClass('overlay-visible');
    });

    //mobile menu handling

    $('.open-menu-button').click(function() {
        $('.main-nav-mobile ol').fadeToggle(200);
    });

    //base currency amount input resizing

    function resizeInput() {
        $(this).attr('size', $(this).val().length);
        if (!$(this).val().length) $(this).attr('size', 1);
    }

    $('.base-currency-amount').keyup(resizeInput).each(resizeInput);

    //overlays-height

    $('.overlay, .overlay-darken').
        css('height',$(document).height()+'px');
    
    //cookies info

    if (!localStorage.isCookiesAccept) $('.cookies-info').addClass('cookies-info-visible');
    
    $('.close-cookies-info').click(function() {
        localStorage.isCookiesAccept=true;
        $('.cookies-info').removeClass('cookies-info-visible');
    })

    //scroll to top

    $('.scroll-to-top').hide();
    $(window).scroll(function() {
        if($(window).scrollTop() < 200) $('.scroll-to-top').fadeOut();
        else $('.scroll-to-top').fadeIn();
    });
    
    $('.scroll-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 600);
    });
    
    //mixitup

    var mixer = mixitup('.currency-tiles');
})