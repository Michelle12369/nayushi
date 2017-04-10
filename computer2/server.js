var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function (request, response) {
    //for browser
    var path = url.parse(request.url).pathname;

    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;

        case '/socket.html':
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
listener.sockets.on('connection', function (socket) {
    socket.emit('message', { //send message to client
        'message': 'Hello client, I am client.'
    }); 
    socket.on('news', function (data) { //get news from client
        console.log(data.hello);
        console.log(data.distance);
    });
});