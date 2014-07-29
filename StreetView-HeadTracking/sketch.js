///HEAD TRACKING
var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var canvasOverlay = document.getElementById('overlay')
var debugOverlay = document.getElementById('debug');
var overlayContext = canvasOverlay.getContext('2d');
canvasOverlay.style.position = "absolute";
canvasOverlay.style.top = '1000px';
canvasOverlay.style.left = '1600px';
canvasOverlay.style.zIndex = '0';
canvasOverlay.style.display = 'block';

var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}, calcAngles : true, ui : false, headPosition : false});
			htracker.init(videoInput, canvasInput);
			htracker.start();

///STREETVIEW LOCATIONS

var json = {"locations": [
		{"lat": "21.275807", "lng": "-157.826042", "heading": 270, "pitch": -5, "zoom": .5}   ,		//honolulu
        // {"lat": "50.9273", "lng": "-1.6546", "heading": 180, "pitch": -5, "zoom": .5} ,           //british countryside
        // {"lat": "40.60763", "lng": "140.45995", "heading": 100, "pitch": -5, "zoom": .5} ,        //cherry blossoms
        {"lat": "26.625983", "lng": "-111.814436", "heading": 60, "pitch": -5, "zoom": .5} ,       //mexican seaside
        // {"lat": "36.2529989", "lng": "136.9005", "heading": 90, "pitch": -5, "zoom": .5} ,        //japanese countryside
        // {"lat": "40.742327", "lng": "-73.989007", "heading": 200, "pitch": -5, "zoom": .5} ,      //flatiron
        {"lat": "35.659543", "lng": "139.700691", "heading": 270, "pitch": -5, "zoom": .5} ,      //tokyo
		// {"lat": "45.435469", "lng": "12.324016", "heading": 140, "pitch": -5, "zoom": .5} ,       //venice
		// {"lat": "51.179429", "lng": "-1.825911", "heading": 180, "pitch": -5, "zoom": .5} ,       //stonehenge
		{"lat": "36.098205", "lng": "-112.092658", "heading": 0, "pitch": -5, "zoom": .5}     //grand canyon
    ]
};

//MATH FUNCTIONS

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertToRange(value, srcRange, dstRange){
  // value is outside source range return
  if (value < srcRange[0] || value > srcRange[1]){
    return NaN; 
  }

  var srcMax = srcRange[1] - srcRange[0],
      dstMax = dstRange[1] - dstRange[0],
      adjValue = value - srcRange[0];

  return (adjValue * dstMax / srcMax) + dstRange[0];
}

var prevIndex;

//STREETVIEW INITIALIZE

function initialize() {
	while (index == prevIndex){
		var index = getRandomInt(0,json.locations.length-1);
	}
	prevIndex = index;
	var mLoc = json.locations[index];
	prevLoc = mLoc;

	var location = new google.maps.LatLng(mLoc.lat, mLoc.lng);
	var panoramaOptions = {
		position: location,
		pov: {
		  heading : mLoc.heading,
		  pitch : mLoc.pitch,
		  zoom : mLoc.zoom
		},
		disableDefaultUI: true
	};
	var panorama = new google.maps.StreetViewPanorama(document.getElementById('panorama_img'), panoramaOptions);
	var curHead = mLoc.heading;
	var curPitch = mLoc.pitch;

	//WEBSOCKET SETUP 
	var ws = new WebSocket('ws://localhost:8000');

	ws.onopen = function(){
	};

	ws.onmessage = function(msg){
		var c = msg.data;
		if (msg.data == 0){
			while (index == prevIndex){
				index = getRandomInt(0,json.locations.length-1);
			}
			prevIndex = index;
			var mLoc = json.locations[index];
			var location = new google.maps.LatLng(mLoc.lat, mLoc.lng);
			panorama.setPosition(location);
			panorama.setPov({
				heading: mLoc.heading,
				pitch: mLoc.pitch
			});
		};
	};

	//ADD FACETRACKING EVENT TO PAN STREETVIEW
	document.addEventListener("facetrackingEvent", function( event ) {
		if (event.detection == "CS") {
			overlayContext.clearRect(0,0,320,240);
			overlayContext.translate(event.x, event.y)
			overlayContext.rotate(event.angle-(Math.PI/2));
			overlayContext.strokeStyle = "#00CC00";
			overlayContext.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
			overlayContext.rotate((Math.PI/2)-event.angle);
			overlayContext.translate(-event.x, -event.y);
			if (event.x>20 && event.x<300){
				xVel = convertToRange(event.x,[20,300],[-20,20]);
				yVel = convertToRange(event.y,[50,250],[-20,20]);
				console.log(event.y);
				var newHead = curHead + xVel;
				var newPitch = curPitch + yVel;
				panorama.setPov({
					heading: newHead,
					pitch: curPitch                //change curPitch to newPitch if you want to change Y axis rotation 
					});
			}
		}
	});
	

}

google.maps.event.addDomListener(window, 'load', initialize);


//PROJECTION SETUP

var container = $("#container");
var img = $(".img");
var pts = $(".pt");
var IMG_WIDTH = 1920;
var IMG_HEIGHT = 1080;


var transform = new PerspectiveTransform(img[0], IMG_WIDTH, IMG_HEIGHT, true);
var tl = pts.filter(".tl").css({
	left : transform.topLeft.x,
	top : transform.topLeft.y
});
var tr = pts.filter(".tr").css({
	left : transform.topRight.x,
	top : transform.topRight.y
});
var bl = pts.filter(".bl").css({
	left : transform.bottomLeft.x,
	top : transform.bottomLeft.y
});
var br = pts.filter(".br").css({
	left : transform.bottomRight.x,
	top : transform.bottomRight.y
});
var target;
var targetPoint;

function onMouseMove(e) {
      targetPoint.x = e.pageX - container.offset().left - 20;
      targetPoint.y = e.pageY - container.offset().top - 20;
      target.css({
        left : targetPoint.x,
        top : targetPoint.y
});

// check the polygon error, if it's 0, which mean there is no error
if(transform.checkError()==0){
  transform.update();
  img.show();
}else{
  img.hide();
}
}

pts.mousedown(function(e) {
    target = $(this);
    targetPoint = target.hasClass("tl") ? transform.topLeft : target.hasClass("tr") ? transform.topRight : target.hasClass("bl") ? transform.bottomLeft : transform.bottomRight;
    onMouseMove.apply(this, Array.prototype.slice.call(arguments));
    $(window).mousemove(onMouseMove);
    $(window).mouseup(function() {
      $(window).unbind('mousemove', onMouseMove);
    })
});
