function updateSensorData() {
    fetch('/public/pages')
      .then(response => response.json())
      .then(data => {
        document.getElementById('tval').textContent = data.temperature;
      })
      .catch(error => console.error(error));
  }

  setInterval(updateSensorData, 1000);