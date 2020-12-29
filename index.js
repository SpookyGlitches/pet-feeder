require('dotenv').config()

const express = require('express');
// const session = require("express-session");
// const flash = require('connect-flash');
// const bodyParser = require('body-parser')
// const expressLayouts = require('express-ejs-layouts')
// const http = require('http');
// // const WebSocket = require('ws');

// const uuiders = require('uuid');

// const passportConfig = require('./config/passport');


const homeRouter = require('./routes/home');
// const accountsRouter = require('./routes/accounts');

// // var job = require('./cron.js');



const app = express();
const port = process.env.PORT || 3000;

app.get('/',function(req,res){
  res.send("Hello");
})

app.use('/home',homeRouter);

app.listen(port, function(){
  console.log("App running at port " + port);
})


