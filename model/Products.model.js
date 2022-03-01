const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productsSchema = Schema({
  
    images: {
        type: []
    },

    name: {
        type: String
    },

    price: {
        type: Number
    },

    quantity: {
        type: Number
    },

    description: {
        type: String
    },
    type: {
        type: String
    }

},{
        collection: 'products'
    }
);
const Products = mongoose.model('products', productsSchema,'products');
module.exports= Products;