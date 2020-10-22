const express = require('express');
const passport = require('passport')
const session = require("express-session");
var flash = require('connect-flash');

const app = express();

const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index');
const accountsRouter = require('./routes/accounts');
const testsRouter = require('./routes/test');

app.set('view engine', 'ejs');
app.set('views', __dirname +'/views')
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(express.static(__dirname +'/public'))
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(flash());
require('./config/passport');
app.use(passport.initialize());
// app.use(flash());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
app.use(expressLayouts)

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', true)
app.use('/',indexRouter);
app.use('/accounts',accountsRouter);
app.use('/test',testsRouter);

app.listen(1234, () => console.log(`App listening at http://localhost:1234`))
