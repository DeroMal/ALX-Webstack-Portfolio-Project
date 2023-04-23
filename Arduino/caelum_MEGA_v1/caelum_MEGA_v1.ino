/*
   Author: Derrick Locha Mayiku
   Description: This code reads temperature, humidity and light level data from sensors and sends the data to an ESP8266 module via SoftwareSerial.
   Version: 1.0
   Last modified: 2022-04-15
*/

/*
   DISCLAIMER:
   This code is provided as is and is intended for educational purposes only. The author makes no guarantees or warranties about the accuracy, reliability, or suitability of this code for any purpose. The author is not responsible for any damage or harm caused by the use or misuse of this code.
*/

/*
   This code uses the following libraries:
   - SoftwareSerial: to communicate with the ESP8266 module via serial
   - DHT: to read temperature and humidity data from the DHT22 sensor
   - ArduinoJson: to serialize the data as a JSON object for transmission
*/

#include <SoftwareSerial.h> // Import the SoftwareSerial library for serial communication with ESP8266
#include <DHT.h> // Import the DHT library for interfacing with the DHT22 sensor
#include <ArduinoJson.h> // Import the ArduinoJson library for JSON serialization

#define DHTTYPE DHT22 // Define the type of DHT sensor being used
#define DHTPIN 4 // Define the digital pin to which the DHT22 sensor is connected
#define LDRPIN A0 // Define the analog pin to which the LDR sensor is connected

SoftwareSerial esp(10, 11); // RX, TX: create a new software serial object for communication with the ESP8266

DHT dht(DHTPIN, DHTTYPE); // Create a new instance of the DHT class

void setup() {
  Serial.begin(115200); // Initialize the serial monitor
  esp.begin(115200); // Initialize the software serial communication with the ESP8266
  dht.begin(); // Initialize the DHT sensor
  pinMode(LDRPIN, INPUT); // Set the mode of the LDR sensor pin to input
}

void loop() {
  float humidity = dht.readHumidity(); // Read the humidity value from the DHT sensor
//  delay(1000);
  float temperature = dht.readTemperature(); // Read the temperature value from the DHT sensor
//  delay(1000);
  int lightLevel = analogRead(LDRPIN); // Read the light level from the LDR sensor

  if (isnan(humidity) || isnan(temperature)) { // Check if either the humidity or temperature value is NaN
    Serial.println("Failed to read from DHT sensor!"); // Print a failure message to the serial monitor
    return; // Exit the loop
  }

  Serial.print("Humidity: "); // Print the humidity label to the serial monitor
  Serial.println(humidity); // Print the humidity value to the serial monitor
  Serial.print("Temperature: "); // Print the temperature label to the serial monitor
  Serial.println(temperature); // Print the temperature value to the serial monitor
  Serial.print("Light Level: "); // Print the light level label to the serial monitor
  Serial.println(lightLevel); // Print the light level value to the serial monitor

  // Create a new JSON object using the ArduinoJson library
  StaticJsonDocument<200> doc;
  doc["humidity"] = humidity; // Add the humidity value to the JSON object
  doc["temperature"] = temperature; // Add the temperature value to the JSON object
  doc["lightLevel"] = lightLevel; // Add the light level value to the JSON object

  String jsonString; // Create a new string to hold the serialized JSON data
  serializeJson(doc, jsonString); // Serialize the JSON data into a string using the ArduinoJson library

  esp.print(jsonString); // Send the serialized JSON data to the ESP8266 via software serial communication
  esp.print('\n'); // Send a newline character to terminate the JSON data
 
  Serial.println(jsonString); // Print the serialized JSON data to the serial monitor

  delay(500); // Delay for half a second
}
