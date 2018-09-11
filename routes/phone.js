const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');


//Fetch models
let Phone = require('../models/phone');

router.get('/:id', ensureAuthenticated,(req, res)=>{


    Phone.findById(req.params.id,(err,phone)=>{
        console.log(phone)
    res.render('phone',{phone:phone});

    });
});



//Access Coontrol
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login first');
        res.redirect('/users/login');
    }
}

module.exports = router;