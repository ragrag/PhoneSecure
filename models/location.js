const mongoose = require('mongoose');

//User Schema
const LocationSchema = mongoose.Schema({
    
    data:{
        long: String,
        lat: String ,
        required: true
    },


    date: {
        type: Date,
        default: Date.now
    },

 
});

const Location = module.exports = mongoose.model('Location',LocationSchema);