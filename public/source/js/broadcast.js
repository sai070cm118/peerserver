// When the DOM is ready
var peer_id;
var username;
var conn;
var peer;
var portNo = 9000;
var isBroadCaster = true;

document.addEventListener("DOMContentLoaded", function(event) {
    
	$('#connect').click(function(){
		peerConnection($('#peerid').val());
	});

	
	$('#isBroadCaster').click(function(){
		isBroadCaster = $(this).val() ;
	});
	
    function peerConnection(peerId){
		
		peer = new Peer(peerId,{
			secure: true, 
			host: "kingsonspeer.herokuapp.com",
			port: 443,
			path: '/mypeer'
		});

		peer.on('open', function () {
			console.log(peer.id);
			
			document.getElementById("peer-id-label").innerHTML = peer.id;
			
			if(isBroadCaster){
				requestLocalVideo({
					success: function(stream){
						window.localStream = stream;
						onReceiveStream(stream, 'broadCastcamera');
					},
					error: function(err){
						console.log("Cannot get access to your camera and video !");
						console.error(err);
					}
				});
			}
		});

		peer.on('connection', function (connection) {
			
			peer_id = connection.peer;
			
			document.getElementById("connected_peer").innerHTML = connection.metadata.username;
			
			
			peer.call(peer_id, window.localStream);
			
		});

		peer.on('error', function(err){
			console.log("An error ocurred with peer: " + err);
			console.error(err);
		});

		peer.on('call', function (call) {
			
			// Answer the call with your own video/audio stream
			call.answer(window.localStream);

			// Receive data
			call.on('stream', function (stream) {
				// Store a global reference of the other user stream
				window.broadCastcamera = stream;
				// Display the stream of the other user in the peer-camera video element !
				onReceiveStream(stream, 'broadCastcamera');
			});

			// Handle when the call finishes
			call.on('close', function(){
				console.log("The videocall has finished");
			});

			// use call.close() to finish a call
			
		});
	
	}


    function onReceiveStream(stream, element_id) {
        // Retrieve the video element according to the desired
        var video = document.getElementById(element_id);
        // Set the given stream as the video source
		
		console.log(window);
		console.log(window.URL);
		
        video.srcObject  =stream;video.play();

        // Store a global reference of the stream
        window.broadCastcamera = stream;
    }


    document.getElementById("connect-to-peer-btn").addEventListener("click", function(){
        peer_id = document.getElementById("peer_id").value;
        connect(peer_id);
    }, false);


	function connect(peer_id){
		
		username = document.getElementById("name").value;

        if (peer_id) {
            peer.connect(peer_id, {
                metadata: {
                    'username': username
                }
            });
        }else{
            console.log("You need to provide a peer to connect with !");
            return false;
        }
	
	}

	//Broadcast
	
    function requestLocalVideo(callbacks) {
        // Monkeypatch for crossbrowser geusermedia
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Request audio an video
        navigator.getUserMedia({ audio: true, video: true }, callbacks.success , callbacks.error);
    }
	
	
	
}, false);
