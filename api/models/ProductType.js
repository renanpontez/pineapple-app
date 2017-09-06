/**
 * Product_type.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    schema: true,

    attributes: {

        name: {
            type: 'string',
            required: true
        },
        version: {
            type: 'string',
            required: true
        },
        products: {
            collection: 'Product',
            via: 'ProductType'
        },
        photo: {
            type: 'string',
            required: true
        }

    },

    beforeDestroy: function(criteria, cb) {
        ProductType.find(criteria).populate('products').exec(function (err, types) {
            if(err) return cb(err);

            types.forEach(function(recordToDestroy) {
                Product.destroy({id: _.pluck(recordToDestroy.products, 'id')}).exec(function(err) {
                    return cb();
                })
            });
        });
    }
};
