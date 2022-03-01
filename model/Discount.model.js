const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Discount = new Schema({
   
    codeDiscount: {
        type: String
    },
    condition: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
        }
}, {
    collection: 'discount'
});
module.exports = mongoose.model('discount', Discount);
