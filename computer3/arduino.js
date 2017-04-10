var io = require('socket.io-client');
var five = require("johnny-five"),
  fsr;

var socket = io.connect('http://localhost:3002');
(new five.Board()).on("ready", function() {

  // Create a new `fsr` hardware instance.
  fsr = new five.Sensor({
    pin: "A0",
    freq: 25
  });

  // Scale the sensor's value to the LED's brightness range
  fsr.scale([0, 255]).on("data", function() {

    console.log(this.scaled);
    if(this.scaled<=200){
        socket.emit('forCom3', {//send news to server
            sense: 1
        }); 
        
    }
  });
});