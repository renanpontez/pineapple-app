/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        schema: true,

        color: {
            type: 'string',
            required: true
        },
        price: {
            type: 'decimal',
            required: true
        },
        state: {
            type: 'string',
            required: false
        },
        description: {
            type: 'string',
            required: false
        },
        Product_type: {
            model: 'Product_type'
        }
    },
};
