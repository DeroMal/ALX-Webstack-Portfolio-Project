# Arduino Sensor Data Sender

This project contains two Arduino codes for fetching sensor data and sending it to a remote server using HTTPS POST requests. 

## Description

The first code `fetch-sensor-data.ino` fetches data from sensors connected to an ATmega2560 microcontroller and sends it via a SoftwareSerial connection to an ESP8266 WiFi module. The sensor data is then packed into a JSON format and sent to the ESP8266 module, which then sends it to a remote server using HTTPS POST requests.

The second code `send-sensor-data.ino` establishes a secure connection to the remote server and sends the sensor data in JSON format as an HTTPS POST request.

## How to use

1. Open the Arduino IDE
2. Copy the contents of `fetch-sensor-data.ino` into a new Arduino sketch and upload it to an ATmega2560 microcontroller.
3. Copy the contents of `send-sensor-data.ino` into a new Arduino sketch and upload it to an ESP8266 WiFi module.
4. Open the serial monitor for both the ATmega2560 microcontroller and the ESP8266 WiFi module to monitor the data being sent and received.

Note: Before uploading the code, make sure to update the following variables with your own information:

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* host = "YOUR_REMOTE_SERVER_HOSTNAME";
const char* fingerprint = "YOUR_REMOTE_SERVER_SSL_FINGERPRINT";


## Disclaimer

This code is provided as-is and no warranty is given as to its suitability for any particular purpose. Use at your own risk.

## Author

Derrick Locha Mayiku