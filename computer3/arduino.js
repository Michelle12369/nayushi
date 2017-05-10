var setClient3 = require('socket.io-client');
// var five = require("johnny-five"),
//   fsr;

var client3 = setClient3.connect('http://localhost:3002/');
var express = require('express'),
  io = require('socket.io'),
  http = require('http');

// express define
var app = express();
var router = express.Router();
var server = http.createServer(app);

//express settings
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//routes settings
router.get('/', function (req, res, next) {
  res.render('index');
});
app.use('/', router);

// socket
var listener = io.listen(server);

client3.on('connect', function () {
  console.log("socket3 connected");
  client3.emit('room', {
    room: 'computer3'
  });
});

listener.sockets.on('connection', function (socket) {
  socket.on('keyUp', function (data) {
    console.log(data);
    if(data.keyUp==="up"){
      client3.emit('forCom3', { 
       sense: 1
      });
    }
  });
  socket.on('keydown', function (data) {
    if(data.keyDown==="down"){
      client3.emit('finishedGraffiti', { 
       finishedGraffiti: true
      });
    }
  });
});

server.listen(3003);

// (new five.Board()).on("ready", function () {

//   // Create a new `fsr` hardware instance.
//   fsr = new five.Sensor({
//     pin: "A0",
//     freq: 25
//   });

//   // Scale the sensor's value to the LED's brightness range
//   fsr.scale([0, 255]).on("data", function () {
//     setTimeout(senddata, 3000, this);
//   });
// });

// function senddata(data) {
//   console.log(data.scaled);
//   if (data.scaled <= 150) {
//     socket.emit('forCom3', { 
//       sense: 1
//     });
//   }
// }