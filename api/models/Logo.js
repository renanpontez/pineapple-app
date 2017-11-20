/**
 * Product_type.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    schema: true,

    attributes: {
        title: {
            type: 'string',
            required: true,
            unique: true
        },
        photo: {
            type: 'string',
            required: true
        },
        products: {
            collection: 'Product',
            via: 'Logo'
        },
    },

    beforeDestroy: function(criteria, cb) {
        Logo.find(criteria).populate('products').exec(function (err, logos) {
            if(err) return cb(err);

            logos.forEach(function(recordToDestroy) {
                Product.update({id: _.pluck(recordToDestroy.products, 'id')}, {Logo: ''}).exec(function(err, updated) {
                    return cb();
                })
            });
        });
    }
};

//DEFAULT REGISTER: ID => 1 - TITLE => NONE - IMG => nophoto.png
