const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wlgykctu_derrickml',
    password: 'derrickloma',
    database: 'wlgykctu_smartgro'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully!');
});

connection.on('error', (err) => {
    console.error('Database connection error:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to receive sensor data
app.post('/sensor-data', (req, res) => {
    const { temperature, humidity, moisture, light } = req.body;

    // Validate inputs
    if (!temperature || !humidity) {
        return res.status(400).json({ error: 'Missing input data' });
    }

    // Insert data into database
    const sql = `INSERT INTO sensor_data (temperature, humidity, moisture, light) VALUES (${temperature}, ${humidity}, ${moisture}, ${light})`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        res.status(200).json({ message: 'Sensor data saved successfully' });
    });
});

// Endpoint to receive actuator data
app.post('/actuator-data', (req, res) => {
    const { fanStatus, humidifierStatus, pumpStatus, lightStatus } = req.body;

    // Validate inputs
    if (!fanStatus || !humidifierStatus || !pumpStatus || !lightStatus) {
        return res.status(400).json({ error: 'Missing input data' });
    }

    // Insert data into database
    const sql = `INSERT INTO actuator_data (fanStatus, humidifierStatus, pumpStatus, lightStatus) VALUES (${fanStatus}, ${humidifierStatus}, ${pumpStatus}, ${lightStatus})`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        res.status(200).json({ message: 'Actuator data saved successfully' });
    });
});

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
