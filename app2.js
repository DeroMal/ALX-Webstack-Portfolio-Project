require("dotenv").config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const moment = require('moment-timezone');

const app = express();

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'wlgykctu_derrickml',
  password: 'derrickloma',
  database: 'wlgykctu_smartgro'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Set up middleware for serving static files and parsing request body
app.use(express.static('../public/pages/'));
app.use(express.urlencoded({ extended: true }));

// Set up route for displaying paginated sensor data
app.get('/', (req, res) => {
  const pageSize = 10; // number of records to display per page
  const currentPage = req.query.page || 1; // get current page from query parameter or default to page 1
  const startIndex = (currentPage - 1) * pageSize; // calculate start index of records to display

  // Query the database for sensor data
  const query = `SELECT * FROM sensor_data ORDER BY id DESC LIMIT ${startIndex},${pageSize}`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    const sensorData = results.map(data => {
      const localTime = moment.tz(data.dateTime, 'Africa/Kampala');
      data.dateTime = localTime.format('Do[/]MM[/]YY - HH:mm:ss');
      return data;
    });
    const totalCountQuery = 'SELECT COUNT(*) AS totalCount FROM sensor_data';
    connection.query(totalCountQuery, (err, result) => {
      if (err) throw err;
      const totalCount = result[0].totalCount;
      const pageCount = Math.ceil(totalCount / pageSize);
      res.render('table', {
        sensorData,
        pageCount,
        currentPage,
      });
    });
  });
});

// Set up view engine and template directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//---------------------------------------------------//
// Serve the HTML and JavaScript files
// app.use(express.static('public/pages'));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
