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
        $("#SendSoldEmailModal").modal();
    });
    $("#SendReceiptBtn").on('click', function() {
        var productId = $("#SendSoldEmail").find('a').attr('product-id');
        var csrf = $("#SendSoldEmail").find('a').attr('csrf');
        var email = $("#EmailField").val();
        var name = $("#NameField").val();

        if (email.length > 0 && isEmail(email) && name.length > 0) {
            showLoading();

    		var data = new FormData();
            data.append('productId', productId);
            data.append('name', name);
            data.append('email', email);
            data.append('_csrf', csrf);

            $.ajax({
                method: 'post',
    			url: `/product/sendReceipt`,
    			data: data,
    			dataType: 'json',
    			accepts: {json: 'application/json'},
                contentType: false,
	            processData:false,

    			success: function(data){
                    $("#SendSoldEmail").fadeOut(function() {
                        $("#ReceiverEmail").html(data.receiverEmail);
                        $("#EmailSentSuccess").fadeIn('slow');
                    });
                    $.notify('O comprovante foi enviado com sucesso!', "success");
    			},
    			error:function(e){
    				console.log('Error: '+ e);
    			},
                complete: function() {
                    $("#SendSoldEmailModal").modal('hide');
                    hideLoading();
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

var mountPdf = function() {
    var doc = new jsPDF();
    var imgData = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAABHCAYAAABcUm8JAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABdNSURBVHja7F17WBRXlr8o0SxmnEqF+A4SsmIoEDTRZk3cSIyhpeKo0RVROioYY9NomVlRMjx0kMYssU2G9gF5iIwCtroqKBa2GoNZlAEVbIQGYiCIRmCE6v5YNdFFe/4gPcMy0H1vUdUPcn/fV38ot+499/atX50659xzXEwmE8DAwMDAEA6D8BJgYGBgYGLFwMDAwMSKgYGBgYkVAwMDA4M3XLv/o8YYuVLsAX2IzCwh+6szKuQAuEC9ICYSu/fgn9xxUGt8P9IEnjyx5/7BsA0qjIESlPZTiNKyAUOspoejX/QdtW2zWIPRNM0tX56Tav63v/Tr2P4+LPeb5qx+NWD+K1YfYoMiGm9vx8L9JnrN1IBF0A+cSqXiwKpITK5OiAdNsyNmBGyTw/LEqVPguQFDrGKDZVmSZdnu/7WPYRhu4aL8xBH++cn4gfl1oejsD/+K0j4mJoakV0XghcNweNjdxqpWq8mgmQu8cneM3WELUwSGY6DOqJBnZmYi31epfSsVrx4GJlZIKJVKMia8dUdVQ8ZB/LMMfFzT/nuyXq8nUe/bvz/XFb+AMTCxIpoKlvxuZ7C+NT4J/i58csz5tNVoRUEBO4jvHnnQFLIGryIGJlYE6PV6cmPktbVYKxm4uN8kXZWdnU3yvT/vSKU33h8YmFh5aCXfHpJgm+sAxTdnb3j2536lUkmaHo5+Ea8kBiZWRMjlUfjhGaBmAD5Oq564XkTJ8WpiOCp4hVupVCqOXlW9AabtY04irb78m1lVVbWuSqUS6fPvf/JeWEutAVsstRnmcfrLWoMCnyBzEjSUBCfq9XvI/vazdes2V3/p1ytxiB7GgCFWABCC+gmQ5ecFgL80cuWSiHRp7LqTwSzLQj1YJ06cBG8sKbP48Ewk0jPwz+g82mpubscQIfrS6/XkXyu3Jfq8ATCxYvx6TQE+RGaWn5d86fbMybtomuZg7mFZlnzMSaT4ZxoYeMxJpP1xWvXEsaPnCWyHxxhQGitfUCNTtmz9+Egwy7L/BtO+/fZoCfByLq2sb+3atrkKHEkWAAAoPN42Q8j+1Go1uSYuzuHs8NXGsFBLf/clNIcdRVZrZ/id/cw+zBzFmKerPSbq5lH4uUwm84bRXlqa7z1jmTzkHwAwGGoe1sjEEhFZ6sd8X0NJcGJHxwzXsLBl7j3vYRiGe+21g0mTpj26NJgs04pBbGY5rmlnJAEAwNatRYN6C8JPSEjg/PwOJk3wGdY0zEO71xYk2+W0KhK8Xxg7PApQNODuJqpq49Kwx9y0t2suP08XFDw1pK+93bX2B9J8g8o/cxna3Ngfkr1unDe3l++CJ0/AgwdPwM8/g24JbroTR4UxUNLJBQTdKPVbVchOcM/Ozuld1viP2mp81dzLs7SxLkPb7jgLyZqJtKYw/AAAAKQo77lbOoyi2p7SUjNW3TEhsGqvK6krEmSeJpPp71d1S1wS6Iq4t3ipVKr27vfxuTIy0tthxsrISLc41lXdscsw/dQaFAprMrFsXrO1fq7q8q92v6fWoFBoNLl3YWQwXzKZrP3ChYKbMDLBXLUGhaKmRZmqUqnaUeQAAJgoimrXaHLvCiVLf9aWz0VRVLveELFSKDk1muxWmHFpmm43mUxAb1ixvLJefYBhGOS1ZximXVe/Y2+VYUkoH1kPajJvochabpBIyupXb2LWrUWXdd3a9rL61ZvKDRIJH1mLdXHpsGOZ5UW9yg0SydUWeoFqewrvvUbTdHtOblod33maL7sRK8se/VGIsa7YiVhrDQrFVV3+VZqm2/n+iAkJCe39JTQ+xN4XQQlJ9j1l5EM8sBfLHv3RHsSqN0SshFUQLF0azf7mKkNoqJjEWm6QSNLTVbf6Kytf0hGbWMsNEklOblqdUHuKpun2Yl1cOl+CtVuYUkfHT67ASVFnjFY0lAQnvhow/xXYCIfeoFQqyT1bXJNhTRC9ybFni2tyb6YHVOj1enLmzLkeBXu9eMtjyWmlVquh14kk0Zb09OkLT9vBiUVmbPnNPrk8qt/OuLCw5aO+2DIqvcq4cIFYsmZtlpRGRcWM629H4cvWe2dtlhSi5lcV+9M/a7OkMHzZem+h+mRZlpwRsE1eUxh+gNdcnd0UYAeN1cSyeYJqXHw+xWsNCoVMJhNFC2QYpl1IzTUjIwNJzqILeSaKopBkvl6fftCWGqtY615pmDdPaI1VFFnXrW1H0ebE0ljLDRKJTBbeLuZcVdtTmlE1V7torDXGyJXFxReh2hLEbzqtvBqe2FL2xe/+HtC0sIpFWNgyd9PDMeNRNVUhQ5d6etuF0lzrjNEKtVoN3Z6maW6Ef35EZGQkhzKO9vj9YGf3XqvVavLSoeAve3dKOZisO3eRpZrQo/bUXM2aal/ON6EQszF+FKrmahdi/Wvl/ERYUhg1+pl7jrShGhoaROlXV+QVCUtU17QzklA+rXltppgYsqEkOLHf61USnIiSHnD58mWdPkRmVtDbHt+hjJOZmQkGQkyrXL52RFvl4mRnkDUqKmZcm84+slYYAyU1heEH1Dt3kbYYL3zZeu8HTbOhs6zbnFj1rfFJiqg4Arb9CP98h99kKpWKu6rLL681KKLNF8vmtchkMmitq6CAHQSjIZoejhkPa1NNSEjgLlwoaOou11VdfrlKpYKSKyYmbkh/tNY6Y7Ti9OnzSCetJgXpMwD4e0ge9Prp9XpyoCTBVqVqPJxBawUAgD998s1Ue2itpofuY4S0qcJg2x+uhULP1VY2Vr0hYuUV3eESiqKg7SEMw1gNpbmiO1JiSxtrT1tQdX1Wfl99o3rDrcmI0p8lD785ogHmt9Bocu/ytVdW12flo9oYu//eqPZOs6fenjbWjIw9d80hVKfYQzf5RkMUsNk3xLaxpqerbplDqPIL0i7zCcMCAJjyC9Iu29LGWm6QSPjIqtqe0mz29Bfr4tL5hGXBzLVf4VZ6Q8RKmEujyW7VaLJb+ThaYMJo7EWsNE2317QoU2GcTLAvk54xsj2vmhZlan9JFZX4KIri7chCdVr1/L31hoiVqHvmiu5wiT2IlabpXmNSzQSL2p9MJmuvNPxurhjEStN0rzGpZoJFlzXcqiNLSGK92kIvAIihhL2FTpkJFkXZg5krb2K1xQWrfdiLWC9cKLgJ/7DCxZla6xOGqFQqFTQRwsbAosyVzwsF9BHorzdErExISEAiZ/NL35bEStN0+/WWDzf11Sdfcq2oT0oTmlhpmm6/2kIvsKQN8iHXsvrVm2xFrKjxuNZkK6tfvUnI/uwax2oNm2I/MMJl0LJ9aRaaprmR/iy0PW+Cz7AmmHb373cOsWSvPHHihNU+Qt51L4Y9ojqR2L0nIKjBanLUmprbz4jttIqM/Oey1j5EZtbst6caUZ1utt4PSR8vq/Ib+dknff3dl9AcHj/92EZY27YZtZdfWCi0rHEfTz78yshTeX39fQpRWvbC6znRqu0pLSj93ij1W2Urp9XJk+fdYNvn5KZ950rqiiy1cSV1RTm5ad8JOVeHJNaMjHTOkZ1W8+bNQ0pi4jby+rn+jvmYk0itHUagKIobTJZpUfp1GXrnpjUnUXFxMUBxYvFxWvUVBTDCPz+ZoigkQrKlE4thGM7Ng/3cWjtfQnNYKruNJFd1Vb2boLKuW8u5eZzbZ63dFKK07M33Lkah9F1T3WyTF1onFxCEcijHJyTnPWtn/6cQpWUvz9LGCjlXhyNWhmG4N5aUbXDkBMYeHqMeoZIXTLuOjgd9nkZru+0+2dr9s2fPRs5aNZHYvWfyZMtdo8bLmh6OGY8SDkbTNOfmUdgrOfkQmVmbN8d1ooxvy0quCxe9yVFETi7cPmhuZBgG+iVx7NhxIGR0wNxF46/AJhhxGdp2h1m3Fl7W4ycG2SI6wHjL+y3YtjJZOMIz2nYHtj3MXB3qWGlGRrrDkyoAAIwc63LH1mPCfI57eHgAPuFR48bNsHrI4n6TdBUgABRpX8hzfx9l/K7Y1fA+f/NfQrA2w/bHsiy5qTLPJkmwR/gfTwZgAVRbX0Jz+LXXDqTBnpfoMqW8JJis7gFHEgGIgWo7hSgtq5mubgM7AQkvq/hRV/U1LhRs28kBFADgBoAl/MkBFMjOhpur6SE9xuGJlaZpblPsB8YR/vnJzlBqo+vTfh7SPRRFcSg2x564d8/6OYmYmBgyJgbsRu/dOl+2/mgaA/zhzABqdRHS6ObYVQua3g8MwwCUE1znzl4hRvjni1q6BSXO1oyXfEx6AMAoeO1/lKcwsoZzANxAume8b+t5AIA3vKzuY8R+9u7fewjNWTEb4wHYCErhe4fPFvhT62QpGAnyHJJYaZrmli9f1ukv/TrWh5ifBcB8MBAxkdi9x9PznWS9Xs+7j6amJrvOwZKZojtQa1oxDANchjb/YO3Tfc6cmUjEqlQqyaVrxU2C7enpCXyI5P0o9zw9skILAJgF2/7n1ilSMBLs6res4194MoXIRsoz+i8jr2kBAHKhyEYINDU1D3GEZ7r91siplhQNmxGrTCbj5s6d09ldS3EZ2vxD1ydgOHAmwNpMBxKMxg6r9vgup5Ur0sZXq9VArQb7rLfchyzz9SJKTi0RLgl2TxAEwWPvNDfa4/eznnOjN1nb7gCM3r8gO8BwwU0BKFVau8OSHQ3DMr7//nv7biQIU0SX0yqBdJQ1w5VcB+BzUN/gFHKKX6UVQxCg5ii1B2ATydgKer2ebCxJTvEJwZVcMWyLQXgJMLEKgTpjtGLrVqXD7Scxk2AbjUan2T9G4/+6Dozn4NmBrbFi2BbDhw+32kajyW2bLC0WyaZo+ROstZKORXFa2QpqtZpcvT5dCgjhtdbGxkbke0wPR3vaYx0ab94ahC6r+F5+ZGJ9FhMrhoAYN856VQ2jsWOQPcpa1xmjFUePuj7jqGt38SwI9lsjfL/l5eVAb3xPRhEHsmHv+bl1ihRljF+iCASQtQJUGAMlKBVIf2qdLAWAhR7jlygCkRWMZ6AT2+fkpn3nE5LznjiS5AAAGEyszg6CGG51Q/UnnKs/cDSn1T9rrTvBG0vKBHdi6fV68jEnlwICQBMrSoA7AAC4DG1pFErWTm51ECDggzVvVo+chSar+FEEY8e5/wzbtvnHe8OX2alkN7axOgkmTXt0yVqbc+fOIZ+8qjNGK7pffGRzNKdVb6TSWDI3RZS+Lz8LXRKm2hgWWlX1HXQ4Gp8DCJaAkiilwhgoQTn/33UAQXwM/+1TD2Dbnv/m4hDYU1cVxkBJbxc2BQxwDCbLtBRFzbB0ekuv15MNJdsSJ4YAaHNAQ0lwIk0vGAUAABkZGdw14mDSPz673Dq9pp9JBgD0mYOgzhit2L+/0eFf0Lm5x5/2nF4guNa6devHrn7SglBfQnMYpr1SqYQmK0/P8WASoSwQStYU5efuPiE50OYAZcp/QVf/5XMAgQ8mBFbtBQBAJbNhWZaMa4qLgNHSb10M3z1/7vqpPU0JNeAfh1KeH/OosetYcNeRX0ysAwATid17Fi5MtHp6a9euL4Z4TT+jgLG19gzol8vlvT30uymK4qqreyfr1ko6lmXnQpMFRVHcsYtBiQA87jSB/+s08SwGWal9KzUsTDYCtn12djb54cbDa4R2Yun1erJK+1EakIYBS+RabQwLrdK+kwbAIei+ff1eeiC0rDWFaQdASKDFjE/melIoRzx9fEfbRGN1JXVFKMfDD3/VEeq2NXCftfl+rZV49fz/Xkq/eAMAgmma5k6dAs9hYh0geHfxtEal0nJSDJZlyXmHMpLBkmirma5aK+lYtdo6KTIM0ycxnz1LIjmtIiMjwURiQ78dbKag+BcBQmIWAAAoOtvk/aq/8L9LWNjyUZd1f15TDfom15+a6DVhYctHofRLBZWkAhAhqKzhy9Z7F+viIipAYJ9a14Om2RGo9aS60u4xoj8DU4jSsoXv/uEJrD9BvXMXGTjd8sukTbc4Wb1zI7RyABPyhW2sToRhHtq9NE1b1QzkcrnF8tV1xmiFvuHP+VFRm6BIceaCtq96JbeHY8ajfNoCAMCbb09oFGItXIY2/5CQkICkJYlZyXVawIpZdysXJVUbw0J7aqpXKvd/vWJp6mSU/hiG4YRyXPXEjIBt8jbd4uSeNsQKY6DkYmV8+gdL80KRZF23lrPl8dc5oYP+G/Vl0lv56gpjoORywwebPlTsm4rSXwgtacPEOsDMAbGxCqhy4DExMeR/hjcmHzp08G5351Rta0rqNe2MJN+XVs6D+ZxSqVRcX7kRUJ1WNE1zwzy0e4VYCz7VBcSu5PrmzNCXNTsmpBd9e6TGTKin905LnxawYhZqZrPgORJuEnGiQCxZg4M2Bh9TzTp19oJKaybU81/Nz58RsE2OKutb0gkNU2zofXfzOLcPRsHoSa6frptQmHtQXVdhDJSUt76zoKYw/IDkpS9TUeZLURQHFcJlqyqtYl1XdIdtXvOKT3E9mqYFqYhaa1AoUOtA8b0sFRKsNSgUMHMCAlV87avyL6oM1mqp9bdKqxAXTCFBIaq0CiMrXHE9IWtemUwmcKZou9Ye883JTauD2ZtYY3VCrVW2gUtEfWPzQXr6J/f6stN2Oa1YJM0Gpr4Wqta6fPkypKxNLMuSD5pC1jjyb7whaUK2mNqqkGCS3FKn2CFW1D3gSGJC/EdtthyTpmkO9sABJlYnJdftO0OLUWtBoUCjyW3rq2Bil9PqL0hOqy6bofDpFq0lye4NeUcqvW1VugUVBzWZtweTV846wz6EKdQnFqYQpWULY86/YwsFw4w/7hwL/RLBxOqkoLxWzD9yclOxGBuLZfNaJkuLt1iKKkB1Ws2ZM+uRGMdtf6kugLQGqLLbCgkJ8Zyv9HiUM2irCfEftcEU6hObXP+4c2yqmAqGGWeKtp9BeYlgYnVycv00xzMRtayypU+dq7r8cq/pZ5ItkeA17YwkJDkpijMfNBAaPkRm1sJFs4yo99mykissqYZuqFzhLKS6MOb8O/YkVTOmeX3xSdbJ11PF1FyLdXEZ7gFHElHmi4l1AJgF5q5qSKyuzzrBl2BpmuY0mty2T3M8E1/xn/eqJVLtOmmVjbRvumJXxUsOw6dEthCVXBmGARrN/n7Lf1CTeVtsUmXWrQU5uWmCfP47Cql2J1dlTluIantKi5D9ymThXFn96lg3j3P7UOfr2vOzSm+IgIhIrnYYYnHzKPxcb4jotXSyC3hqiAsYPAgAFygi8Jp+JrnWoBBFzk9zPBM/Bdb6LgYALOVFroAAewavilbMXaUADSXBiR0dD1wvXfrLoL7KUKtUKm7cuDFPJk17dGkwWaadSCzdAzs2qtNKqNhVS1orw2TskMujEMwdLKnqf/A95yc9FaWr3yHdm3ZzAUrJ7y4tNYH7j4ihuYPI41obaKqcT0hOSFn96qDsPw2NVe/chSZr/Edt8yLbt7uSOUWORKrdzQLg/cD5ZQtXB317zPP3MRvjR/HtSyYL5xaHSRpeeD0nmu9cXUwmE1b7BiisJVXho0XyTdQidjpDvtpnz9wBhw7ltMIelWUYhktLS3sOgK6DAI85ibTm8vN0QcGZIdnZ2WRfZOrn5/3IN+jqZ2Dore/9iKPH+M5Zc2jfraVhkeOgZF23lktT73wOgK7A+E4uIOhGqd+qQrbMPTs7h+yLTH18R3Mvz9LGugxtu9MfQkVNaCLEWLcuhu++1wGGl5bccLf2IklPV90e/tunHggxV0ysGBg9wJdY/9/3XI/TVz0Bm7BFLGJFITxH1E7FInUh54pzBWBgCAyhiNNmn9ADHPaYI3ZeYWBgYGBixcDAwMDEioGBgYGJFQMDAwMDEysGxq8QOKIHEysGBobQxPoErwEmVgwMDEH11SeYWDGxYmBgYFMAJlYMDAzHtgRgjRUTKwYGhsDEitfAQYFzBWBgdEPvyVxMwAQ6O02gs7Mnm9nz+GqF8fXXAOiELk3zazi+iokVAwMDA5sCMDAwMDBg8LcBABUeq7qK2tkvAAAAAElFTkSuQmCC`;

    doc.addImage(imgData, 'JPEG', 20, 10, 100, 26);
    doc.text(20, 50, 'Olá, obrigado pela compra conosco!');
    doc.text(20, 60, 'Este é o seu comprovante de compra do seu produto.');

    return doc.output('blob');
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
