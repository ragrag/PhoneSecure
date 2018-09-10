//requires
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const strings = require('./config/strings')
require('dotenv').config()



//Fetch models
let User = require('./models/user');
let Phone = require('./models/phone');

//connect and select db
mongoose.connect(strings.database);
let db = mongoose.connection;


//Check db connection
db.once('open', () => {
    console.log("Connected to db");
});


//Check for db errors
db.on('error', (err) => {
    console.log(err);
});

//init app
const app = express();


//load views Engine
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

//Set static folder
app.use(express.static(path.join(__dirname, 'static')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//User global variable
app.get('*', (req,res,next)=>{
res.locals.user = req.user || null;
next(); 
});


//FOREST ADMIN
app.use(require('forest-express-mongoose').init({
    modelsDir: __dirname + '/models',
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose: require('mongoose')
  }));

//home route
app.get('/', (req, res) => {

    res.render('index', {
        title: 'Hello2',
    });
});


//Dashboard route
app.get('/dashboard',ensureAuthenticated, (req, res) => {

    Phone.find({user:req.user._id}, (err,phones)=>{

        if(err)
            {
                console.log(err);

            }
        else {
            res.render('dashboard',{phones:phones});
        }

    });

    
});


//router files
let users = require('./routes/users');
app.use('/users', users);
let api = require('./routes/api');
app.use('/api', api);


//Access Coontrol
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login first');
        res.redirect('/users/login');
    }
}

//server start
app.listen(strings.port, () => {
    console.log("Server Started.");
});