const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//Phone Schema
const PhoneSchema = mongoose.Schema({

    imei: {
        type: String,
        required: true
    },

    locationHistory: [{
        type: ObjectId,  ref: 'Location',
        required: false
        }],

    user: {
        type: ObjectId,  ref: 'User',
        required: false
        },
 
});

const Phone = module.exports = mongoose.model('Phone',PhoneSchema);