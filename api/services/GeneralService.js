module.exports = {
    getColors: function() {
        var colors = [
            {
                id: 'white',
                name: 'Branco'
            },
            {
                id: 'black',
                name: 'Preto'
            },
            {
                id: 'pink_rose',
                name: 'Pink Rose'
            },
            {
                id: 'grey',
                name: 'Cinza'
            },
            {
                id: 'red',
                name: 'Vermelho'
            },
            {
                id: 'gold',
                name: 'Dourado'
            }
        ];

        return colors;
    },
    getUserLogged: function(req, res) {
        if ( !req.isAuthenticated() ) return res.forbidden();

        return res.json({user: req.user});
    }
}
// var result = selected_products.filter(function(v,i) {
//     return v[0] === 'r1';
// });
