$(function() {

    $('.open-list-button').click(function() {
       $('.currency-list').fadeToggle(200);
    });

    var currentCurrency = 'PLN';
    var value = 44;

    $.getJSON("http://api.fixer.io/latest?base="+currentCurrency,
    function(data) {
        var rates = data.rates;
        $('.currency-tile').each(function() {
            var id = $(this).attr('id');
            $(this).children('.cur-exchange-value').text(
                (rates[id]*value).toFixed(4)
            );
            $(this).children('.cur-course').text(
                rates[id].toFixed(4)
            );
        })
    });

    //tiles

    currencyTilesData.forEach(function(tile) {
       $('.currency-tiles').append(
        '<div class="currency-tile mix" id="'+tile.id+'" data-order="'+tile.rating+'" data-name="'+tile.country+'">'+
            '<div class="tile-header">'+
                '<div class="cur-name">'+tile.currencyName+'</div>'+
                '<div class="cur-country">'+tile.country+'</div>'+
            '</div>'+
            '<div class="cur-exchange-value">0.0000</div>'+
            '<div class="cur-course"><i class="fa fa-angle-up"'+'aria-hidden="true"></i> 0.0000</div>'+
        '</div>'
       )
    });

    //mixitup

    var mixer = mixitup('.currency-tiles');

})