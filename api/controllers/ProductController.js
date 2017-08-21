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
				layout: 'layout_admin.ejs'
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
			sails.log(uploadedFiles);
			sails.log(filePath);
			allParams.photo = filePath;

			Product.create( allParams, function typeCreated (err, type) {
				if (err) return next(err);

				res.redirect(`/admin?c=1`);
			});
		});
	},
	//GET
	edit: function(req, res) {
		Product.findOne(req.param('id'), function foundUser ( err, product) {
			if (err) return next(err);
			if (!product) return next();

			res.view({
				product:product,
				layout: 'layout_admin.ejs'
			});
		});
	},
	//POST
	update: function(req, res, next) {
		res.view({layout: 'layout_admin.ejs'});
	},
};
