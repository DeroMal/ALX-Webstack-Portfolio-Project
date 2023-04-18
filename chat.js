const express = require('express');
const app = express();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API instance
const openai = new OpenAIApi(configuration);

// Read the CSV data and store it in an array
const csvFilePath = './temp_humid.csv';
const data = [];
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        data.push(row);
    })
    .on('end', () => {
        console.log('Accessing sensor data at real time ... \nSuccessfully processed database data\n');
    });

// Serve the web interface
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Handle chat bot requests
app.get('/chat', async(req, res) => {
    try {
        // Get the last 50 rows of the CSV data
        const last50Rows = data.slice(-50);

        // Generate the bot's response
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${req.query.question}\n${last50Rows.map(row => Object.values(row).join('\n')).join('\n')}\n`,
            max_tokens: 500,
        });

        // Return the bot's response
        res.send(response.data.choices[0].text.trim());
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