setInterval(() => {
    fetch('/chart-data2')
        .then(response => response.json())
        .then(data => {
            document.getElementById('tval').textContent = data.temperatureData.temperature[0];
            document.getElementById('hval').textContent = data.humidityData.humidity[0];
            // document.getElementById('mval').textContent = data.moisture[0];
            document.getElementById('lval').textContent = data.lightData.light[0];
        })
        .catch(error => console.error(error));
}, 2000);