int sensorPin = 2;
int ledPin = 13;
boolean state = false;
void setup() {
  Serial.begin(9600);
  pinMode(sensorPin,LOW);
}

void loop() {
 if (digitalRead(sensorPin) != state){ 
   Serial.println( digitalRead(sensorPin));
   state = digitalRead(sensorPin);
 }
  
delay(30);
}
