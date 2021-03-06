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
router.get('/control.html', function (req, res, next) {
    res.render('control');
});
router.get('/kinect2.html',function (req, res, next) {
    res.render('kinect2');
});

app.use('/', router);
// app.use('/control.html', router);

// socket
var listener = io.listen(server);


var clientStatus = [];
var graffitiReady = false;
var graffitiPen = false;
listener.sockets.on('connection', function (socket) {

    socket.on('room', function (data) {
        socket.join(data.room);
        console.log(`${data.room} has joined the room`);
    })
    
    //kinect
    socket.in("computer3").on('bodyFrame', function (bodyFrame) {
        // console.log(bodyFrame);
        socket.in("web").emit('kinect',bodyFrame);
    }); 

    socket.in("computer5").on('bodyFrame', function (bodyFrame) {
        // console.log(bodyFrame);
        socket.in("kinectweb").emit('kinect',bodyFrame);
    }); 

    //test whether computer 1 and 4 are completed
    var penIsTook = false;
    socket.in("localclient").on('startpen', function (data) {
        if (data.startpen == true) {
            penIsTook = true;
        }
    });

    setInterval(function () {
        if ((clientStatus.includes("computer1 finished")&&clientStatus.includes("computer4 finished")||penIsTook) && (!graffitiPen)) { //&&clientStatus.includes("computer1 finished")&&clientStatus.includes("computer4 finished") penIsTook
            socket.in("web").emit('pen', {
                'pen': true
            });
            graffitiPen = true;
        }
    }, 1000);

    //get computer3 makey makey
    var com3_status = false;
    socket.in("computer3").on('forCom3', function (data) {
        if (!com3_status) {
            console.log("get makey:"+data.sense);
            socket.in("web").emit('playVideo3', {
                'playVideo3': 1
            });
            com3_status = true;
        }
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
    var controlpart = [
        {
            machine:'control-cp1-sofa'
        },{
            machine:'control-cp4-medicine'
        },{
            machine:'control-cp4-ring'
        },{
            machine:'control-cp4-talk'
        },{
            machine:'cp2-get-pen'
        },{
            machine:'cp2-start-video'
        },{
            machine:'cp2-stop-gra'
        }
    ]
    // Control all the machine
    socket.in('control').on(controlpart[0].machine,function(data){
        var x = controlpart[0].machine;
        socket.in('computer1').emit(controlpart[0].machine, {
            x : true
        });
    });
    socket.in('control').on(controlpart[1].machine,function(data){
        var x = controlpart[1].machine;
        socket.in('computer4').emit(controlpart[1].machine, {
            x : true
        });
    });
    socket.in('control').on(controlpart[2].machine,function(data){
        var x = controlpart[2].machine;
        socket.in('computer4').emit(controlpart[2].machine, {
            x : true
        });
    });
    socket.in('control').on(controlpart[3].machine,function(data){
        var x = controlpart[3].machine;
        socket.in('computer4').emit(controlpart[3].machine, {
            x : true
        });
    });
    socket.in('control').on(controlpart[4].machine,function(data){
        var x = controlpart[4].machine;
        socket.in("web").emit('pen', {
            'pen': true
        });
    });
    socket.in('control').on(controlpart[5].machine,function(data){
        var x = controlpart[5].machine;
        socket.in('computer3').emit('startKinect',{startKinect:true});
        // socket.in("web").emit('playVideo3', {
        //     'playVideo3': 1
        // });
    });
    socket.in('control').on(controlpart[6].machine,function(data){
        var x = controlpart[6].machine;
        socket.in('computer3').emit('stopKinect',{stopKinect:true});
        // socket.in("web").emit('stopGra', {
        //     'stopGra': true
        // });
    });
});

server.listen(3002);