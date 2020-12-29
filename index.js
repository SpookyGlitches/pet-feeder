require('dotenv').config()

const express = require('express');
// const session = require("express-session");
// const flash = require('connect-flash');
// const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
// const http = require('http');
// // const WebSocket = require('ws');

// const uuiders = require('uuid');

// const passportConfig = require('./config/passport');


// const homeRouter = require('./routes/home');
// const accountsRouter = require('./routes/accounts');

// // var job = require('./cron.js');

const homeRouter = require('./routes/home');
const accountsRouter = require('./routes/accounts');

const passportConfig = require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(expressLayouts)

app.use(session({ secret: "C4$s", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(passportConfig.initialize());
app.use(passportConfig.session());


app.get('/',function(req,res){
  res.render('index/first-visit');
})

// app.get('/home/sign)
app.use('/accounts',accountsRouter);
app.use('/home',homeRouter);

app.listen(port, function(){
  console.log("App running at port " + port);
})


