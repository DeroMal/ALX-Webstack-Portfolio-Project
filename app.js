require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const moment = require('moment-timezone');
const cron = require('node-cron');
const { Configuration, OpenAIApi } = require('openai');

const timezone = 'Africa/Kampala';

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://caelumsense.rec22test.site/");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//sets the content type header to application/javascript before sending the file, which should inform the browser that the file contains JavaScript code.
app.get('/assets/js/:filename', (req, res) => {
    const filename = req.params.filename;
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, `/public/assets/js/${filename}`));
});

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

// Connect to MySQL
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up middleware for serving static files and parsing request body
app.use(express.static(path.join(__dirname, '/public/pages')));

// =============================ROUTES============================================================
// Route to fetch user input for number of datapoints and  save to the database
app.route('/max-data')
    .post((req, res) => {
        number = req.body.number;
        console.log(`The user entered ${number}`);
        const truncateSql = `TRUNCATE TABLE max_data`;
        const insertSql = `INSERT INTO max_data (max_data) VALUES (${number})`;

        connection.query(truncateSql, (err, results) => {
            if (err) throw err;
            connection.query(insertSql, (err, results) => {
                if (err) throw err;
                console.log('Data inserted successfully');
            });
        });

        res.json({ number });
        number = 100;
    });

// Route to fetch data from the database and send to the frontend
app.get('/chart-api', (req, res) => {
    let maxData = 10;
    const maxdataSql = `SELECT max_data FROM max_data`;

    //Query the MaxData point db
    connection.query(maxdataSql, (err, results) => {
        if (err) throw err;

        maxData = results[0].max_data;
        console.log(`maxData = ${maxData}`);
        let MaxData = {
            max_data: results.map((entry) => entry.max_data)
        };

        const humiditySql = `SELECT * FROM (SELECT * FROM humidity_data ORDER BY dateTime DESC LIMIT ${maxData}) sub ORDER BY id ASC`;
        const temperatureSql = `SELECT * FROM (SELECT * FROM temperature_data ORDER BY dateTime DESC LIMIT ${maxData}) sub ORDER BY id ASC`;
        const lightSql = `SELECT * FROM (SELECT * FROM light_data ORDER BY dateTime DESC LIMIT ${maxData}) sub ORDER BY id ASC`;
        let humidityData, temperatureData, lightData;

        //Query the temperature db
        connection.query(temperatureSql, (err, results) => {
            if (err) throw err;

            temperatureData = {
                temperature: results.map((entry) => entry.temperature),
                dateTime: results.map((entry) => moment.tz(entry.dateTime, 'UTC').tz(timezone).format('MM Do, h:mm a'))
            };

            //Query the humidity db
            connection.query(humiditySql, (err, results) => {
                if (err) throw err;

                humidityData = {
                    humidity: results.map((entry) => entry.humidity),
                    dateTime: results.map((entry) => moment.tz(entry.dateTime, 'UTC').tz(timezone).format('MM Do, h:mm a'))
                };

                //Query the LightLevel db
                connection.query(lightSql, (err, results) => {
                    if (err) throw err;

                    lightData = {
                        light: results.map((entry) => entry.light),
                        dateTime: results.map((entry) => moment.tz(entry.dateTime, 'UTC').tz(timezone).format('MM Do, h:mm a'))
                    };

                    const chartData = {
                        humidityData,
                        temperatureData,
                        lightData,
                        MaxData
                    };

                    res.json(chartData);
                });
            });
        });
    });


});

// Route handler for displaying paginated sensor data
app.get('/table', (req, res) => {
    const pageSize = 10; // number of records to display per page
    const currentPage = req.query.page || 1; // get current page from query parameter or default to page 1
    const startIndex = (currentPage - 1) * pageSize; // calculate start index of records to display

    // Query the database for sensor data
    const sensorDataQuery = `SELECT * FROM sensor_data ORDER BY id DESC LIMIT ${startIndex},${pageSize}`;
    connection.query(sensorDataQuery, (err, sensorDataResults) => {
        if (err) throw err;

        const sensorData = sensorDataResults.map(data => {
            const localTime = moment.tz(data.dateTime, 'Africa/Kampala');
            data.dateTime = localTime.format('Do[/]MM[/]YY - HH:mm:ss');
            return data;
        });

        const sensorTotalCountQuery = 'SELECT COUNT(*) AS totalCount FROM sensor_data';
        connection.query(sensorTotalCountQuery, (err, sensorTotalCountResult) => {
            if (err) throw err;
            const sensorTotalCount = sensorTotalCountResult[0].totalCount;
            const sensorPageCount = Math.ceil(sensorTotalCount / pageSize);

            // Query the database for temperature data
            const tempPageSize = 5; // number of records to display per page
            const tempCurrentPage = req.query.page || 1; // get current page from query parameter or default to page 1
            const tempStartIndex = (tempCurrentPage - 1) * tempPageSize; // calculate start index of records to display

            const tempDataQuery = `SELECT * FROM temperature_data ORDER BY id DESC LIMIT ${tempStartIndex},${tempPageSize}`;
            connection.query(tempDataQuery, (err, tempDataResults) => {
                if (err) throw err;

                const tempData = tempDataResults.map(data => {
                    const localTime = moment.tz(data.dateTime, 'Africa/Kampala');
                    data.dateTime = localTime.format('Do[/]MM[/]YY - HH:mm');
                    return data;
                });

                const tempTotalCountQuery = 'SELECT COUNT(*) AS totalCount FROM temperature_data';
                connection.query(tempTotalCountQuery, (err, tempTotalCountResult) => {
                    if (err) throw err;
                    const tempTotalCount = tempTotalCountResult[0].totalCount;
                    const tempPageCount = Math.ceil(tempTotalCount / tempPageSize);

                    // Query the database for humidity data
                    const humidPageSize = 5; // number of records to display per page
                    const humidCurrentPage = req.query.page || 1; // get current page from query parameter or default to page 1
                    const humidStartIndex = (humidCurrentPage - 1) * humidPageSize; // calculate start index of records to display

                    const humidDataQuery = `SELECT * FROM humidity_data ORDER BY id DESC LIMIT ${humidStartIndex},${humidPageSize}`;
                    connection.query(humidDataQuery, (err, humidDataResults) => {
                        if (err) throw err;

                        const humidData = humidDataResults.map(data => {
                            const localTime = moment.tz(data.dateTime, 'Africa/Kampala');
                            data.dateTime = localTime.format('Do[/]MM[/]YY - HH:mm');
                            return data;
                        });

                        const humidTotalCountQuery = 'SELECT COUNT(*) AS totalCount FROM humidity_data';
                        connection.query(humidTotalCountQuery, (err, humidTotalCountResult) => {
                            if (err) throw err;
                            const humidTotalCount = humidTotalCountResult[0].totalCount;
                            const humidPageCount = Math.ceil(humidTotalCount / humidPageSize);

                            // Query the database for humidity data
                            const lightPageSize = 5; // number of records to display per page
                            const lightCurrentPage = req.query.page || 1; // get current page from query parameter or default to page 1
                            const lightStartIndex = (lightCurrentPage - 1) * lightPageSize; // calculate start index of records to display

                            const lightDataQuery = `SELECT * FROM light_data ORDER BY id DESC LIMIT ${lightStartIndex},${lightPageSize}`;
                            connection.query(lightDataQuery, (err, lightDataResults) => {
                                if (err) throw err;

                                const lightData = lightDataResults.map(data => {
                                    const localTime = moment.tz(data.dateTime, 'Africa/Kampala');
                                    data.dateTime = localTime.format('Do[/]MM[/]YY - HH:mm');
                                    return data;
                                });

                                const lightTotalCountQuery = 'SELECT COUNT(*) AS totalCount FROM light_data';
                                connection.query(lightTotalCountQuery, (err, lightTotalCountResult) => {
                                    if (err) throw err;
                                    const lightTotalCount = lightTotalCountResult[0].totalCount;
                                    const lightPageCount = Math.ceil(lightTotalCount / lightPageSize);

                                    res.render('table', {
                                        sensorData,
                                        sensorPageCount,
                                        currentPage,
                                        tempData,
                                        tempPageCount,
                                        tempCurrentPage,
                                        humidData,
                                        humidPageCount,
                                        humidCurrentPage,
                                        lightData,
                                        lightPageCount,
                                        lightCurrentPage,
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Endpoint to receive sensor data
app.post('/sensor-data', (req, res) => {

    const { temperature, humidity, light } = req.body;

    // Validate inputs
    if (!temperature || !humidity) {
        return res.status(400).json({ error: 'Missing input data' });
    }

    // Insert data into database tables
    const tempSql = `INSERT INTO temperature_data (temperature) VALUES (${temperature})`;
    const humiditySql = `INSERT INTO humidity_data (humidity) VALUES (${humidity})`;
    const lightSql = `INSERT INTO light_data (light) VALUES (${light})`;
    connection.query(tempSql, (err, results) => {
        if (err) {
            console.error('Error inserting temperature data into database:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        connection.query(humiditySql, (err, results) => {
            if (err) {
                console.error('Error inserting humidity data into database:', err);
                return res.status(500).json({ error: 'Server error' });
            }

            connection.query(lightSql, (err, results) => {
                if (err) {
                    console.error('Error inserting light data into database:', err);
                    return res.status(500).json({ error: 'Server error' });
                }

                res.status(200).json({ message: 'Sensor data saved successfully' });
            });
        });
    });
});

// Endpoint to receive actuator data
app.post('/actuator-data', (req, res) => {
    const { fanStatus, humidifierStatus, pumpStatus, lightStatus } = req.body;

    // Validate inputs
    if (!fanStatus || !humidifierStatus || !pumpStatus || !lightStatus) {
        return res.status(400).json({ error: 'Missing input data' });
    }

    // Insert data into database
    const sql = `INSERT INTO actuator_data (fanStatus, humidifierStatus, pumpStatus, lightStatus) VALUES ('${fanStatus}', '${humidifierStatus}', '${pumpStatus}', '${lightStatus}')`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        res.status(200).json({ message: 'Actuator data saved successfully' });
    });
});

/**====CHAT Establishment routes=================**/
// Define a global variable to store the sensor data
let sensorData = [];

// Define a function to update the sensor data
async function updateSensorData() {
    async function getDataFromDatabase() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM temp_humid ORDER BY dateTime DESC LIMIT 100', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    try {
        // Get the last 50 rows of sensor data from the database
        const data = await getDataFromDatabase();
        sensorData = data;
    } catch (error) {
        console.error("Error while getting sensor data:", error.message);
    }
}

// Update the sensor data initially and every 30 seconds thereafter
updateSensorData();
setInterval(updateSensorData, 30000);

// API endpoint for the chatbot
app.post('/api/chat', async(req, res) => {
    const question = req.body.question;

    try {
        // Use the global sensorData variable instead of calling getDataFromDatabase
        const data = sensorData;

        // Format the data as a table
        const dataAsText = data.map(row => {
            const dateTime = moment.tz(row.dateTime, 'Africa/Kampala').format('YYYY-MM-DD HH:mm:ss');
            return [dateTime, row.temperature, row.humidity].join(', ');
        }).join('\n');

        // Add a brief description of the data
        const dataDescription = `The table below shows the last 100 temperature and humidity sensor readings in the format "Timestamp (Africa/Kampala), Temperature, Humidity":\n${dataAsText}\n`;

        let responseText = "";
        let attempts = 0;

        // Retry until a valid response is generated or a maximum number of attempts is reached
        while (responseText.trim().length < 10 && attempts < 5) {
            // Generate the bot's response
            const response = await openai.createCompletion({
                // text-davinci-003
                model: "text-davinci-003",
                prompt: `I am a knowledgeable Caelum (AI) and created by Derrick L. Mayiku. I only so far have access to the following data (Temperature and Humdity) with the corresponding timestamps (Please note that I won't be able to list the data in a table format or listing format:x):\n${dataDescription}\nUser: ${question}\nCaelum (AI):`,
                max_tokens: 800,
                n: 1,
                stop: ["\n"],
            });

            responseText = response.data.choices[0].text.trim();
            attempts++;
        }

        // Instead of printing the response, send it as a JSON object
        res.json({ response: responseText });
    } catch (error) {
        console.error("Caelum is Turned off >> Error while running completion:", error.message);
        res.status(500).json({ error: error.message });
    }
});
/**=======END CHAT ROUTE=========================**/

/**======UPDATE temp_humid TABLE=============**/
// query to create the new table
const createTableQuery = `
CREATE TABLE IF NOT EXISTS temp_humid (
  id INT NOT NULL AUTO_INCREMENT,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  dateTime TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
)
`;

// execute the query to create the new table
connection.query(createTableQuery, (error, results, fields) => {
    if (error) throw error;
    console.log('Table created successfully');
});

// query to insert data into the new table
const insertDataQuery = `
INSERT INTO temp_humid (temperature, humidity, dateTime)
SELECT t.temperature, h.humidity, t.dateTime
FROM temperature_data t
JOIN humidity_data h ON t.dateTime = h.dateTime
WHERE t.dateTime >= DATE_SUB(NOW(), INTERVAL 5 SECOND)
`;

// execute the query to insert data into the new table every 5 seconds
setInterval(() => {
    connection.query(insertDataQuery, (error, results, fields) => {
        if (error) throw error;
        console.log('Data inserted successfully');
    });
}, 5000);
/**======ENDO OF UPDATE temp_humid TABLE=============**/

// Set up view engine and template directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set up route for displaying the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/dashboard.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});