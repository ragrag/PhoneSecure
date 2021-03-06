const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const strings = require('../config/strings');
const bcrypt = require('bcryptjs');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = (passport) => {
    //Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {
        let query = {
            username: username
        };
        User.findOne(query, (err, user) => {
            if (err)
                throw err;
            if (!user)
                return done(null, false, {
                    message: 'User not found'
                });

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {

                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid Password'
                    });

                }
            });


        });

    }));



    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findOne({id:jwtPayload.id})
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}