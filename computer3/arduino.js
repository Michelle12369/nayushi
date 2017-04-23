var io = require('socket.io-client');
var five = require("johnny-five"),
  fsr;

var socket = io.connect('http://192.168.1.87:3002');
socket.on('connect', function () {
  console.log("socket connected");
  socket.emit('room', {
    room: 'computer3'
  });
});

(new five.Board()).on("ready", function () {

  // Create a new `fsr` hardware instance.
  fsr = new five.Sensor({
    pin: "A0",
    freq: 25
  });

  // Scale the sensor's value to the LED's brightness range
  fsr.scale([0, 255]).on("data", function () {
    setTimeout(senddata, 3000, this);
  });
});

function senddata(data) {
  console.log(data.scaled);
  if (data.scaled <= 200) {
    socket.emit('forCom3', { 
      sense: 1
    });
  }
}