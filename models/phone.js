const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//Phone Schema
const PhoneSchema = mongoose.Schema({

    manf:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },

    imei: {
        type: String,
        required: true,
        unique:true
    },

    locationHistory: [{
        type: ObjectId,  ref: 'Location',
        required: false
        }],

    lastSeen:{
        long: String,
        lat: String ,
        battery:String,
        required: false
    },
    user: {
        type: ObjectId,  ref: 'User',
        required: false
        },
 
});

const Phone = module.exports = mongoose.model('Phone',PhoneSchema);