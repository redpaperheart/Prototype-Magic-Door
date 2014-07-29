//NODE SERVER SETUP 

var express = require('express');
var http = require('http');
var app = express();

//SETUP ROUTES
app.get('/',function(req,res){
	res.sendfile('./index.html');
});

app.get('/css/drag_points.css',function(req,res){
	res.sendfile('./css/drag_points.css');
});

app.get('/css/reset.css',function(req,res){
	res.sendfile('./css/reset.css');
});

app.get('/sketch.js',function(req,res){
	res.sendfile('./sketch.js');
});

app.get('/js/headtrackr.js',function(req,res){
	res.sendfile('./js/headtrackr.js');
});

app.get('/dist/PerspectiveTransform.min.js',function(req,res){
	res.sendfile('./dist/PerspectiveTransform.min.js');
});


var server = http.createServer( app );
server.listen(8000);

//SETUP WEBSOCKETS
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({'server':server});

var mySocket = undefined;

wss.on('connection', function(ws){
	
	ws.on('message',function(msg){
		myPort.write(msg);
	});

	ws.on('close',function(){
		mySocket = undefined;
	});

	mySocket = ws;
} );

//SETUP SERIAL PORTS
var serialport = require('serialport');
var myPortName = '/dev/tty.usbmodem1441';    //change to your Arduino Port

var options = {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n')
};

var myPort = new serialport.SerialPort( myPortName , options);

myPort.on('open',function(){
	console.log('socket open');
});

myPort.on('data', function(mySensorValues){
	if(mySocket){
		mySocket.send(mySensorValues);
	}
});
