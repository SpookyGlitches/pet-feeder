const express = require('express');
const passport = require('passport')
const session = require("express-session");
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')

const homeRouter = require('./routes/home');
const accountsRouter = require('./routes/accounts');
const testsRouter = require('./routes/test');
const app = express();

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')

app.use(express.static('public'))
app.use('/static', express.static('public'))

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
app.use(expressLayouts)

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(flash());

const passportConfig = require('./config/passport');
app.use(passportConfig.initialize());
app.use(passportConfig.session());



app.set('trust proxy', true)

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

app.get('/',(req,res)=>{
    res.render('index/first-visit');
})

app.use('/home',homeRouter);
app.use('/accounts',accountsRouter);
app.use('/test',testsRouter);
var job = require('./cron.js');
console.log(job.start())

app.listen(8080, () => console.log(`App listening at http://localhost:8080`))
