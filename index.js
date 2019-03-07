const express = require('express')
var app=express();
const path = require('path')
var http =require('http');
var server=http.createServer(app);
var io=require('socket.io')(server);
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, '/')))
app.get("/",function(req,res){
  res.render('index.html')
})
server.listen(PORT);
var users = {};
io.on("connection",function(socket){
  
 // console.log(socket);
  socket.on("candidate",function(candidate){
    console.log("candidate")
     socket.broadcast.emit("remotecandidate",candidate);
  })
  socket.on("sendOffer",function(offer){
    //console.log("offer");
    socket.broadcast.emit("reciveOffer",offer);
  })
  socket.on("sendAnswer",function(answer){
   // console.log("answere");
    socket.broadcast.emit("reciveAnswer",answer);
  })
	
});
// express()
//   .use(express.static(path.join(__dirname, '/')))
//   .get('/', (req, res) => res.render('index.html'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))



