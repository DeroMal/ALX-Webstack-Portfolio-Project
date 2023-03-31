setInterval(() => {
    fetch('/public/pages')
      .then(response => response.json())
      .then(data => {
        document.getElementById('tval').textContent = data.temperature;
        document.getElementById('hval').textContent = data.humidity;
        document.getElementById('mval').textContent = data.moisture;
        document.getElementById('lval').textContent = data.light;
      })
      .catch(error => console.error(error));
  }, 2000);
  