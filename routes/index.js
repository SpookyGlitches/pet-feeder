const express = require('express');
const router = express.Router()
const  db = require('../config/database')
router.get('/',(req,res)=>{
    res.render('index/first-visit');
})
router.get('/home', (req,res) => {
    if(req.isAuthenticated()){
        db.query("SELECT name,details,color FROM pets WHERE user_id=?",[req.user.id],(err,results)=>{
            if(err) throw err;
            const obj = {
                name : req.user.email,
                active : "Home",
                pets: results
            }
            res.render("index/home",obj)
        });

    }else{
        res.redirect('/');
    }
});
router.post('/add-pet',(req,res)=>{
    if(!req.isAuthenticated())
        res.redirect('/')
    db.query("INSERT INTO pets (user_id,name,details,color) VALUES (?,?,?,?)",[req.user.id,req.body.name,req.body.details,req.body.color], (err,results)=>{
        if(err) throw err;
        res.redirect('/home');
    })        
    // if(req.isAuthenticated()){
    //     db.query("INSERT INTO pets (user_id,name,details,color) VALUES (?,?,?,?)",[req.user.id,req.body.name,req.body.details,req.body.color],(err,results)=>{
    //         if(err) throw err;
    //         res.redirect('/');
    //     })
    // }else{
    //     res.redirect('/')
    // }
});

module.exports = router