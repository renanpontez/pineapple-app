$('document').ready(function() {

    if(findGetParameter("s") == "new") {
        $(".title-of-page").html("Novos");
    } else if(findGetParameter('s') == "used") {
        $(".title-of-page").html("Usados");
    }

    $('.photo-section').each(function(id, obj) {
        var bgImg = $(obj).attr('data-img');
        $(obj).css('background-image', `url('${bgImg}')`);
    });


    $('.each-result').on('click', function() {
        const productId = $(this).attr('product-id');

        window.location.href = '/details/' + productId;
    });

});


function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
