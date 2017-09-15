module.exports = {
    index: function(req, res, next) {
        Logo.find(function foundResult(err, result){
			if(err) return next(err);

			res.view({
				logos: result,
				layout: 'layout_admin.ejs'
			});
		});
    },
    add: function(req, res, next) {
        res.view({
            layout: 'layout_admin.ejs'
        });
    },
    create: function(req, res, next) {
        var filePath;
		var allParams = req.params.all();

		req.file('photo').upload({
			dirname: require('path').resolve(sails.config.appPath, 'assets/models')
		},function (err, uploadedFiles) {
			if(uploadedFiles.length > 0) {
                var prodPath = uploadedFiles[0].fd.split('models/')[1];
                var localPath = uploadedFiles[0].fd.split('models\\')[1];
				allParams.photo = (typeof prodPath != "undefined") ? prodPath : localPath;
			}

            Logo.create( allParams, function logoCreated (err, logo) {
                if (err) {
                    req.session.flash = {
                        error: err
                    }
                    return res.redirect('logo/add');
                }

                res.redirect(`/logo?c=1`);
            });
        });
    },
    edit: function(req, res, next) {
        Logo.findOne(req.param('id'))
            .exec(function ( err, logo) {
                if (err) return next(err);

                res.view({
                    logo: logo,
                    layout: 'layout_admin'
                });
        });
    },
    update: function(req, res, next) {
        var allParams = req.params.all();
        var photoFile = req.file('photo');

        if(photoFile._files.length > 0) {
            req.file('photo').upload({
                dirname: require('path').resolve(sails.config.appPath, 'assets/models')
            },function (err, uploadedFiles) {

                var prodPath = uploadedFiles[0].fd.split('models/')[1];
                var localPath = uploadedFiles[0].fd.split('models\\')[1];
				allParams.photo = (typeof prodPath != "undefined") ? prodPath : localPath;

                Logo.update(req.param('id'), allParams, function productUpdated (err) {
                    if (err) {
                        return res.json({
                            err: err,
                            status: false
                        });
                    }

                    res.redirect('/logo/?u=1');
                });
            });
        } else {
            photoFile.upload({noop: true});
            delete allParams.photo;

            Logo.update(req.param('id'), allParams, function productUpdated (err) {
                if (err) {
                    return res.json({
                        err: err,
                        status: false
                    });
                }

                res.redirect('/logo/?u=1');
            });
        }
    },
    delete: function (req, res, next) {
		Logo.findOne(req.param('id'), function foundLogo (err, logo) {
			if(err) return next(err);
			if(!logo) return next('Logo type doesn\'t exist');

			Logo.destroy(req.param('id'), function(err) {
				if (err) next(err);

				res.redirect('/admin?d=1');
			});
		});
	},
}
