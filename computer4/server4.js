// require
var five = require("johnny-five");
var setClient4 = require('socket.io-client');
var client4 = setClient4.connect('http://172.20.10.3:3002');
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


listener.sockets.on('connection', function(socket) {
    // send message to computer4/views/index.html
    client4.on('connect', function() {
        console.log("socket4 connected");
        client4.emit('room',{room:'computer4'} );
    });


    setInterval(function(){
        socket.emit('medicineCircle', { //send message to client
            'medicineCircle': true
        });
    },4000);
    

    setInterval(function(){
        socket.emit('phoneCircle', { //send message to client
            'phoneCircle': true
        });
    },8000);

    setInterval(function(){
        // socket.on('circle4', function(data) {
            client4.emit('computer4Finished',{
                'computer4Finished':true
            });
        // });
    },4000);
});

server.listen(3004);
