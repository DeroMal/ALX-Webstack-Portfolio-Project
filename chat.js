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

// Serve the chat.html file
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/chat.html'));
});

// Endpoint for chatbot API
app.post('/chatbot', async(req, res) => {
    try {
        // Get the last row of the CSV data
        const lastRow = data[data.length - 1];

        // Generate the bot's response
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${req.body.question}\n${Object.values(lastRow).join('\n')}\n`,
            max_tokens: 500,
        });

        // Return the bot's response
        res.json({ response: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error("Error while running completion:", error.message);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});