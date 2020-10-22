const express = require('express');
const passport = require('passport');
const router = express.Router()
router.get('/sign-in', (req,res) => {
    res.render('accounts/sign-in')
});
router.get('/sign-up', (req,res) => {
    res.render('accounts/sign-up')
});
router.post('/sign-up', (req,res) => {
    let userModule = require('../models/user')
    if(req.body.email != "" && req.body.password != ""){
        userModule.createUser(req.body.email,req.body.password,function(err){
            if(err){
                res.send("Unable to create user");
                console.log(err)
            }
            res.redirect('/');
        })
    }
});
router.post('/sign-in',passport.authenticate('local',{
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}))
router.get('/log-out',(req,res)=>{
    req.logout();
    res.redirect('/');
})
module.exports = router