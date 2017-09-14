$('document').ready(function() {
    $('.photo-section').each(function(id, obj) {
        var bgImg = $(obj).attr('data-img');
        $(obj).css('background-image', `url('${bgImg}')`);
    });


    $('.each-result').on('click', function() {
        const productId = $(this).attr('product-id');

        window.location.href = '/details/' + productId;
    });

});
