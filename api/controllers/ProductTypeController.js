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
		var filePath;
		var allParams = req.params.all();

		req.file('photo').upload({
			dirname: require('path').resolve(sails.config.appPath, 'assets/models')
		},function (err, uploadedFiles) {
			if(uploadedFiles.length > 0) {
				filePath = uploadedFiles[0].fd.split('models/')[1];
				allParams.photo = filePath;
			}

			ProductType.create( allParams, function typeCreated (err, type) {
				if (err) {
					req.session.flash = {
						err: err
					}
					return res.redirect('/producttype/add');
				}
				res.redirect(`/producttype`);
			});
		});
	},
	//GET
	edit: function(req, res, next) {

		ProductType.findOne(req.param('id'))
			.exec(function ( err, productType) {
				if (err) return next(err);

				res.view({
					type: productType,
					layout: 'layout_admin'
				});
		});
	},
	//POST
	update: function(req, res, next) {
		var allParams = req.params.all();
		var photoFile = req.file('photo');

		if(photoFile._files.length > 0) {
			req.file('photo').upload({
				dirname: require('path').resolve(sails.config.appPath, 'assets/models')
			},function (err, uploadedFiles) {

				filePath = uploadedFiles[0].fd.split('models/')[1];
				allParams.photo = filePath;

				ProductType.update(req.param('id'), allParams, function productUpdated (err) {
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

			ProductType.update(req.param('id'), allParams, function productUpdated (err) {
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
		ProductType.findOne(req.param('id'), function foundType (err, productType) {
			if(err) return next(err);
			if(!productType) return next('Product type doesn\'t exist');

			ProductType.destroy(req.param('id'), function(err) {
				if (err) next(err);

				res.redirect('/admin?d=1');
			});
		});
	},
};
