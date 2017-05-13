// require
var five = require("johnny-five");
var setClient4 = require('socket.io-client');
var client4 = setClient4.connect('http://192.168.1.87:3002');
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
router.get('/', function(req, res, next) {
    res.render('index');
});

app.use('/', router);

// socket
var listener = io.listen(server);

// send message to computer4/views/index.html
client4.on('connect', function() {
    console.log("socket5 connected");
    client4.emit('room', { room: 'computer5' });
});

listener.sockets.on('connection', function(socket) {

});

server.listen(3005);
