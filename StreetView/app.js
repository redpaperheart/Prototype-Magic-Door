//NODE SERVER SETUP
var express = require('express');
var http = require('http');
var app = express();

//SETUP ROUTES
app.get('/',function(req,res){
	res.sendfile('./index.html');
});

app.get('/sketch.js',function(req,res){
	res.sendfile('./sketch.js');
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

//SETUP SERIAL PORT
var serialport = require('serialport');
var myPortName = '/dev/tty.usbmodem1441';   //change to your Arduinos serial port

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
