const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

let masterSchame = mongoose.Schema({
    name: String,
    email: String,
    password: String,
}, { collection: "master" })

let masterModel = mongoose.model('Master', masterSchame, 'Master');

let app = express()

app.use(express.static('views'))
app.use(session({secret: 'secretkey', resave: false, saveUninitialized: false }))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
done(null, user);
});

// use these strategies
passport.use('local',new LocalStrategy(
    function (username, password, done) {
        console.log(`Trying to verify user, username:${username} password:${password}`)
        console.log(username);
        console.log(password);
        if (username != 'joe' || password != 'password') {
            console.log(`Failed to verify user, username:${username} password:${password}`)
            return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, { "username": username, "password": password },{message:'Successfully authenticated!'});
    }
));


app.get('/', (req,res)=>{
    let sess = req.session;
    console.log(`session id is: ${sess.id}`);
    res.json(sess);
})

app.get('/login', (req, res)=>{
    res.sendfile('./views/view.html');
})

app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',// 可以先尝试设置/session-demo 来查看对应的情况
            failureFlash: true
        }));

app.listen(5050);
