/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 const bcrypt = require('bcryptjs');

module.exports = {
	new: function (req, res) {
		return res.view({});
	},
	create: function(req, res, next) {

		//IF EMAIL OR PASSWORD WASN'T SENT
		if(!req.param('email') || !req.param('password')) {

			var usernamePasswordRequiredError = [{ name: 'usernamePasswordRequiredError', message: 'You must enter both a username and password'}];

			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/users/login');
			return;
		}

		//USER NOT FOUND
		Users.findOne({
			email: req.param('email')
		}).exec(function(err, user) {
			if(err) return next(err);

			if(!user) {
				var accountNotFound = [{ name: 'accountNotFound', message: 'The email adress was not found'	}];
				req.session.flash = {
					err: accountNotFound
				};
				res.redirect('/users/login');
				return;
			}
			//CHECK USERNAME WITH PASSWORD
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid){
				if(err) return next(err);

				if(!valid) {
					var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatchError', message: 'Invalid username and password combination.'}];
					req.session.flash = {
						err: usernamePasswordMismatchError
					}
					res.redirect('/users/login');
					return;
				}

				//SESSION CREATE SUCESSFULLY
				req.session.authenticated = true;
				req.session.user = user;

				res.redirect('/admin');
			});
		});
	},
	destroy: function(req, res, next){

		req.session.destroy();
		res.redirect('/users/login');
	}




};
