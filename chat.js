const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const mysql = require('mysql');
const path = require('path');

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API instance
const openai = new OpenAIApi(configuration);

// Set up MySQL connection
const dbCredentials = require('./db'); //Import file containing credentials

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

// Serve the web interface
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Handle chat bot requests
app.get('/chat', async(req, res) => {
    try {
        // Query the MySQL database for the relevant JSON data
        const queryString = `SELECT * FROM temperature_data ORDER BY dateTime DESC LIMIT 20`;
        connection.query(queryString, async(error, results, fields) => {
            if (error) {
                console.error('Error querying MySQL database:', error.message);
                res.status(500).send('Error querying MySQL database');
            } else {
                // Generate the bot's response
                const jsonData = results.map(result => result.json_data);
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    context: jsonData,
                    // prompt: `${req.query.question}\n\n${jsonData.join('\n')}\n`,
                    // max_tokens: 100,
                    prompt: `${req.query.question}`,
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0.6,
                    stop: [" Human:", " AI:"],
                });

                // Return the bot's response
                res.send(response.data.choices[0].text.trim());
            }
        });
    } catch (error) {
        console.error("Error while running completion:", error.message);
        res.status(500).send("Error while running completion");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});