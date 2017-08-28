$(function() {
    //js/currencies.js => currencyData || generating tiles to .currenncy-tiles
    currencyData.forEach(function(tile) {
        main.tileGenerator(tile)
    });
    //changing currency (.convert-form)
    $('.currency-list-item').click(main.changeCurrency);
    //currency list handling
    $('.open-list-button, .overlay, .currency-list-item').click(main.listHandler);
    //preview form convert handling
    $('#convert-form, #preview-form').submit(function() {
        main.convert($(this));
        return false;
    });
    //if local storage doesn't exists - set default values (100 USD)
    main.setDefault();
    // *** additionals ***
        //open-close "about" modal
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
    $('.base-currency-amount').keyup(main.resizeInput).each(main.resizeInput);
        //overlays-height
    $('.overlay, .overlay-darken').css('height',$(document).height()+'px');
        //cookies info display
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
        //mixitup init
    var mixer = mixitup('.currency-tiles');
});

var main = {
    changeCurrency : function() {
        var curId = $(this).find('.list-cur-id');
        $('#currency-id').text(curId.text());
    },
    previewHandler : function(val,cur) {
        $('.base-currency-id').text(cur);

        var country;
        currencyData.forEach(function(curObj) {
            if (curObj.id == cur) country = curObj.country;
        })
       
        $('.base-currency-country').find('span').text(country);
    },
    listHandler : function() {
        var button = $('.open-list-button');

        $('.currency-list, .overlay').fadeToggle(200);
        if (button.hasClass('list-opened')) 
            button.removeClass('list-opened')
        else button.addClass('list-opened');
    },
    setDefault : function() {
        if (!localStorage.value) localStorage.value = 100;
        if (!localStorage.currency) localStorage.currency = 'USD';
        this.convert();
    },
    resizeInput : function() {
        $(this).attr('size', $(this).val().length);
        if (!$(this).val().length) $(this).attr('size', 1);
    },
    tileGenerator : function(tile) {
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
    },
    convert : function(element) {
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

        $.getJSON("https://api.fixer.io/latest?base="+currency,
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

        this.previewHandler(value,currency);
        $('input').val(value);
    }
}
