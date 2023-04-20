const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const openai = require('openai');

// Set your OpenAI API key
openai.apiKey = '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';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MySQL connection
const dbCredentials = require('../db'); //Import file containing credentials

// Establish database connection using the credentials
const db = mysql.createConnection({
    host: dbCredentials.host,
    user: dbCredentials.user,
    password: dbCredentials.password,
    database: dbCredentials.database
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// Endpoint to get sensor data and chat with ChatGPT model
app.post('/chat', async(req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Please provide a question.' });
    }

    const sensorDataQuery = 'SELECT temperature, humidity FROM sensor_data ORDER BY dateTime DESC LIMIT 50';
    db.query(sensorDataQuery, async(err, results) => {
        if (err) throw err;

        let sensorDataText = 'Last 50 sensor readings: ';
        results.forEach((result, index) => {
            sensorDataText += `\nReading ${index + 1}: Temperature: ${result.temperature} °C, Humidity: ${result.humidity} %. `;
        });

        const prompt = `${sensorDataText}\n${question}`;

        try {
            const chatGPTResponse = await openai.Completion.create({
                engine: 'text-davinci-002',
                prompt: prompt,
                max_tokens: 100,
                n: 1,
                stop: null,
                temperature: 0.5,
            });

            const answer = chatGPTResponse.choices[0].text.trim();
            res.json({ answer });
        } catch (error) {
            res.status(500).json({ error: 'Error processing your question.' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});