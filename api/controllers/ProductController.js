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
	sendReceipt: function(req, res, next) {
		const md5 = require('md5');

		Product.findOne(req.param('productId'))
			.populateAll()
			.exec(function ( err, product) {
				if (err) return next(err);

				var nodemailer = require('nodemailer');
				var file = req.file('pdf');
				var dirname = sails.config.appPath + '/assets/uploads/receipts/';

				req.file('pdf').upload({

					saveAs: function(file, cb) {
						var d = new Date();
						var uuid = md5(d.getMilliseconds()) + ".pdf";

						cb(null, dirname + uuid);

					}

				},function (err, uploadedFiles) {
					if(uploadedFiles.length > 0) {
						var prodPath = uploadedFiles[0].fd.split('uploads/receipts/')[1];
						var localPath = uploadedFiles[0].fd.split('uploads\\receipts\\')[1];
						var filePath = (typeof prodPath != "undefined") ? prodPath : localPath;
						sails.log(filePath);
					}				// create reusable transporter object using SMTP transport

					var transporter = nodemailer.createTransport({
						service: 'Gmail',
						auth: {
							user: 'renanpontez@gmail.com',
							pass: 'carnaval2009'
						}
					});


					// setup e-mail data with unicode symbols
					var mailOptions = {
						from: 'Pineapple <renanpontez@gmail.com>', // sender address
						to: 'renanpontez@gmail.com', // list of receivers
						subject: 'Comprovante de Compra - PineApple', // Subject line
						// text: 'Hello world ✔', // plaintext body
						html: '<b>Olá! Segue em anexo seu comprovante de compra. <br>Obrigado pela compra com a gente!</b>', // html body
						attachments: [
							{   // encoded string as an attachment
					            filename: 'Comprovante de Compra- PineApple.pdf',
					            path: filePath,
					        },
						]
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, function(error, info){
						if(error){
							console.log(error);
							return res.json({status: false, err: error});
						}else{
							return res.json({status: true});
						}
					});
				});
			}
		);
	}
};
