const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');


//Fetch models
let Phone = require('../models/phone');

router.get('/:id', (req, res)=>{


    Phone.findById(req.params.id,(err,phone)=>{
        console.log(phone)
    res.render('phone',{phone:phone});

    });
});

module.exports = router;