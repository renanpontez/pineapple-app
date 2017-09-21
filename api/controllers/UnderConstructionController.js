module.exports = {
    index: function(req,res,next) {
        return res.view({
            layout: 'layout_home'
        });
    }
}
