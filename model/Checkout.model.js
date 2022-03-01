const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checkoutSchema = Schema({
  
    dataCart: [],


    idTable: {
        type: Number
    },

    date: {
        type: Date
    },

    time: {
        type: String
    },

    

},{
        collection: 'checkout'
    }
);
const Checkout = mongoose.model('checkout', checkoutSchema,'checkout');
module.exports= Checkout;