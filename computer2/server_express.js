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
router.get('/test.html', function (req, res, next) {
    res.render('test');
});
router.get('/gra.html', function (req, res, next) {
    res.render('gra');
});

app.use('/', router);

// socket
var listener = io.listen(server);


var clientStatus = [];
var graffitiReady = false;
var graffitiPen = false;
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

    //test whether computer 1 and 4 are completed
    var penIsTook = false;
    socket.in("localclient").on('startpen', function (data) {
        if (data.startpen == true) {
            penIsTook = true;
        }
    });

    setInterval(function () {
        // if (penIsTook && (!graffitiPen)) { //&&clientStatus.includes("computer1 finished")&&clientStatus.includes("computer4 finished")
        //     socket.in("web").emit('pen', {
        //         'pen': true
        //     });
        //     graffitiPen = true;
        // }
    }, 1000);

    //get computer3 makey makey
    // var com3_status = false;
    // socket.in("computer3").on('forCom3', function (data) {
    //     if (!com3_status) {
    //         // console.log(data.sense);
    //         socket.in("web").emit('playVideo3', {
    //             'playVideo3': 1
    //         });
    //         com3_status = true;
    //     }
    // });
    socket.in("localclient").on('shortcut',function(data){
        console.log('got it');
        socket.in("web").emit('playVideo3', {
            'playVideo3': 1
        });
    });

    var graIsfinished=false;
    socket.in("computer3").on('finishedGraffiti', function (data) {
        if (!graIsfinished) {
            // console.log(data.sense);
            socket.in("web").emit('stopGra', {
                'stopGra': true
            });
            graIsfinished = true;
        }
    });


    //check whether other computer has finished

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