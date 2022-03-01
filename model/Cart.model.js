const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const cartSchema = Schema({
  
    userId: String,
    products: [{

            productId: {type: Schema.Types.ObjectId , ref: 'products'},
            quantity: Number,
            name: String,
            price: Number,
            images : String

        }],
    // date: String 
});
const Cart = mongoose.model('carts', cartSchema,'carts');
module.exports= Cart;

