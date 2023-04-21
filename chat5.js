const express = require('express');
const app = express();
const mysql = require('mysql');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API instance
const openai = new OpenAIApi(configuration);

// Create a MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sensgro"
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the MySQL database!");
});

// Function to query data from the MySQL database
async function queryData(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// Read the data from the MySQL database and store it in an array
async function getDataFromDatabase() {
    const query = "SELECT * FROM temp_humid";
    try {
        const data = await queryData(query);
        return data;
    } catch (error) {
        console.error("Error while fetching data from the database:", error.message);
        return [];
    }
}
async function runBot() {
    // Define the data description
    const first50Rows = data.slice(0, 100);
    const dataAsText = first50Rows.map(row => Object.values(row).join(', ')).join('\n');
    const dataDescription = `The table below shows the first 100 temperature and humidity sensor readings in the format "Timestamp, Temperature, Humidity":\n${dataAsText}\n`;
    while (true) {
        // Prompt the user to enter a question
        const question = await prompt("Ask a question: ");

        try {
            let responseText = "";
            let attempts = 0;

            // Retry until a valid response is generated or a maximum number of attempts is reached
            while (responseText.trim().length < 10 && attempts < 5) {
                // Generate the bot's response
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `I am a knowledgeable AI with access to the following data:\n${dataDescription}\nUser: ${question}\nAI:`,
                    max_tokens: 500,
                    n: 1,
                    stop: ["\n"],
                });

                responseText = response.data.choices[0].text.trim();
                attempts++;
            }

            // Print the bot's response or a default message if no valid response was generated
            if (responseText.trim().length >= 10) {
                console.log("Caelum:", responseText);
            } else {
                console.log("Caelum: I'm sorry, I couldn't generate a valid response. Please try asking a different question.");
            }
        } catch (error) {
            console.error("Error while running completion:", error.message);
        }
    }
}

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

function printCsvData() {
    console.log("CSV Data:\n");
    console.log("Timestamp, Temperature, Humidity");
    data.forEach(row => {
        console.log(Object.values(row).join(', '));
    });
    console.log("\n");
}

// Main function to start the application
async function main() {
    try {
        data = await getDataFromDatabase();
        // printData();
        await runBot();
    } catch (error) {
        console.error("Error while starting the application:", error.message);
    }
}

main();