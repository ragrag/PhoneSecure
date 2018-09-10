const mongoose = require('mongoose');

//User Schema
const LocationSchema = mongoose.Schema({
    
  
    long:{
        type:String,
        required:true,
    },
    Lat:{
        type:String,
        required:true
    },

    date: {
        type: Date,
        default: Date.now
    },

 
});

const Location = module.exports = mongoose.model('Location',LocationSchema);