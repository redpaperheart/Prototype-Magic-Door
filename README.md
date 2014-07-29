Prototypes - Magic Door
==========

This is sample code for our Magic Door protoype. Each example is triggered by the closing of a door read by the Arduino. 

####V1: Colors 
Node Server that swiches background color

####V2: StreetView 
Node Server that switches Google StreetView Location

####V3: StreetView-Head Tracking 

Node Server that switches Google StreetView Location.  Incorporates Head Tracking so the user can look left and right in the Street View Panorama.  This is also has a simple projection mapping library impletmented to fit the canvas to the projected surface. Requires Webcam. 

###To run:
1) Upload the Door Trigger Arduino Code to your Arduino and edit app.js file to reflect your Arduino's serial port.

2) For the the StreetView folders, add your Google Map API Key to the index.html file

3) In terminal, navigate to your folder and install 3 NodeJS modules:

	npm install express

	npm install serialport

	npm install ws

4) Enter "node app.js" in Terminal and the Node server is running

5) Go to "localhost:8000" in your browser

