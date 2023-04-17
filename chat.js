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
const csvFilePath = './temperature_data.csv';
const data = [];
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        data.push(row);
    })
    .on('end', () => {
        console.log('Accessing sensor data at real time ... \nSuccessfully processed database data\n');
    });

// Serve chat.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Handle POST request to /chat
app.post('/chat', async(req, res) => {
    try {
        // Get the last row of the CSV data
        const lastRow = data[data.length - 1];

        // Generate the bot's response
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${req.body.question}\n${Object.values(lastRow).join('\n')}\n`,
            max_tokens: 500,
        });

        // Send the bot's response back to the client
        res.send(response.data.choices[0].text.trim());
    } catch (error) {
        console.error("Error while running completion:", error.message);
        res.status(500).send("Error while generating bot response");
    }
});
// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});