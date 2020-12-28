require('dotenv').config()

const express = require('express');
const session = require("express-session");
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
// const helmet = require('helmet');
const http = require('http');
const WebSocket = require('ws');

const uuiders = require('uuid');

const passportConfig = require('./config/passport');


const homeRouter = require('./routes/home');
const accountsRouter = require('./routes/accounts');

var job = require('./cron.js');



const app = express();
const port = process.env.PORT || 3000;
// var expressWs = require('express-ws')(app);
// const wsRouter = require('./routes/ws');

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')

app.use(express.static('public'))
app.use('/static', express.static('public'))
// app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(expressLayouts)

app.set('trust proxy', true)
app.use(session({ secret: "C4$s", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(passportConfig.initialize());
app.use(passportConfig.session());



app.get('/', (req, res) => {
  if (req.isAuthenticated())
    res.redirect('/home');
  else
    res.render('index/first-visit');
})


// app.use("/feed",wsRouter);
app.use('/home', homeRouter);
app.use('/accounts', accountsRouter);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, clientTracking: true });

// server.on('upgrade')
const db = require('./config/database');

let rooms = {};
wss.on('connection', function (ws, req) {
  // clients[req.url.substring(1)] = ws;
  let uuid = uuiders.v4();
  const leave = room => {
    console.log("Start of leave function: " + Object.keys(rooms).length);
    if (!rooms[room][uuid]) return; // not present: do nothing
    if (Object.keys(rooms[room]).length === 1) delete rooms[room]; // if the one exiting is the last one, destroy the room
    else delete rooms[room][uuid]; // otherwise simply leave the room
    console.log("Someone tried to leave, we now have:" + Object.keys(rooms).length);

  };
  ws.on('message', function (dataer) {
    let data = JSON.parse(dataer);
    console.log(dataer);
    if (data.meta == 'join') {
      console.log("Someone tried to join");
      if (!rooms[data.uuid]) {
        console.log("someone created");
        rooms[data.uuid] = {}; // create the room
      }
      if (!rooms[data.uuid][uuid]) {
        console.log("Someone joined");
        rooms[data.uuid][uuid] = ws;
      }  // join the room
    } else if (data.meta === "leave") {
      leave(data.uuid);
    } else if (!data.meta) {
      if (data.type == 'res') {
        console.log('Storing to database now!');
        db.query("INSERT INTO feeding_logs (pet_id,duration,status) VALUES (?,?,?)", [data.id, data.duration, "SUCCESS"], (err, results) => {
          if (err) console.log(err);
          else console.log('Success');
        })
      } else if (data.type == 'req') {
        console.log("Requesting to feed");
        Object.entries(rooms[data.uuid]).forEach(([, sock]) => sock.send(JSON.stringify(data)));
      }
    }

  });
  ws.on("close", () => {
    Object.keys(rooms).forEach(room => leave(room));
  });

})


server.listen(port, () => {
  job.start();
  console.log(`App listening at http://localhost:${port}`);
})
