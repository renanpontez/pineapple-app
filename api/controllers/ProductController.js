/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var productTypeController = require('./ProductTypeController');
module.exports = {
	//GET
	add: function(req, res, next) {
		ProductType.find(function foundResult(err, result){
			if(err) return next(err);

			res.view({
				productTypes: result,
				layout: 'layout_null.ejs'
			});
		});
	},
	//POST
	create: function(req, res, next) {
		var filePath;
		var allParams = req.params.all();

		req.file('photo').upload({
			dirname: require('path').resolve(sails.config.appPath, 'assets/uploads')
		},function (err, uploadedFiles) {

			filePath = uploadedFiles[0].fd.split('uploads\\')[1];
			allParams.photo = filePath;

			Product.create( allParams, function typeCreated (err, type) {
				if (err) return next(err);

				res.redirect(`/admin?c=1`);
			});
		});
	},
	//GET
	edit: function(req, res) {

		ProductType.find()
			.exec(function foundResult(err, types){
				if(err) return next(err);

				Product.findOne(req.param('id'))
					.populate('ProductType')
					.exec(function ( err, product) {
						if (err) return next(err);

						res.view({
							product: product,
							productTypes: types,
							layout: 'layout_admin'
						});
				});
		});
	},
	//POST
	update: function(req, res, next) {
		Product.update(req.param('id'), req.params.all(), function productUpdated (err) {
			if (err) {
				return res.json({
					err: err,
					status: false
				});
			}

			res.redirect('/admin/?u=1');
		});
	},
};
