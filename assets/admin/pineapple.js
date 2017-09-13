$(document).ready(function() {
    $("#PhotoFieldAdd").filestyle({
        htmlIcon: '<span class="fa fa-camera" style="margin-right:8px;"></span>',
        btnClass: 'btn-warning btn-md pointer',
        text: 'Enviar foto'
    });

    $("#PhotoFieldEdit").filestyle({
        htmlIcon: '<span class="fa fa-camera" style="margin-right:8px;"></span>',
        btnClass: 'btn-warning btn-md pointer',
        text: 'Atualizar foto'
    });

    $('.delete-type').on('click', function() {
        var txt;
        var safeWord = prompt("Todos os produtos associados a este tipo de produto serão apagados. Se você tiver certeza disso digite a palavra APAGAR:");
        if (safeWord == "APAGAR") {
            $("#FormDeleteType").submit();
        } else {
            $.notify('A ação foi cancelada e nada foi apagado.');
        }
    });


    if(getUrlParameter('u') == 1) {
        $.notify('Registro atualizado com sucesso!');
    }
    if(getUrlParameter('d') == 1) {
        $.notify('Registro excluído com sucesso!');
    }
    if(getUrlParameter('c') == 1) {
        $.notify('Registro criado com sucesso!');
    }


    $('.each-row').on('click', function() {
        var productId = $(this).attr('product-id');
        var url = `/product/edit/${productId}`;

        window.location.href = url;
    });
});


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
