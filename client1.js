

var callBtn = document.querySelector('#callBtn'); 
var hangUpBtn = document.querySelector('#hangUpBtn');
var localVideo = document.querySelector('#localVideo'); 
var remoteVideo = document.querySelector('#remoteVideo');

var yourConn; 
var stream;
initConnection()
function initConnection(){

    var configuration = { 
        "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
     }; 
     yourConn = new webkitRTCPeerConnection(configuration); 
      navigator.webkitGetUserMedia({ video: true, audio: true }, function (myStream) { 
      stream = myStream; 
	  localVideo.srcObject=stream;	
      yourConn.addStream(stream); 
      yourConn.onaddstream = function (e) { 
           // remoteVideo.src = window.URL.createObjectURL(e.stream); 
           remoteVideo.srcObject=e.stream;
      };
      yourConn.onicecandidate = function (event) { 
            if (event.candidate) { 
                socket.emit("candidate",event.candidate);
            //    send({ 
            //       type: "candidate", 
            //       candidate: event.candidate 
            //    }); 
            } 
        };  
			
      }, function (error) { 
         console.log(error); 
      }); 
	
}

socket.on("remotecandidate",function(candidate){
    yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
})

callBtn.addEventListener("click", function () { 
       yourConn.createOffer(function (offer) { 
           socket.emit("sendOffer",offer);
          yourConn.setLocalDescription(offer); 
       }, function (error) { 
          alert("Error when creating an offer"); 
       });
 });

 socket.on("reciveOffer",function(offer){
    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    yourConn.createAnswer(function (answer) { 
    yourConn.setLocalDescription(answer); 
         
    //    send({ 
    //       type: "answer", 
    //       answer: answer 
    //    }); 
    socket.emit("sendAnswer",answer)
         
    }, function (error) { 
       alert("Error when creating an answer"); 
    }); 
 });

 socket.on("reciveAnswer",function(answer){
    yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
 })