module.exports = {
    index: function(req, res, next) {

        res.view('prehome', {
            layout: 'layout_pre_home'
        });
    }
}
