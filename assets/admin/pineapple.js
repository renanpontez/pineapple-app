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

    $('.delete-logo').on('click', function() {
        var txt;
        var safeWord = prompt("Todos os produtos vinculados a esta logo ficarão sem imagem até você fazer upload de outra com mesmo titulo. Se você tiver certeza disso digite a palavra APAGAR:");
        if (safeWord == "APAGAR") {
            $("#FormDeleteLogo").submit();
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

    $("#SoldCheckbox").on('change', function() {
        if ($(this).is(':checked')) {
            $("#SoldInput").attr('value', 'true');
            $("#SendSoldEmail").show();
        } else {
            $("#SoldInput").attr('value', 'false');
            $("#SendSoldEmail").hide();
        }
    });

    $("#SendSoldEmail").find('a').on('click', function() {
        var productId = $(this).attr('product-id');
        var txt;
        var safeWord = prompt("Digite o e-mail do cliente que você deseja enviar o comprovante:");

        if (safeWord != null && safeWord.length > 0 && isEmail(safeWord)) {
            showLoading();

            $.ajax({
    			url: `/product/sendReceipt/`,
    			data: {
                    productId: productId,
                    email: safeWord
                },
    			dataType: 'json',
    			accepts: {json: 'application/json'},
    			success: function(data){
                    $.notify('O comprovante foi enviado com sucesso!', "success");
    			},
    			error:function(e){
    				console.log('Error: '+ e);
    			},
                complete: function() {
                    hideLoading();
                }
    		});


        } else {
            $.notify('O e-mail digitado não é válido.', "warn");
        }
    });

    if(isAdmin()) {
        $('.each-row').on('click', function() {
            var productId = $(this).attr('product-id');
            var url = `/product/edit/${productId}`;

            window.location.href = url;
        });
    }





});
var showLoading = function() {

}
var hideLoading = function() {

}
var isEmail = function(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
var isAdmin = function() {
    return $("#IsAdmin").val() === 'true';
}

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
