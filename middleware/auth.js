let mw = function (req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.render('index/first-visit');
    }
};
module.exports = mw;