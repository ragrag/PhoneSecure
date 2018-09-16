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
        seen:{
          type:Boolean,
          default:false
        },
        long: String,
        lat: String ,
        battery:String,
        phoneNumber:String,
        date:{
            type:Date,
        },
        required: false
    },
    user: {
        type: ObjectId,  ref: 'User',
        required: false
        },

    API: {
    type :String,
    required:false
    }
 
});

const Phone = module.exports = mongoose.model('Phone',PhoneSchema);