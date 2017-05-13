// require
var setClient5 = require('socket.io-client');
var client5 = setClient5.connect('http://192.168.1.87:3002');
// var express = require('express'),
//     io = require('socket.io'),
//     http = require('http'),
var Kinect2 = require('kinect2');;

// express define
// var app = express();
// var router = express.Router();
// var server = http.createServer(app);

// //express settings
// app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// //routes settings
// router.get('/', function(req, res, next) {
//     res.render('index');
// });

// app.use('/', router);

var kinect = new Kinect2();
if(kinect.open()) {
    console.log("Kinect opened!");
}

// socket
// var listener = io.listen(server);

// send message to computer4/views/index.html
// client4.on('connect', function() {
//     console.log("socket5 connected");
//     client4.emit('room', { room: 'computer5' });
// });
client5.on('connect', function() {
	console.log("socket5 connected");
    client5.emit('room', { room: 'computer5' });
}
kinect.on('bodyFrame', function(bodyFrame){
	client5.emit('kinect',bodyFrame);
});
// listener.sockets.on('connection', function(socket) {
// 	kinect.on('bodyFrame', function(bodyFrame){
// 	    socket.emit('bodyFrame', bodyFrame);
// 	});

// 	kinect.openBodyReader();
// });

// server.listen(3005);
