var io = require('socket.io-client');
var socket = io.connect('http://localhost:3002');

socket.on('connect', function () {
    console.log("socket connected");
    socket.emit('room',{room:'localclient'} );
});

socket.emit('news', { //send news to server
    hello: 'Hello server.I am client'
});

socket.on('message', function(data) { //get message from server
    console.log(data.message);
});

socket.emit('forCom3', {//send news to server
    sense: 1
});
