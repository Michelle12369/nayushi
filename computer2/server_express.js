// require
var express = require('express')
  , io = require('socket.io')
  , http = require('http');

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
router.get('/',function(req,res,next){
	res.render('index');
});

app.use('/', router);

// socket
var listener = io.listen(server);
var clients = [];
listener.sockets.on('connection', function (socket) {
    // example
    console.log("connection "+socket.request.connection.remoteAddress);
    clients.push(socket);
   
    socket.emit('message', { //send message to client
        'message': 'Hello client, I am client.'
    }); 
    socket.on('news', function (data) { //get news from client
        console.log(data.hello);
    });
    socket.on('room',function(data){
        socket.join(data.room);
        console.log(data.room);
    })

    //real code: computer3
    var com3_status=false;
    var com3_finished=false;
    socket.in("localclient").on('forCom3', function (data) { 
        if(!com3_status){
            console.log(data.sense);
            socket.in("web").emit('playVideo3',{
                'playVideo3':1
            })
            // clients[clients.length-1].emit('playVideo3',{
            //     'playVideo3':1
            // })
            com3_status=true;
        }
    });
    socket.in("web").on('computer3_end',function(data){
        if(data.computer3_end==true){
            com3_finished=true;
        }
    });
});

server.listen(3002);