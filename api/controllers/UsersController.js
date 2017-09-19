/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
	}
};
