$(document).ready(function() {

    $('.form-product-new').validate({
        rules: {
            description: {
                required: true
            },
            color: {
                required: true,
            },
            storage: {
                required:true
            },
            price: {
                required:true
            },
            ProductType: {
                required:true
            }
        }
    });

    $('.form-type-new').validate({
        rules: {
            name: {
                required: true
            },
            version: {
                required: true,
            }
        }
    });
});
