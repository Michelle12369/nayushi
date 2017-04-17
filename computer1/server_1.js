// require
var five = require("johnny-five");
var setClient1 = require('socket.io-client');
var client1 = setClient1.connect('http://172.20.10.3:3002');
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
    // arduino code

    // var board = new five.Board();
    // var distance;
    // board.on("ready", function() {
    //     var proximity = new five.Proximity({
    //         controller: "HCSR04",
    //         pin: 7
    //     });

    //     proximity.on("data", function() {
    //         // console.log("  cm  : ", this.cm);
    //         // console.log("  in  : ", this.in);
    //         distance = this.cm;

    //     });
    //     setInterval(function() {
    //         console.log(distance)
    //     }, 1000);

    //     proximity.on("change", function() {
    //         // console.log("The obstruction has moved.");
    //     });
    // });

    // send message to index.html
    client1.on('connect', function() {
        console.log("socket1 connected");
        client1.emit('room',{room:'computer1'} );
    });

    socket.emit('playVideo1', { //send message to client
        'playVideo1': true
    });

    socket.on('video1End', function(data) {
        console.log(data.video1End);
        client1.emit('computer1Finished',{
            'computer1Finished':true
        });
    });

});

server.listen(3001);