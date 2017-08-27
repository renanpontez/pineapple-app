$('document').ready(function() {
    $('.bg-image').each(function(id, obj) {
        var bgImg = $(obj).attr('data-img');
        $(obj).css('background-image', `url('${bgImg}')`);
    });
});
