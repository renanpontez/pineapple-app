module.exports = {
    index: function(req, res) {
        Product.find().populate('ProductType').exec(function(err, result){
            if(err) return next(err);

            res.view('homepage', {
                products: result,
            });
        });
    },
}
