const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


//Fetch models
let Phone = require('../models/phone');
let User = require('../models/user');

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if (err || !user) {
            return res.json({
                message: 'Error logging in',
                success: false,
                user: user
            });
        }
        req.login(user, {
            session: false
        }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user.toJSON(), 'your_jwt_secret');
            return res.json({
                user,
                token,
                success: true
            });
        });
    })(req, res);
});


//Check Device
router.post('/checkdevice', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Phone.findOne({
        imei: req.imei
    }).populate('user').exec((err, phone) => {
        if (err) {
            return res.json({
                success: false,
                message: 'An error occured while fetching phone data'
            });
        } else if (phone) {
            if (phone.user._id === req.user._id) {
                return res.json({
                    success: true,
                    found: true,
                    owner: true
                });
            } else {
                return res.json({
                    success: true,
                    found: true,
                    owner: false
                });
            }
        } else if (!phone) {
            return res.json({
                success: true,
                found: false
            });
        }
    });
});


//Add Device
router.post('/adddevice', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Phone.findOne({
        imei: req.imei
    }).populate('user').exec((err, phone) => {
        if (err) {
            return res.json({
                success: false,
                message: 'An error occured while fetching phone data'
            });
        } else if (phone) {
            if (phone.user._id === req.user._id) {
                return res.json({
                    success: true,
                    found: true,
                    owner: true
                });
            } else {
                return res.json({
                    success: true,
                    found: true,
                    owner: false
                });
            }
        } else if (!phone) {
            return res.json({
                success: true,
                found: false
            });
        }
    });
});




//Remove Device
router.post('/removdevice', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Phone.findOne({
        imei: req.imei
    }).populate('user').exec((err, phone) => {
        if (err) {
            return res.json({
                success: false,
                message: 'An error occured while fetching phone data'
            });
        } else if (phone) {
            if (phone.user._id === req.user._id) {
                return res.json({
                    success: true,
                    found: true,
                    owner: true
                });
            } else {
                return res.json({
                    success: true,
                    found: true,
                    owner: false
                });
            }
        } else if (!phone) {
            return res.json({
                success: true,
                found: false
            });
        }
    });
});




module.exports = router;