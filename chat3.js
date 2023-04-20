require('dotenv').config();
const mysql = require('mysql2');
const { Configuration, OpenAIApi } = require("openai");

// Define database credentials
const dbCredentials = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'database_name'
};

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API instance
const api = new OpenAIApi(configuration);

const connection = await mysql.createConnection({
    host: dbCredentials.host,
    user: dbCredentials.user,
    password: dbCredentials.password,
    database: dbCredentials.database
});

const [rows] = await connection.execute('SELECT * FROM temperature_data');

async function generateResponse(question, sensorData) {
    const prompt = `Q: ${question}\nA:`;
    const inputs = {
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.5,
        model: 'text-davinci-003',
        context: sensorData,
    }
    const response = await api.completions.create(inputs);
    return response.choices[0].text.trim();
}

const express = require('express');
const app = express();

app.get('/ask', async(req, res) => {
    const question = req.query.question;
    const sensorData = JSON.stringify({ rows });
    const response = await generateResponse(question, sensorData);
    res.send(response);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});