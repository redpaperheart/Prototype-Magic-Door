function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }

//STREETVIEW SETUP
function initialize() {
	var json = {"locations": [
	        {"lat": "50.9273", "lng": "-1.6546", "heading": 180, "pitch": 5, "zoom": .5} ,
	        {"lat": "40.60763", "lng": "140.45995", "heading": 100, "pitch": 5, "zoom": .5} ,
	        {"lat": "26.625983", "lng": "-111.814436", "heading":60, "pitch": 5, "zoom": .5} ,
	        {"lat": "36.2529989", "lng": "136.9005", "heading": 90, "pitch": 5, "zoom": .5} ,
	        {"lat": "40.742327", "lng": "-73.989007", "heading": 200, "pitch": 5, "zoom": .5} ,
	        {"lat": "35.659543", "lng": "139.700691", "heading": 270, "pitch": 5, "zoom": .5} ,
		    {"lat": "45.435469", "lng": "12.324016", "heading": 140, "pitch": 5, "zoom": .5} ,
		    {"lat": "51.179429", "lng": "-1.825911", "heading": 180, "pitch": 5, "zoom": .5} 
	 ]
	};

	var mLoc = json.locations[getRandomInt(0,json.locations.length-1)];
	var location = new google.maps.LatLng(mLoc.lat, mLoc.lng);
	var mapOptions = {
		center: location,
		zoom: 14,
		disableDefaultUI: true
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var panoramaOptions = {
		position: location,
		pov: {
			heading : mLoc.heading,
			pitch : mLoc.pitch,
			zoom : mLoc.zoom
		},
		disableDefaultUI: true
	};
	var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
	map.setStreetView(panorama);

}

google.maps.event.addDomListener(window, 'load', initialize);

// SETUP WEBSOCKET
var ws = new WebSocket('ws://localhost:8000');

ws.onopen = function(){
	console.log('ws connection open');
};

ws.onmessage = function(msg){
	var c = msg.data;
	console.log(c);
	if (msg.data == 0){
		initialize();  
	};
};