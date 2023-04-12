# Arduino Sensor Data Transmission

This is the Arduino program that uses a Wi-Fi module to transmit sensor data to a server. The Arduino is divided into two parts:

1. The ATmega2560 (Arduino MEGA) firmware that reads sensor data and sends it to the ESP8266 module (WEMOS/LOLIN DI Mini) over serial communication.
2. The ESP8266 firmware that receives the sensor data from the ATmega2560 module and sends it to a server over HTTPS.

## Hardware Requirements

- Arduino Mega 2560
- ESP8266 Wi-Fi module
- DHT22 Temperature and Humidity Sensor
- Light Dependent Resistor (LDR)
- 10k Ohm Resistor
- Jumper wires
- Breadboard

## Libraries Used

The following Arduino libraries are required for this project:

1. `ESP8266WiFi`: Enables the ESP8266 WiFi module to connect to a WiFi network.

2. `WiFiClientSecure`: Enables the ESP8266 WiFi module to establish a secure (HTTPS) connection with a remote server.

3. `SoftwareSerial`: Enables serial communication between the ATmega2560 microcontroller and the ESP8266 WiFi module.

4. `DHT`: Enables the ATmega2560 microcontroller to read temperature and humidity data from the DHT22 sensor.

5. `ArduinoJson`: Enables the serialization and deserialization of JSON data.


## ATmega2560 Firmware (Arduino MEGA)

The ATmega2560 firmware reads the sensor data from the DHT22 temperature and humidity sensor and the light dependent resistor (LDR). It then sends the data to the ESP8266 Wi-Fi module over serial communication. The firmware uses the SoftwareSerial library to communicate with the ESP8266 module.

## ESP8266 Firmware (WEMOS/LOLIN DI Mini)

The ESP8266 firmware receives the sensor data from the ATmega2560 module over serial communication. It then sends the data to a server over HTTPS. The firmware uses the WiFiClientSecure library to establish a secure connection with the server and the ArduinoJson library to format the sensor data into a JSON object.

## Configuration

To configure the firmware, you need to set the following constants in the code:

### ATmega2560 Firmware

- `DHTPIN`: The digital pin to which the DHT22 sensor is connected.
- `LDRPIN`: The analog pin to which the LDR is connected.
- `BAUD_RATE`: The baud rate of the serial communication with the ESP8266 module.

### ESP8266 Firmware

- `STASSID`: The SSID of the Wi-Fi network to which the ESP8266 module should connect.
- `STAPSK`: The password of the Wi-Fi network to which the ESP8266 module should connect.
- `HOST`: The hostname of the server to which the sensor data should be sent.
- `HTTPS_PORT`: The port number of the HTTPS server.
- `FINGERPRINT`: The SHA-1 fingerprint of the HTTPS server certificate.

## How to Use

The `caelum_MEGA_v1/caelum_MEGA_v1.ino` sketch collects temperature and humidity data from the DHT22 sensor and light level data from the LDR sensor. The data is then formatted as a JSON object and sent over the Serial port to the ESP8266 module for transmission to the server.

The `caelumsense_ESP8266_v1/caelumsense_ESP8266_v1.ino` sketch connects to a Wi-Fi network and a server over HTTPS. It then receives the JSON object containing the sensor data from the ATmega 2560 board and sends it to the server.

Before uploading the sketches to the boards, the following lines of code should be modified in both sketches:

- Wi-Fi network name and password
- Server hostname and port number
- Server SSL fingerprint

## Disclaimer

This code is provided as-is and no warranty is given as to its suitability for any particular purpose. Use at your own risk.

## Author

Derrick Locha Mayiku