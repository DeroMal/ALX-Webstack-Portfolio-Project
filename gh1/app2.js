require("dotenv").config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
// Serve the HTML and JavaScript files
app.use(express.static('public/pages'));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});