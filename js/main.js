var player1;
var player2;

var conf = {
	key : "YOUR PLAYER KEY",
	playback : {
		autoplay : false,
		preferredTech: [{
			player: 'html5',
		    streaming: 'dash'
		  }]
	},
	style: {
		ux: false
	},
	tweaks : {
		file_protocol : true,
		app_id : "com.bitmovin.demo.webapp",
		BACKWARD_BUFFER_PURGE_INTERVAL: 10
	},
	buffer :{
		video: {
			forwardduration: 30,
			backwardduration: 10,
		},
		audio: {
			forwardduration: 30,
			backwardduration: 10
		}
	}
};

var onTimeChanged = function(event) {
	console.log("TimeChanged: " + event.time);
}

window.onload = function() {
	setupControllerEvents();
	
	bitmovin.player.core.Player.addModule(window.bitmovin.player.polyfill.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player['engine-bitmovin'].default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player['container-mp4'].default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player['container-ts'].default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.mserenderer.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.abr.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.drm.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.xml.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.dash.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.hls.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.style.default);
	bitmovin.player.core.Player.addModule(window.bitmovin.player.tizen.default);
	
	player1 = setupPlayer('player1');
	player1.play();
}


function setupPlayer(containerId) {
	var source = {
		// AVC Stream
        // dash : "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
		// HEVC Stream
		// dash : "https://bitmovin-a.akamaihd.net/content/multi-codec/hevc/stream.mpd"
	
		//Widevine Stream
		dash: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
		drm: {
			widevine: {
		        LA_URL: 'https://widevine-proxy.appspot.com/proxy'
		    }
		}
	}
	
	var container = document.getElementById(containerId);
	var playerInstance = new bitmovin.player.core.Player(container, conf);
	
	playerInstance.on('timechanged', onTimeChanged);
	
	playerInstance.load(source).then(function(value) {
		// Success
		console.log("Successfully created bitmovin player instance");
	}, function(reason) {
		// Error!
		console.log("Error while creating bitmovin player instance");
	});
	
	playerInstance.on(bitmovin.player.core.PlayerEvent.Warning, function(data){
        console.log("On Warning: "+JSON.stringify(data))
    });
	playerInstance.on(bitmovin.player.core.PlayerEvent.Error, function(data){
        console.log("On Error: "+JSON.stringify(data))
    });
		
	return playerInstance;
}

function setupControllerEvents() {
	document.addEventListener("keydown", function(inEvent){
		var keycode;
		 
		if(window.event) { 
		    keycode = inEvent.keyCode;
		} else if(e.which) { 
		    keycode = inEvent.which;
		} 
		switch(keycode) {
	      	case 13:
	          togglePlayPause();
	          break;
		    case 415: 
		    	//Play Button Pressed
		    	player1.play();
		    	break;
		    case 19: 
		    	//Pause BUtton Pressed
		    	player1.pause(); 
		    	break; 
		    case 412:
		    	//Jump Back 30 Seconds
		    	player.seek(player.getCurrentTime()-30)
		    	break;
		    case 39:
		    	player2 = setupPlayer('player2');
		    	break;
		    case 413:
		    	//Unload Player
		    	player1.unload();
		    	break;
		    default:
		    	console.log("Key Pressed: "+keycode);
		}
	});
}

function togglePlayPause() {
	if(player1.isPaused()) {
		player1.play();
	} else {
	   player1.pause();
	}
}