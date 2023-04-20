const express = require('express');
const app = express();
const path = require('path');
const openai = require('openai');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql');

// Set up OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// Set up MySQL connection
const dbCredentials = require('./db'); // Import file containing credentials

// Establish database connection using the credentials
const connection = mysql.createConnection({
    host: dbCredentials.host,
    user: dbCredentials.user,
    password: dbCredentials.password,
    database: dbCredentials.database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Parse incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the web interface
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Handle chat bot requests
app.post('/chat', async(req, res) => {
    try {
        // Query the MySQL database for the relevant data
        const queryString = 'SELECT temperature, humidity FROM temp_humid ORDER BY dateTime DESC LIMIT 50';
        connection.query(queryString, async(error, results, fields) => {
            if (error) {
                console.error('Error querying MySQL database:', error.message);
                res.status(500).send('Error querying MySQL database');
            } else {
                // Format the sensor data into text
                let sensorDataText = 'Last 50 sensor readings:';
                results.forEach((result, index) => {
                    sensorDataText += `\nReading ${index + 1}: Temperature: ${result.temperature} °C, Humidity: ${result.humidity} %.`;
                });

                // Include the sensor data in the prompt
                const prompt = `${sensorDataText}\n${req.body.question}`;

                // Generate the bot's response
                const response = await openai.Completion.create({
                    engine: 'text-davinci-003',
                    prompt: prompt,
                    max_tokens: 500,
                });

                // Return the bot's response
                res.send(response.choices[0].text.trim());
            }
        });
    } catch (error) {
        console.error('Error while running completion:', error.message);
        res.status(500).send('Error while running completion');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});