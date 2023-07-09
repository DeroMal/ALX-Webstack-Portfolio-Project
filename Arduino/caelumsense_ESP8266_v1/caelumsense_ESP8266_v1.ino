/*
    Author: Derrick Locha Mayiku
    Description: This code reads sensor data from an ATmega 2560 board via SoftwareSerial and send it to a remote server using WiFi and HTTPS.
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
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <SoftwareSerial.h> // Importing the SoftwareSerial library
#include <ArduinoJson.h>    // Importing the ArduinoJson library

SoftwareSerial esp(13, 12); // Creating a new SoftwareSerial object called "esp" with RX and TX pins

float humidity = 0;        // Initializing the humidity variable
float temperature = 0;     // Initializing the temperature variable
int lightLevel = 0;        // Initializing the lightLevel variable

#ifndef STASSID
#define STASSID "JohnBV"
#define STAPSK  "derrickm"
#endif

const char* ssid = STASSID;
const char* password = STAPSK;
const char* host = "caelumsense.derrickml.com";
const int httpsPort = 443;
const char* fingerprint = "62:B1:85:58:D3:BD:12:54:D1:A1:4C:29:13:73:7B:CF:4B:F3:72:D3";

WiFiClientSecure client;

void setup() {
  Serial.begin(115200);      // Starting the serial communication with a baud rate of 115200
  esp.begin(115200);         // Starting the SoftwareSerial communication with a baud rate of 115200

  Serial.println();
  netConnect();
}

void loop() {

  sensorData();
  delay(10000); // Send data every minute

  //Delay before the next set of data is sent and received
  delay(10000); // Send data every minute
}

/*------------NETWORK CONNECTION-----------------*/
void netConnect() {

  Serial.println("Booting Sketch...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setFingerprint(fingerprint);

  delay(2000);
}

/*--------------FUNCTION TO SEND SENSOR DATA------------------------------
  Temperature
  Humidity
  Moisture
  Light
*/
void sensorData() {
  sensFetch();

  String data = "{\"temperature\":" + String(temperature) + ",";
  data += "\"humidity\":" + String(humidity) + ",";
  data += "\"light\":" + String(lightLevel) + "}";

  Serial.println("Sending Sensor data to server...");
  if (client.connect(host, httpsPort)) {
    client.println("POST /sensor-data HTTP/1.1");
    client.println("Host: caelumsense.derrickml.com");
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(data.length()));
    client.println();
    client.println(data);
    Serial.println("Sensor Data sent");
  }
  else {
    Serial.println("Connection failed.");
    netConnect();
  }

  client.stop();
}
/*--------------FUNCTION TO FETCH SENSOR DATA FROM ATmega 2560------------------------------
  Temperature
  Humidity
  Light
*/
void sensFetch() {
  if (esp.available()) {              // Checking if there's any data available to be read from the esp object
    String jsonString = esp.readStringUntil('\n');  // Reading a string until we encounter a newline character ('\n') and storing it as jsonString
    delay(2000);
    Serial.println(jsonString);        // Printing the received JSON string to the serial monitor

    StaticJsonDocument<200> doc;       // Creating a new StaticJsonDocument object with a capacity of 200 bytes
    DeserializationError error = deserializeJson(doc, jsonString);  // Parsing the jsonString into the doc object and storing any error in the error variable

    if (error) {                       // Checking if there's any error during the parsing process
      Serial.print("deserializeJson() failed: ");  // Printing an error message to the serial monitor
      Serial.println(error.c_str());
      return;                          // Returning from the function
    }

    humidity = doc["humidity"];        // Extracting the value of the "humidity" key from the doc object and storing it in the humidity variable
    temperature = doc["temperature"];  // Extracting the value of the "temperature" key from the doc object and storing it in the temperature variable
    lightLevel = doc["lightLevel"];    // Extracting the value of the "lightLevel" key from the doc object and storing it in the lightLevel variable
  }

  Serial.print("Humidity: ");        // Printing the humidity value to the serial monitor
  Serial.println(humidity);
  Serial.print("Temperature: "); // Printing the temperature value to the serial monitor
  Serial.println(temperature);
  Serial.print("Light Level: "); // Printing the lightLevel value to the serial monitor
  Serial.println(lightLevel);
  delay(3000);                         // Adding a delay of 1500 milliseconds
}
