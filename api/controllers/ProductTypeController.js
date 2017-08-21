/**
 * Product_typeController
 *
 * @description :: Server-side logic for managing product_types
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//GET
	index: function(req, res, next) {
		ProductType.find(function foundResult(err, result){
			if(err) return next(err);

			res.view({
				productTypes: result,
				layout: 'layout_admin.ejs'
			});
		});
	},
	//GET
	add: function(req, res) {
		res.view({layout: 'layout_admin.ejs'});
	},
	//POST
	create: function(req, res, next) {
		ProductType.create( req.params.all(), function typeCreated (err, type) {
			if (err) return next(err);

			res.redirect(`/producttype`);
		});
	},
	allTypes: function() {
		return ProductType.find();
	}
};
