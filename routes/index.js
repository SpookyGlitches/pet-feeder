const express = require('express');
const router = express.Router()
const  db = require('../config/database')
router.get('/', (req,res) => {
    if(req.isAuthenticated()){
        // console.log(req.user)
        // console.log(req.ip)
        db.query("SELECT name,details,color FROM pets WHERE user_id=?",[req.user.id],(err,results)=>{
            if(err) throw err;
            console.log(results)
            res.render("index/home",
                        {
                            name:req.user.email,active:"Home",
                            pets:results
                        }
                    )
        })

    }else{
        res.render('index/first-visit')
    }
});
router.post('/add-pet',(req,res)=>{
    if(req.isAuthenticated()){
        db.query("INSERT INTO pets (user_id,name,details,color) VALUES (?,?,?,?)",[req.user.id,req.body.name,req.body.details,req.body.color],(err,results)=>{
            if(err) throw err;
            res.redirect('/');
        })
    }else{
        res.redirect('/')
    }
});

module.exports = router