const express = require('express');
const mysql = require('mysql');

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sensgro'
});

// Connect to the database
connection.connect();

// Define a route for the homepage
app.get('public/views/table', (req, res) => {
  // Query the database for temperature and humidity data
  connection.query('SELECT * FROM sensor_data', (error, results, fields) => {
    if (error) throw error;
    // Render the index view with the temperature and humidity data
    res.render('table', { data: results });
  });
});

// Define a route for the temperature and humidity graph
app.get('/graph', (req, res) => {
  // Query the database for temperature and humidity data
  connection.query('SELECT * FROM sensor_data', (error, results, fields) => {
    if (error) throw error;

    // Extract the temperature and humidity data from the results
    const temperatures = results.map(result => result.temperature);
    const humidities = results.map(result => result.humidity);

    // Render the graph view with the temperature and humidity data
    res.render('graph', {
      temperatures: temperatures,
      humidities: humidities
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});