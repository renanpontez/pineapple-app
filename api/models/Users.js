/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 const bcrypt = require('bcryptjs');

module.exports = {
	schema: true,

	attributes: {
		name: {
			type: 'string',
			required: true
		},
		email: {
			type: 'string',
			required: true,
			email: true,
			unique: true
		},
		encryptedPassword: {
			type: 'string',
			required: true
		},
        admin: {
            type: 'boolean',
            defaultsTo: false
        },
		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			delete obj.encryptedPassword;
			delete obj._csrf;
			return obj;
		},
	},
	beforeCreate: function (values, next) {
		if (!values.encryptedPassword) {
			return next({ err: ["Password was not sent"] })
		}

		require('bcryptjs').hash(values.encryptedPassword, 10, function passwordEncrypt(err, encryptedPassword) {
			if (err) return next(err);
			values.encryptedPassword = encryptedPassword;

			next();
		});
	}
};
