const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const path = require('path');

app.use(express.static(path.join(__dirname, '.')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat6.html'));
});


// Set up MySQL connection
const dbCredentials = require('./db'); //Import file containing credentials

// Establish database connection using the credentials
const connection = mysql.createConnection({
    host: dbCredentials.host,
    user: dbCredentials.user,
    password: dbCredentials.password,
    database: dbCredentials.database
});

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API instance
const openai = new OpenAIApi(configuration);

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database');
});

// Retrieve data from the database
async function getDataFromDatabase() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM temp_humid ORDER BY dateTime DESC LIMIT 50', (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Configure Express app
app.use(cors());
app.use(express.json());

// API endpoint for the chatbot
app.post('/api/chat', async(req, res) => {
    const question = req.body.question;

    try {
        // Get the last 50 rows of sensor data
        const data = await getDataFromDatabase();

        // Format the data as a table
        const dataAsText = data.map(row => Object.values(row).join(', ')).join('\n');

        // Add a brief description of the data
        const dataDescription = `The table below shows the last 50 temperature and humidity sensor readings in the format "Timestamp, Temperature, Humidity":\n${dataAsText}\n`;

        let responseText = "";
        let attempts = 0;

        // Retry until a valid response is generated or a maximum number of attempts is reached
        while (responseText.trim().length < 10 && attempts < 5) {
            // Generate the bot's response
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `I am a knowledgeable Caelum (AI) with access to the following data:\n${dataDescription}\nUser: ${question}\nCaelum (AI):`,
                max_tokens: 500,
                n: 1,
                stop: ["\n"],
            });

            responseText = response.data.choices[0].text.trim();
            attempts++;
        }

        // Instead of printing the response, send it as a JSON object
        res.json({ response: responseText });
    } catch (error) {
        console.error("Error while running completion:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});