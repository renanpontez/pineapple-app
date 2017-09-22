/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    schema: true,

    attributes: {

        color: {
            type: 'string',
            required: true
        },
        price: {
            type: 'string',
            required: true
        },
        cost_price: {
            type: 'string',
            required: true
        },
        serial_number: {
            type: 'string',
            required: true
        },
        state: {
            type: 'string',
            required: false
        },
        storage: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string',
            required: false
        },
        sold: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        ProductType: {
            model: 'ProductType'
        },
        Logo: {
            model: 'Logo'
        },

    },
};
