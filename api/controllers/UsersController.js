/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next) {
		Users.find().exec(function(err, users){
			if(err) return next(err);

			res.view({
				users: users,
				layout: 'layout_admin.ejs'
			});
		});
	},
	login: function(req, res) {
		res.view({layout: 'layout_login.ejs'});
	},
	signup: function(req, res) {
		res.view({layout: 'layout_login.ejs'});
	},
	create: function(req,res,next) {
		var allParams = req.params.all();
		allParams.admin = allParams.admin == 1 ? true : false;

		Users.create( allParams, function userCreated (err, user) {
			if(err) {
				req.session.flash = { err: err }

				res.locals.flash = req.session.flash;
				return res.redirect('/users/signup');
			}

			// res.json(user);
			res.redirect('/users')
		});
	},
	edit: function(req, res,next) {
		Users.findOne(req.param('id'))
			.exec(function foundUser(err, user) {
				if(err) return next(err);
				res.view({
					user: user,
					layout: 'layout_admin'
				});
		});
	},
	update: function(req, res, next) {
		var allParams = req.params.all();
		allParams.admin = allParams.admin == 1 ? true : false;

		if(allParams.encryptedPassword == null || allParams.encryptedPassword.length == 0) {
			Users.findOne(req.param('id'))
				.exec(function foundUser(err, user) {
					allParams.encryptedPassword = user.encryptedPassword;

					Users.update(req.param('id'), allParams, function userUpdated (err) {
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
			Users.update(req.param('id'), allParams, function userUpdated (err) {
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
	delete: function(req, res, next) {
		Users.findOne(req.param('id'), function foundUser (err, user) {
			if(err) return next(err);
			if(!user) return next('User doesn\'t exist');

			Users.destroy(req.param('id'), function(err) {
				if (err) next(err);

				res.redirect('/admin?d=1');
			});
		});
	}
};
