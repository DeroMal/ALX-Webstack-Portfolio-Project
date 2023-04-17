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
        runBot();
    });

// Run the chat bot continuously
async function runBot() {
    while (true) {
        // Prompt the user to enter a question
        const question = await prompt("Ask a question: ");

        try {
            // Get the last row of the CSV data
            const lastRow = data[data.length - 1];

            // Generate the bot's response
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${question}\n${Object.values(lastRow).join('\n')}\n`,
                max_tokens: 500,
            });

            // Print the bot's response
            console.log("Caelum:", response.data.choices[0].text.trim());
        } catch (error) {
            console.error("Error while running completion:", error.message);
        }
    }
}

// Helper function to prompt the user for input
function prompt(question) {
    return new Promise((resolve, reject) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}