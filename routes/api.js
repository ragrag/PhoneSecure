const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const admin = require('firebase-admin');

//Fetch models
let Phone = require('../models/phone');
let User = require('../models/user');

router.get('/test',(req,res)=>{
    console.log('in');
    return res.json({success:true});
})

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
 
    console.log("TEST API IN");
    Phone.findOne({
        imei: req.body.imei
    }).populate('user').exec((err, phone) => {
        if (err) {
            return res.json({
                success: false,
                message: 'An error occured while fetching phone data'
            });
        } else if (phone) {

      
            if (phone.user._id.equals(req.user._id)) {
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
                found: false,
                owner: false
            });
        }
    });
});


//Add Device
router.post('/addevice', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    
    let phone = new Phone({
        imei: req.body.imei,
        manf:req.body.manf,
        model:req.body.model,
        user:req.user._id,


      });
      console.log(req);
      console.log(phone.manf);
      console.log(phone);
      
      let upsertData = phone.toObject();
      delete upsertData._id;
      Phone.update({imei: phone.imei}, upsertData, {upsert: true}, (err,_phone)=>{
        if(err)
        return res.json({
            success: false,
            message:'An error occured while adding device to your account'
        });
        else{
            return res.json({
                success: true,
            });
        }

      });
});




//Remove Device
router.post('/removedevice', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
   
    Phone.findOneAndRemove({
        imei: req.body.imei
    },(err) => {
        if (err) {
            return res.json({
                success: false,
                message: 'An error occured while removing device from your account'
            });
        } else {
            return res.json({
                success: true,
            });
        }
    });
});


//Update Last Location
router.post('/updatelocation', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log('in');
    Phone.findOne({
        imei: req.body.imei
    },(err,phone) => {
        if (err) {
     console.log(err);
        } else {
            phone.lastSeen.long = req.body.long;
            phone.lastSeen.lat = req.body.lat;
            phone.lastSeen.battery = req.body.battery;
            phone.lastSeen.date = Date.now();
            phone.lastSeen.phoneNumber = req.body.phoneNumber;
            phone.lastSeen.seen =true;
            console.log(phone);
            phone.save((err)=>{
                if(err)
                    console.log(err);
            });
        }
    });
});



//Get Last Location
router.post('/getlocation',  (req, res) => {
  console.log(req.body.id);
    Phone.findById(
         req.body.id
    ,(err,phone) => {
        if (err) {
     console.log(err);
        } else {
            if (phone.lastSeen.seen)


                return res.json({
                    success: true,
                    data:phone.lastSeen,
                });
            else {
                return res.json({success:false});
            }
        }
    });
});


//Send locaiton request
router.post('/requestlocation', (req,res)=>{
    let topic = req.body.imei;

    // See documentation on defining a message payload.
    let message = {

      android: {

          priority: 'high',
        //   notification: {
        //     title: 'Notification',
        //     body: '.',
        //     icon: 'stock_ticker_update',
        //     color: '#f45342'
        //   },
        data: {
        message: 'Testing nodejs',
      },
    },
      topic: topic,
    
    };
    
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log(message);
        console.log('Successfully sent message:', response);
        return res.json({success:true});        
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });

});


module.exports = router;