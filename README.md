# CaelumSense

- CaelumSense is a SMART Room monitoring system that allows you to monitor the humidity, temperature, and light levels in their room. The system consists of an Arduino-based hardware platform and a web-based user interface that displays the sensor data in real-time.
- The project uses two Arduino boards, an ESP8266 WEMOS D1 mini and an Arduino MEGA ATmega2560, to fetch data from sensors and send it to a remote server using HTTPS POST requests. The front end dashboard displays the current sensor information to the user in real-time through graphs and tables.

## Table of Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Caelum Chatbot AI Assistant](#CaelumSense-Chatbot)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Screenshots

Here are some screenshots of the CaelumSense project:

| | |
|:-------------------------:|:-------------------------:|
|**Dashboard Light mode**<br>![Screenshot 2](/screenshots/caelumsense_dash_light.png)|**Dashboard Dark mode**<br>![Screenshot 3](/screenshots/caelumsense_dash_dark.png)|
|**Table Page in Light Mode**<br>![Screenshot 4](/screenshots/caelumsense_table_light.png)|**Table Page in Dark Mode**<br>![Screenshot 5](/screenshots/caelumsense_table_dark.png)|
|**Chat Page in Dark Mode**<br>![Screenshot 6](/screenshots/caelumsense_chart_light.png)|**Chat Page in Dark Mode**<br>![Screenshot 7](/screenshots/caelumsense_chart_dark.png)|

**Hardware Set-up**<br>![Screenshot 1](/screenshots/IMG_20230413_143824_578.jpg)

## Features

- Real-time monitoring of humidity, temperature, and light levels in a room
- A.I ChatBot (Caelum) assistant
- Web-based user interface for displaying sensor data
- Customizable graphs and tables for displaying sensor data
- Remote monitoring of a room through an internet connection
- Arduino-based hardware platform for collecting and transmitting sensor data
- MySQL database for storing sensor data

## Technologies Used

CaelumSense is built using the following technologies:

- Server: Node.js
- ChatBot: OpenAI API; Text-davinci-003 model
- Frontend: HTML/CSS, JavaScript, Bootstrap, Material-UI, Creative Tim Dashboard Material-UI
- Backend: Node.js, SQL
- Storage: MySQL database
- Hardware: Arduino, DHT22 sensor, LDR sensor, Jumperwires, breadboard, and USB/data cables

## Hardware Requirements

To build and use the CaelumSense system, you will need the following hardware components:

- Arduino MEGA ATmega2560 microcontroller board
- ESP8266 WEMOS D1 mini WiFi module
- DHT22 humidity and temperature sensor
- LDR light sensor
- Breadboard
- Jumper wires

## Software Requirements

To install and run the CaelumSense system, you will need the following software components:

- Node.js
- OpenAI API
- MySQL database

## CaelumSense Chatbot

The CaelumSense Chatbot is a conversational agent that provides real-time temperature and humidity sensor data from the CaelumSense system. The chatbot is powered by OpenAI's GPT-3.5 architecture and can be accessed through a web-based user interface.

### Chatbot Features

- Provides real-time temperature and humidity sensor data from the CaelumSense system
- Allows users to ask questions in natural language
- Responds to user queries with relevant and accurate information
- Can handle multiple users simultaneously
- Uses OpenAI's GPT-3.5 architecture to generate responses

### Chatbot Technologies Used

The CaelumSense Chatbot is built using the following technologies:

- Frontend: HTML/CSS, JavaScript, Bootstrap
- Backend: Node.js, Express.js
- API: OpenAI's GPT-3.5

### Chatbot Usage

To use the CaelumSense Chatbot, follow these steps:

1. Open a web browser and navigate to the CaelumSense dashboard.
2. Click on the chat icon to open the chatbot interface.
3. Type your question in the input field and press Enter or click the Send button.
4. The chatbot will generate a response based on your query.

### Chatbot Limitations

- The chatbot can only provide sensor data from the last 100 readings.
- The chatbot is currently only able to respond to queries related to temperature and humidity data.
## Installation

To install and set up the CaelumSense system, follow these steps:

1. Clone the CaelumSense GitHub repository to your local machine.
2. Install Node.js and MySQL on your machine if they are not already installed.
3. Set up the MySQL database using the provided [`caelumsense.sql`](https://github.com/DeroMal/CaelumSense-SMART-ROOM/tree/master/database) file.
4. Navigate to the `root` directory in a terminal window and run the command `npm install` to install the required Node.js modules.
5. Follow the instructions in the [Arduino](https://github.com/DeroMal/CaelumSense-SMART-ROOM/tree/master/Arduino#readme) directory on how to connect and configure the Arduino boards.
6. After setting up the Arduino and the sensors, navigate to the `root` directory in a terminal window and run the command `node app.js` to start the server.
7. Open a web browser and navigate to `http://localhost:3000` to view the CaelumSense dashboard.

## Usage

To use the CaelumSense system, follow these steps:

1. Connect the Arduino MEGA ATmega2560 and ESP8266 WEMOS D1 mini boards to your room's sensors.
2. Power on the Arduino Arduino MEGA ATmega2560 and WEMOS D1 Mini/ESP8266 module.
3. Open a web browser and navigate to `http://localhost:3000` to view the CaelumSense dashboard.
4. The dashboard will display the current humidity, temperature, and light levels in your room in real-time.

## Contributing

Contributions to the CaelumSense project are welcome and encouraged! To contribute, follow these steps:

1. Fork the CaelumSense GitHub repository.
2. Clone the forked repository to your local machine.
3. Install the necessary dependencies by running `npm install` in the root directory of the project.
4. Create a new branch for your feature or bug fix: `git checkout -b my-new-feature`.
5. Make changes and test thoroughly.
6. Commit your changes: `git commit -am 'Add some feature'` or `git commit -am 'Fix some bug'`.
7. Push your branch to GitHub: `git push origin my-new-feature`.
8. Submit a pull request to the CaelumSense GitHub repository.

## License

The CaelumSense project is licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Contact

For any questions, comments, or concerns, please feel free to contact the CaelumSense team at derrickmal123@gmail.com.
