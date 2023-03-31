fetch('/public/pages')
  .then(response => response.json())
  .then(data => {
    document.getElementById('tval').textContent = data.temperature;
    // document.getElementById('humidity').textContent = data.humidity;
  })
  .catch(error => console.error(error));
