const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Tables = new Schema({
 
    idTable: {
        type: Number
    },

    status : {
        type: Boolean
    },
    dataTable: []

},{
        collection: 'tables'
    }
);
module.exports=mongoose.model('tables',Tables);

