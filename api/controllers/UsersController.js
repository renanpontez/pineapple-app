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
		Users.create( req.params.all(), function userCreated (err, user) {
		if(err) {
			console.log(err);
			req.session.flash = { err: err }

			res.locals.flash = req.session.flash;
			return res.redirect('/users/signup');
		}

		// res.json(user);
		res.redirect('/users')
	});
	}
};
