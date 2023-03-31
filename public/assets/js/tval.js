// Get the temperature element from the HTML
const temperatureElement = document.getElementById('tval');

// Fetch the latest sensor data from the server
fetch('/public/pages')
  .then(response => response.json())
  .then(data => {
    // Extract the temperature value from the data
    const temperature = data.temperature;

    // Update the temperature element with the new value
    temperatureElement.textContent = temperature;
  })
  .catch(error => console.error(error));