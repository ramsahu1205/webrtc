var callBtn = document.querySelector('#callBtn');
var hangUpBtn = document.querySelector('#hangUpBtn');
var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');

var yourConn;
var stream;
var senderNane;
var reciverName;
function initConnection() {
    senderNane = prompt("Please enter your name", "");
     if(senderNane==null){
        alert("You are not able to call");
        return;
     }
     reciverName = prompt("Please enter your partner name", "");
     if(reciverName==null){
        alert("You are not able to call");
        return;
     }
     sendData({"type":"init","userId":senderNane},"s");
   // ws.send(JSON.stringify({"type":"init","userId":senderNane}))
    var configuration = {
        'iceServers':
            [
                { url: 'stun:stun.1.google.com:19302' },
                { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' },
                { url: 'stun:stun01.sipphone.com' },

                { url: 'stun:stun.ekiga.net' },

                { url: 'stun:stun.fwdnet.net' },

                { url: 'stun:stun.ideasip.com' },

                { url: 'stun:stun.iptel.org' },

                { url: 'stun:stun.rixtelecom.se' },

                { url: 'stun:stun.schlund.de' },

                { url: 'stun:stun.l.google.com:19302' },

                { url: 'stun:stun1.l.google.com:19302' },

                { url: 'stun:stun2.l.google.com:19302' },

                { url: 'stun:stun3.l.google.com:19302' },

                { url: 'stun:stun4.l.google.com:19302' },

                { url: 'stun:stunserver.org' },

                { url: 'stun:stun.softjoys.com' },

                { url: 'stun:stun.voiparound.com' },

                { url: 'stun:stun.voipbuster.com' },

                { url: 'stun:stun.voipstunt.com' },

                { url: 'stun:stun.voxgratia.org' },

                { url: 'stun:stun.xten.com' },

                {

                    url: 'turn:numb.viagenie.ca',

                    credential: 'muazkh',

                    username: 'webrtc@live.com'

                },

                {

                    url: 'turn:192.158.29.39:3478?transport=udp',

                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',

                    username: '28224511:1379330808'

                },

                {

                    url: 'turn:192.158.29.39:3478?transport=tcp',

                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',

                    username: '28224511:1379330808'

                }
            ]
    };
    yourConn = new webkitRTCPeerConnection(configuration);

    navigator.webkitGetUserMedia({ video: true, audio: true }, function (myStream) {
        stream = myStream;
        localVideo.srcObject = stream;
        yourConn.addStream(stream);
        yourConn.onaddstream = function (e) {
            // remoteVideo.src = window.URL.createObjectURL(e.stream); 
            remoteVideo.srcObject = e.stream;
        };
        yourConn.onicecandidate = function (event) {
            if (event.candidate) {
                var obj={"type":"candidate","label":event.candidate.sdpMLineIndex,"id":event.candidate.sdpMid,"candidate":event.candidate.candidate}
                sendData(obj);
               // socket.emit("candidate", event.candidate);
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

// socket.on("remotecandidate", function (candidate) {
//     yourConn.addIceCandidate(new RTCIceCandidate(candidate));
// })

callBtn.addEventListener("click", function () {
    yourConn.createOffer(function (offer) {
       // socket.emit("sendOffer", offer);
       var obj={"type":"OFFER","sdp":offer.sdp}
       sendData(obj);
        yourConn.setLocalDescription(offer);
    }, function (error) {
        alert("Error when creating an offer");
    });
});

function reciveOffer(offer) {
    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    yourConn.createAnswer(function (answer) {
        yourConn.setLocalDescription(answer);

        //    send({ 
        //       type: "answer", 
        //       answer: answer 
        //    }); 
        //socket.emit("sendAnswer", answer)
        var obj={"type":"ANSWER","sdp":answer.sdp};
        sendData(obj);

    }, function (error) {
        alert("Error when creating an answer");
    });
}

function reciveAnswer(answer) {
    yourConn.setRemoteDescription(new RTCSessionDescription(answer));
}

 var ws=new WebSocket("ws://103.127.146.116:3336/");

 ws.onopen=(e)=>{
    initConnection()
    console.log("connection open")
 }

 ws.onclose=(e)=>{
    console.log("connection close")

 }
 ws.onerror=(e)=>{
    console.log("connection error")

 }

 ws.onmessage=(e)=>{
     var data=JSON.parse(e.data)
     if(data.type==="candidate"){
        yourConn.addIceCandidate(new RTCIceCandidate({"candidate":data.candidate,"sdpMid":data.id,"sdpMLineIndex":data.label}));
     }
     else if(data.type==="OFFER"){
         reciveOffer({"type":"offer","sdp":data.sdp})
     }
     else if(data.type==="ANSWER"){
        reciveAnswer({"type":"offer","sdp":data.sdp})
     }

 }

function sendData(obj,type="r"){

    obj["userId"]=(type=="s")?senderNane:reciverName;
    ws.send(JSON.stringify(obj));
}

