// Generate random temperature and humidity values every 3 seconds
setInterval(() => {
    const hum = Math.floor(Math.random() * 100);
    
    // Update the values on the page
    document.getElementById('lval').innerText = `${hum}%`;
  }, 3000);