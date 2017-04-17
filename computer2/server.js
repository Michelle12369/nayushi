var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function (request, response) {
    //for browser
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/index.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(3002);
var listener = io.listen(server);
var clients = [];
listener.sockets.on('connection', function (socket) {
    // example
    console.log("connection "+socket.id);
    clients.push(socket);
   
    socket.emit('message', { //send message to client
        'message': 'Hello client, I am client.'
    }); 
    socket.on('news', function (data) { //get news from client
        console.log(data.hello);
        console.log(data.distance);
    });

    //real code: computer3
    
    var com3_status=false;
    socket.on('forCom3', function (data) { //get news from client
        // if(data.sense==1){
            console.log(data.sense);
            clients[clients.length-1].emit('playVideo3',{
                'playVideo3':1
            })
            // com3_status=true;
        // }

    });
});
