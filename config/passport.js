var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto')
const db = require('./database')
// load up the user model
var user = require('../models/user');

const customFields = {
    usernameField:'email',
    passwordField:'password',
}
const verifyCallback = (email, password, done) => {
    if(!(email != "" || email != null) && (password != "" || password != null)){
        return done(null,false)
    }
    db.query("SELECT * FROM users WHERE email = ? LIMIT 1",[email],(err,result)=>{
        if(err){
            console.log("ARI NUON");
            throw err;
        }
        if(result.count == 0 ){
            return done(null,false);
        }else{
            if(validPassword(password,result[0].hash,result[0].salt)){
                console.log("Hoy ni sulod ko ari")
                return done(null,result[0]);
            }else{
                return done(null,false)
            }
        }
    })
}
const strategy  = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, 
            {
                id : user.id,
                email : user.email
            }
        );
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
module.exports = passport