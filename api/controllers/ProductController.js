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
			if(result.length == 0){
				req.flash('error', 'Você precisa cadastrar um tipo de produto primeiro.');
				return res.redirect('/admin');
			}

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
			sails.log(uploadedFiles.length);
			if(uploadedFiles.length) {
				filePath = uploadedFiles[0].fd.split('uploads\\')[1];
				allParams.photo = filePath;
			}
			sails.log(allParams);

			Product.create( allParams, function typeCreated (err, type) {
				if (err) {
					req.session.flash = {
						err: err
					}
					return res.redirect('product/add');
				}

				res.redirect(`/admin?c=1`);
			});
		});
	},
	//GET
	edit: function(req, res, next) {

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
		var allParams = req.params.all();
		var photoFile = req.file('photo');

		if(photoFile._files.length > 0) {
			req.file('photo').upload({
				dirname: require('path').resolve(sails.config.appPath, 'assets/uploads')
			},function (err, uploadedFiles) {

				filePath = uploadedFiles[0].fd.split('uploads\\')[1];
				allParams.photo = filePath;

				Product.update(req.param('id'), allParams, function productUpdated (err) {
					if (err) {
						return res.json({
							err: err,
							status: false
						});
					}

					res.redirect('/admin/?u=1');
				});
			});
		} else {
 			photoFile.upload({noop: true});
			delete allParams.photo;

			Product.update(req.param('id'), allParams, function productUpdated (err) {
				if (err) {
					return res.json({
						err: err,
						status: false
					});
				}

				res.redirect('/admin/?u=1');
			});
		}
	},
	delete: function (req, res, next) {
		Product.findOne(req.param('id'), function foundProduct (err, product) {
			if(err) return next(err);
			if(!product) return next('Product doesn\'t exist');

			Product.destroy(req.param('id'), function(err) {
				if (err) next(err);

				res.redirect('/admin?d=1');
			});
		});
	}
};
