//Setting Temperature chart configurations
const data = [];
const labels = [];
const chartTemp = {
    type: "bar",
    data: {
        labels: ["Temp"],
        datasets: [{
            label: "Temp",
            tension: 0.4,
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            backgroundColor: "rgba(255, 255, 255, .8)",
            data: [50, 20, 10, 22, 50, 10, 40],
            maxBarThickness: 6
        },],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            y: {
                grid: {
                    drawBorder: false,
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    borderDash: [5, 5],
                    color: 'rgba(255, 255, 255, .2)'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 500,
                    beginAtZero: true,
                    padding: 10,
                    font: {
                        size: 14,
                        weight: 300,
                        family: "Roboto",
                        style: 'normal',
                        lineHeight: 2
                    },
                    color: "#fff"
                },
            },
            x: {
                grid: {
                    drawBorder: false,
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    borderDash: [5, 5],
                    color: 'rgba(255, 255, 255, .2)'
                },
                ticks: {
                    display: true,
                    color: '#f8f9fa',
                    padding: 10,
                    font: {
                        size: 14,
                        weight: 300,
                        family: "Roboto",
                        style: 'normal',
                        lineHeight: 2
                    },
                }
            },
        },
    }
};

//Create the temperature chart
const ctx = document.getElementById('chart-bars').getContext('2d');
const chart1 = new Chart(ctx, chartTemp);

// Update the temperature chart with new data every 3 seconds
setInterval(() => {
    // Generate new random data and add it to the chart
    const newData = Math.floor(Math.random() * 40);
    data.push(newData);
    labels.push(new Date().toLocaleTimeString());
    if (data.length > 10) {
        // Remove oldest data if there are more than 10 data points
        data.shift();
        labels.shift();
    }
    // Update the chart's data and re-render it
    chartTemp.data.datasets[0].data = data;
    chartTemp.data.labels = labels;
    chart1.update();

     // Update the values on the page
     document.getElementById('tval').innerText = `${newData}°C`;
}, 3000);