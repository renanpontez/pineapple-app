/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function(req, res) {
        Product.find().populate('ProductType').sort('sold ASC').exec(function(err, result){
            if(err) return next(err);

            res.view({
                products: result,
                layout: 'layout_admin.ejs'
            });
        });
	},
};
