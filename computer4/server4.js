// require
var five = require("johnny-five");
var setClient4 = require('socket.io-client');

// 記得要改ip位址
var client4 = setClient4.connect('http://localhost:3002');
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


var weight = 0;
var move = true;
var medReady = false;
var musicReady = false;
var phone = 10000;
var phoneReady = false;

// send message to computer4/views/index.html
client4.on('connect', function() {
    console.log("socket4 connected");
    client4.emit('room', { room: 'computer4' });
});

listener.sockets.on('connection', function(socket) {


    // 一片板子的用法
    // var board = new five.Board();
    // board.on("ready", function() {
    // });
    
    var ports = [
        { id: "A", port: "/dev/cu.usbmodem1411" },
        { id: "B", port: "/dev/cu.usbmodem1421" }
    ];
    var board2 = new five.Boards(ports);
    board2.on("ready", function() {
        console.log(this[0].port);
        console.log(this[1].port);
        var medicine = this[0];
        var telephone = this[1];

        // http://johnny-five.io/examples/servo/
        // 馬達旋轉
        var servo = new five.Servo({ pin: 10, board: medicine });
        // this.repl.inject({
        //     servo: servo
        // });
        servo.sweep();

        // 壓力感測器感測
        var sensor = new five.Sensor({ pin: "A0", board: medicine });
        
        client4.on('control-cp4-medicine',function(data){
            servo.stop();
        });
        // 壓力感測器改變時，會觸發此函式
        sensor.on("change", function(value) {
            // console.log(value);
            if (value < 30) {
                move = false;
                
                setTimeout(function(){ 

                }, 2000);

                servo.stop();
                // 告知網頁，把照著藥罐的圈圈關掉
                if (!medReady) {
                    socket.emit('medicineCircle', { //send message to client
                        'medicineCircle': true
                    });
                    medReady = true;
                }
            } else if (value >= 30) {
                // servo.sweep();
                weight = value;
            }
        });
        // 第二塊板子 電話
        var proximity = new five.Proximity({
            controller: "HCSR04",
            pin: 7,
            board: telephone
        });
        var phone_sensor = new five.Sensor({ pin: "A0", board: telephone });
        phone_sensor.scale([0,255]).on("data", function() {
            phone = this.scaled;

        });
        proximity.on("data", function() {
            distance = this.cm;
            console.log(distance);
        });
        setInterval(function() {
            if (distance < 30 && !musicReady) {
                socket.emit('playMusic', { //send message to client
                    'playMusic': true
                });
                musicReady = true;
            }
            if (phone < 40 && !phoneReady) {
                socket.emit('playTalk', {
                    'playTalk': true
                });
                phoneReady = true;
            }
        }, 1000);
    })

    var ok = false;
    var talkReady = false;
    socket.on('talkEnd', function(data) {
        console.log("talk done");
        talkReady = true;
    });
    setInterval(function() {
        if (talkReady && medReady && !ok) {
            client4.emit('computer4Finished', {
                'computer4Finished': true
            });
            ok = true;
            // server.close();
            process.exit(0);
        }
    }, 1000);


    // control part
    client4.on('control-cp4-medicine',function(data){
        socket.emit('medicineCircle', { //send message to client
            'medicineCircle': true
        });
    });
    client4.on('control-cp4-ring',function(data){
        socket.emit('playMusic', { //send message to client
            'playMusic': true
        });
    });
    client4.on('control-cp4-talk',function(data){
        socket.emit('playTalk', { //send message to client
            'playTalk': true
        });
    });


});

server.listen(3004);
