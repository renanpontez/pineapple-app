module.exports = {
    findAllTypes: function(callback) {
        // here you call your models, add object security validation, etc...
        return ProductType.findAll();
    }
};
