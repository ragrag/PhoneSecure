const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },


   
});

const User = module.exports = mongoose.model('User',UserSchema);