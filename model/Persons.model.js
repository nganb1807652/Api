const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Persons = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: Number
        }
}, {
    collection: 'persons'
});
module.exports = mongoose.model('persons', Persons);