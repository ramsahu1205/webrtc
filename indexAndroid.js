var WebSocketServer = require('websocket').server;
var http = require('http');

var clients = [ ];
var offer;

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(3336, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
var con={}
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;
  console.log('Index: ' + index)
  connection.on('message', function(message) {
    var data=JSON.parse(message)
    if(data.type=="candidate"){
      console.log(message);
      con[data["userId"]]=data;
    }
  
  });

  connection.on('close', function(connection) {
    console.log('Close: ' + connection)
     clients = [ ]
  });
});