'use strict'
// require
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
var clientStatus = [];
listener.sockets.on('connection', function (socket) {
    // example
    // socket.emit('message', { //send message to client
    //     'message': 'Hello client, I am client.'
    // });
    // socket.on('news', function (data) { //get news from client
    //     console.log(data.hello);
    // });
    socket.on('room', function (data) {
        socket.join(data.room);
        console.log(`${data.room} has joined the room`);
    })

    //real code: computer3
    var com3_status = false;
    socket.in("localclient").on('forCom3', function (data) {
        if (!com3_status) {
            // console.log(data.sense);
            socket.in("web").emit('playVideo3', {
                'playVideo3': 1
            })
            com3_status = true;
        }
    });

    //check whether other computer has finished
    socket.in("web").on('computer3Finished', function (data) {
        console.log(`com3:${data.computer3Finished}`);
        if (data.computer3Finished == true) {
            clientStatus.push("computer3 finished");
        }
    });
    socket.in('computer1').on('computer1Finished', function (data) {
        console.log(`com1:${data.computer1Finished}`);
        if (data.computer1Finished == true) {
            clientStatus.push("computer1 finished");
        }
    });
    socket.in('computer4').on('computer4Finished', function (data) {
        console.log(`com4:${data.computer4Finished}`);
        if (data.computer4Finished == true) {
            clientStatus.push("computer4 finished");
        }
    });

});

server.listen(3002);