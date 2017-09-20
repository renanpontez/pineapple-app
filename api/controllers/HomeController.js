module.exports = {
    index: function(req, res, next) {
        Product.find({
                sold: false,
                state: req.param('s')
            }).populateAll().exec(function(err, result){
            if(err) return next(err);

            res.view('homepage', {
                products: result,
                layout: 'layout_home'
            });
        });
    },
}
