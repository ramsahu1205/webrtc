var WebSocketServer = require('websocket').server;
var http = require('http');

var clients = [ ];
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
    var data=JSON.parse(message["utf8Data"]);
    console.log(data);
    if(data.type=="init"){
      con[data["userId"]]=connection;
    }
    if(data.type=="OFFER"){
        var conn=con[data["userId"]];
        if(conn)
           conn.send(JSON.stringify(data));
        else userId
           connection.send(JSON.stringify({"type":"error",msg:"user not exist"}))    
          }
    if(data.type=="ANSWER"){
      var conn=con[data["userId"]];
      if(conn)
         conn.send(JSON.stringify(data));				
      else 
         connection.send(JSON.stringify({"type":"error",msg:"user not exist"}))    
        
    }
    if(data.type=="candidate"){
      var conn=con[data["userId"]];
      if(conn)
         conn.send(JSON.stringify(data));
      else 
         connection.send(JSON.stringify({"type":"error",msg:"user not exist"}))    
      }
  
  });

  connection.on('close', function(connection) {
    console.log('Close: ' + connection)
     clients = [ ]
  });
});