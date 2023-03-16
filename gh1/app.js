require("dotenv").config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();


// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, '')));
app.use(cors({ origin: process.env.REMOTE_CLIENT_APP, credentials: true }));


// Define a route to get the sensor data
app.get('/api/sensor-data', (req, res) => {
  // Generate random sensor readings
  const temperature = Math.floor(Math.random() * 50);
  const humidity = Math.floor(Math.random() * 100);
  const timestamp = new Date();

  // Return the sensor readings as a JSON object
  res.json({
    temperature,
    humidity,
    timestamp
  });
});

// Serve the frontend HTML page
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.sendFile(path.join(__dirname, 'index.html'));

});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
