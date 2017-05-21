// require
var five = require("johnny-five");
var setClient1 = require('socket.io-client');

// 記得要改ip位址
var client1 = setClient1.connect('http://192.168.1.171:3002');
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

/*********************************************************/
/*********************************************************/
/******************                 **********************/
/******************   距離感測器      **********************/
/******************   感應到別人時    **********************/
/******************   播放影片        *********************/
/******************   結束後         **********************/
/******************   傳送訊息給電腦二 **********************/
/******************                 **********************/
/*********************************************************/
/*********************************************************/

client1.on('connect', function() {
    console.log("socket1 connected");
    client1.emit('room',{room:'computer1'} );
});

listener.sockets.on('connection', function(socket) {

    // arduino code

    var board = new five.Board();
    var distance;
    board.on("ready", function() {
        var proximity = new five.Proximity({
            controller: "HCSR04",
            pin: 7
        });

        proximity.on("data", function() {
            // console.log("  cm  : ", this.cm);
            // console.log("  in  : ", this.in);
            distance = this.cm;
            console.log(distance);
            if(distance > 0 && distance <15){
                socket.emit('playVideo1', { //send message to client
                    'playVideo1': true
                });
            }
        });

        proximity.on("change", function() {
            // console.log("The obstruction has moved.");
        });
    });

    socket.on('video1End', function(data) {
        console.log(data.video1End);
        client1.emit('computer1Finished',{
            'computer1Finished':true
        });
        process.exit(0);
    });
    
    client1.on('control-cp1-sofa',function(data){
        console.log("sss");
        socket.emit('playVideo1', { //send message to client
            'playVideo1': true
        });
    });

});


server.listen(3001);
