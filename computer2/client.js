var io = require('socket.io-client');
var socket = io.connect('http://localhost:3002');

socket.on('connect', function () {
    console.log("socket connected");
    socket.emit('room',{room:'localclient'} );
    // socket.emit('shortcut',{
	// 	shortcut:true
	// });
});

// socket.emit('forCom3', {//send news to server
//     sense: 1
// });

socket.emit('startpen', {//send news to server
    startpen:true
});

