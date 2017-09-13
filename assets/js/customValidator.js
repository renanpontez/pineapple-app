$(document).ready(function() {

    $('.form-product-new, #ProductEditForm').validate({
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
            cost_price: {
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
    $('.form-logo-new').validate({
        rules: {
            title: {
                required: true
            },
            photo: {
                required: true
            }
        }
    });
});
