require('dotenv').config()

const express = require('express');
const session = require("express-session");
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const http = require('http');
const WebSocket = require('ws');
const uuiders = require('uuid');
var job = require('./cron.js');

const homeRouter = require('./routes/home');
const accountsRouter = require('./routes/accounts');

const passportConfig = require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')
app.use(expressLayouts)


app.use(session({ secret: "C4$s", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(passportConfig.initialize());
app.use(passportConfig.session());


app.get('/', function (req, res) {
  if(req.isAuthenticated()) res.redirect('/home');
  else res.render('index/first-visit',{time:new Date().toLocaleTimeString(["en-GB"],{hour:'2-digit',minute:'2-digit'})});
})
app.use('/accounts', accountsRouter);
app.use('/home', homeRouter);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, clientTracking: true })
const db = require('./config/database');

let rooms = {};

wss.on('connection', function (ws, req) {
  let uuid = uuiders.v4();
  ws.on("message", function (msg) {
    let data = JSON.parse(msg);
    switch (data.meta) {
      case "join":
        if (!rooms[data.uuid]) rooms[data.uuid] = {}; // create the room
        if (!rooms[data.uuid][uuid]) rooms[data.uuid][uuid] = ws; //join the existing room
        break;
      case "leave":
        leave(data.uuid);
        break;
      default:
        if (data.type == 'res') {
          console.log("Received response");
          db.promise().query("INSERT INTO feeding_logs (pet_id,duration,status) VALUES (?,?,?)", [data.id, data.duration, "SUCCESS"]).catch((error) => console.log(error));
        } else if (data.type == 'req') {
          console.log("Someone tried to request");
          Object.entries(rooms[data.uuid]).forEach(([, sock]) => sock.send(JSON.stringify(data)));
        }
    }
  })

  ws.on("close", () => {
    Object.keys(rooms).forEach(room => leave(room));
  })

  function leave(room) {
    console.log("Start leave, length rooms: " + Object.keys(rooms).length);
    if (!rooms[room][uuid]) return;
    if (Object.keys(rooms[room]).length == 1) delete rooms[room];
    else delete rooms[room][uuid];
    console.log("End leave, length rooms: " + Object.keys(rooms).length);
  }

})


server.listen(port, function () {
  job.start();
  console.log("App running at port " + port);
})


