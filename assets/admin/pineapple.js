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
        } else {
            $("#SoldInput").attr('value', 'false');
        }
    });

    $("#SendSoldEmail").find('a').on('click', function() {
        //REACTIVATE WHEN SMTP OUT IS FREE
        // if(validateEditForm()) {
        //     $("#SendSoldEmailModal").modal();
        // }
        // else {
        //     $.notify('Preencha todos os campos do formulário antes de enviar comprovante!', "error");
        //
        // }


        //WORKAROUND WHILE SMTP OUTBOUND IS NOT OK ON DIGITAL OCEAN
        var productId = $(this).attr('product-id');
        window.open(`/product/${productId}/receipt`);

    });
    $("#SendReceiptBtn").on('click', function() {

        var formValid = validateFieldsSendReceipt();

        if (formValid.status) {
            showLoading();

    		var data = new FormData();
            data.append('productId',  formValid.fields['productId']);
            data.append('name',  formValid.fields['name']);
            data.append('email',  formValid.fields['email']);
            data.append('phone',  formValid.fields['phone']);
            data.append('payment_method',  formValid.fields['payment_method']);
            data.append('_csrf', formValid.fields['csrf'] );

            $.ajax({
                method: 'post',
    			url: `/product/sendReceipt`,
    			data: data,
    			dataType: 'json',
    			accepts: {json: 'application/json'},
                contentType: false,
	            processData:false,

    			success: function(data){
                    if(data.status) {
                        $("#SendSoldEmail").fadeOut(function() {
                            $("#ReceiverEmail").html(data.receiverEmail);
                            $("#EmailSentSuccess").fadeIn('slow');
                        });
                        $.notify('O comprovante foi enviado com sucesso!', "success");
                        $("#SoldInput").value('true');
                        $("#ProductEditForm").submit();
                    }
    			},
    			error:function(e){
                    hideLoading();
    				console.log('Error: '+ e);
    			},
                complete: function() {
                    $("#SendSoldEmailModal").modal('hide');
                }
    		});
        } else {
            $.notify('O e-mail ou o nome digitado não é válido.', "warn");
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
var validateEditForm = function() {
    var form = $("#ProductEditForm");
    var allFields = $(form).find('input');
    var allValid = true;
    allFields.each(function(id,el){
        var objId = $(el).attr('id');

        if(typeof objId != 'undefined') {
            $(form).validate().element(`#${objId}`);
            if (allValid == true ) {
                allValid = $(el).hasClass('error') ? false : true;
            }
        }
    });

    return allValid;
}
var validateFieldsSendReceipt = function(fields) {
    $('input.input-error').removeClass('input-error');

    var status = true;
    var dataToSend = Array();
    dataToSend['productId'] = $("#SendSoldEmail").find('a').attr('product-id');
    dataToSend['csrf'] = $("#SendSoldEmail").find('a').attr('csrf');
    dataToSend['email'] = $("#EmailField").val();
    dataToSend['name'] = $("#NameField").val();
    dataToSend['phone'] = $("#PhoneField").val();
    dataToSend['payment_method'] = $("#PaymentMethodField").val();

    if(dataToSend['email'].length == 0 || !isEmail(dataToSend['email'])) {
        $("#EmailField").addClass("input-error");
        status = false;
    }
    if(dataToSend['name'].length == 0) {
        $("#NameField").addClass("input-error");
        status = false;
    }
    if(dataToSend['phone'].length == 0) {
        $("#PhoneField").addClass("input-error");
        status = false;
    }
    if(dataToSend['payment_method'].length == 0) {
        $("#PaymentMethodField").addClass("input-error");
        status = false;
    }

    var dataToReturn = {};
    dataToReturn.status = status;
    dataToReturn.fields = dataToSend;

    return dataToReturn;
}

var showLoading = function() {
    $('#Loading').fadeIn();
}
var hideLoading = function() {
    $('#Loading').fadeOut();

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
