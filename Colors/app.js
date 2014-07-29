
var express = require('express');
var http = require('http');
var app = express();

app.get('*',function(req,res){
	res.sendfile('./index.html');
});

var server = http.createServer( app );
server.listen(8000);

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

var serialport = require('serialport');
var myPortName = '/dev/tty.usbmodem1a1241';        //change to your arduinos serial port

var options = {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n')
};

var myPort = new serialport.SerialPort( myPortName , options);

myPort.on('open',function(){
	console.log('serial connected');
});

myPort.on('data', function(mySensorValues){
	if(mySocket){
		mySocket.send(mySensorValues);
	}
});