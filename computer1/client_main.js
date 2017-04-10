var io = require('socket.io-client');
var socket = io.connect('http://localhost:3002');
var five = require("johnny-five");


// ---------------- Proximity - HC-SR04 ----------------//
var board = new five.Board();
var distance;
board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });
  proximity.on("data", function() {
    distance = this.cm;
  });
  setInterval(function(){
  	// console.log(distance)
  },1000);

  proximity.on("change", function() {
    // console.log("The obstruction has moved.");
  });
});


// ---------------- Client  ----------------//

socket.on('connect', function() {
    console.log("socket connected");
});

setInterval(function(){
    socket.emit('news', { //send news to server
        hello: 'Hello server.I am client',
        distance: distance
    });
},1000);

socket.on('message', function(data) { //get message from server
    console.log(data.message);
});

