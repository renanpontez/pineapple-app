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

			Logo.find(function foundLogos(errLogo, logos) {
				if(errLogo) return next(errLogo);

				res.view({
					productTypes: result,
					productColors: GeneralService.getColors(),
					logos: logos,
					layout: 'layout_admin.ejs'
				});
			});
		});
	},
	//POST
	create: function(req, res, next) {
		var filePath;
		var allParams = req.params.all();

		Product.create( allParams, function typeCreated (err, type) {
			if (err) {
				req.session.flash = {
					err: err
				}
				return res.redirect('product/add');
			}

			res.redirect(`/admin?c=1`);
		});
	},
	//GET
	edit: function(req, res, next) {

		Product.findOne(req.param('id'))
			.populateAll()
			.exec(function ( errProduct, product) {
				if (errProduct) return next(errProduct);

				ProductType.find()
					.exec(function foundResult(err, types) {
						if(err) return next(err);

						Logo.find()
							.exec(function foundLogo(errLogo, logos) {
								if(errLogo) return next(errLogo);

								res.view({
									product: product,
									productTypes: types,
									productColors: GeneralService.getColors(),
									logos: logos,
									layout: 'layout_admin'
								});
						});
				});
		});
	},
	//POST
	update: function(req, res, next) {
		var allParams = req.params.all();
		Product.update(req.param('id'), allParams, function productUpdated (err) {
			if (err) {
				return res.json({
					err: err,
					status: false
				});
			}

			res.redirect('/admin/?u=1');
		});
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
	},
	//get
	details: function(req, res, next) {
		ProductType.find()
			.exec(function foundResult(err, types){
				if(err) return next(err);

				Product.findOne(req.param('id'))
					.populateAll()
					.exec(function ( err, product) {
						if (err) return next(err);

						res.view({
							product: product,
							productTypes: types
						});
				});
		});
	},
	receipt: function(req, res, next) {

		var productId = req.param('id');

		return res.view({productId: productId, layout: 'layout_admin'});
	},
	viewReceipt: function(req, res, next) {
		var dateNow = DateService.getDayMonthYearNow();
		var productId = req.param('product_id');
		var sellingCod = dateNow.split('/')[0] + dateNow.split('/')[1] + productId;

		Product.findOne(productId)
			.populateAll()
			.exec(function ( err, product) {
				if (err) return next(err);

				return res.view('emailTemplates/receiptEmail/preview.ejs', {
					product: product,
					receiverEmail: req.param('email'),
					receiverName: req.param('name'),
					receiverPhone: req.param('phone'),
					dateNow: dateNow,
					paymentMethod: req.param('payment_method'),
					sellingCod: sellingCod,
					layout: 'layout_null.ejs'
				});
			});
	},
	sendReceipt: function(req, res, next) {
		var dateNow = DateService.getDayMonthYearNow();
		var productId = req.param('productId');
		var sellingCod = dateNow.split('/')[0] + dateNow.split('/')[1] + productId;

		Product.findOne(req.param('productId'))
			.populateAll()
			.exec(function ( err, product) {
				if (err) return next(err);


				sails.hooks.email.send(
					"receiptEmail",
						{
			  				product: product,
							receiverEmail: req.param('email'),
							receiverName: req.param('name'),
							receiverPhone: req.param('phone'),
							dateNow: dateNow,
							paymentMethod: req.param('payment_method'),
							sellingCod: sellingCod
					  	},
					  	{
						    to: req.param('email'),
						    subject: "Comprovante de Compra - PineApple"
					  	},
					  	function(err) {
							if (err) {
								  return res.json({
									  err: err,
									  status: false
								  });
							 }
							 else {
								  return res.json({
								  	status: true,
									receiverEmail: req.param('email')
								  });
					  		}
				  		}
				  );
			}
		);
	}
};
