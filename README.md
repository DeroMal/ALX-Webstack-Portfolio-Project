# CaelumSense

CaelumSense is a project that allows you to monitor the humidity, temperature, and light levels in your room remotely. With this system, you can keep an eye on your room wherever you are, as long as you have access to the internet. The project uses two Arduino boards, an ESP8266 WEMOS D1 mini and an Arduino MEGA ATmega2560, to fetch data from sensors and send it to a remote server using HTTPS POST requests. The front end dashboard displays the current sensor information to the user in real-time through graphs and tables.

## Technologies

- Server: Node.js
- Frontend: HTML/CSS, JS, Bootstrap, material-ui, Creative tim dashboard material-ui
- Backend: Node.js, SQL
- Storage: MySQL database
- Hardware: Arduino, DHT22 sensor, LDR sensor

## Features

- Real-time sensor data: The system allows you to monitor your room's temperature, humidity, and light levels in real-time through a user-friendly dashboard.
- Remote monitoring: You can access your room's sensor data remotely from anywhere with an internet connection.
- Customizable data points: The system allows you to adjust the number of data points displayed on the graphs created.
- Secure data transmission: The system uses HTTPS POST requests to securely transmit sensor data to a remote server.
- Open-source: The project is open-source and free for anyone to use, modify, and distribute.

## Getting Started

### Prerequisites

- Arduino IDE
- Node.js
- MySQL

### Installation

1. Clone the repository.
```git clone https://github.com/YOUR-USERNAME/CaelumSense.git```

2. Install the dependencies for the frontend and backend.
```cd CaelumSense-SMART-ROOM```
``npm install``

3. Connect the Arduino boards to your sensors and upload the code in the `arduino` directory to the boards using the Arduino IDE.

4. Set up a MySQL database and update the `config.js` file in the `backend` directory with your database credentials.

5. Run the server and frontend.
```npm run start```

6. Open your browser and go to http://localhost:3000 to view the frontend dashboard.

## Contributing

Contributions to CaelumSense are welcome and encouraged! To contribute, please create a pull request with your proposed changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Node.js](https://nodejs.org)
- [MySQL](https://www.mysql.com/)
- [Bootstrap](https://getbootstrap.com/)
- [material-ui](https://material-ui.com/)
- [Creative Tim Dashboard Material-UI](https://www.creative-tim.com/product/material-dashboard-react)
- [Arduino](https://www.arduino.cc/)
- [DHT22 sensor](https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf)
- [LDR sensor](https://www.sparkfun.com/products/9088)

