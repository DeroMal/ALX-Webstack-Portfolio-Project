//Setting Humidity chart configurations
// const data = [];
// const labels = [];
const chartHumidity = {
    type: "line",
    data: {
        labels: ["Humidity"],
        datasets: [{
            label: "Humidity",
            tension: 0,
            borderWidth: 0,
            pointRadius: 5,
            pointBackgroundColor: "rgba(255, 255, 255, .8)",
            pointBorderColor: "transparent",
            borderColor: "rgba(255, 255, 255, .8)",
            borderColor: "rgba(255, 255, 255, .8)",
            borderWidth: 4,
            backgroundColor: "transparent",
            fill: true,
            data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
            maxBarThickness: 6

        }],
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
            x: {
                grid: {
                    drawBorder: false,
                    display: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                    borderDash: [5, 5]
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
    },
};

//Create the temperature chart
const ctx2 = document.getElementById("chart-line").getContext("2d");
const chart2 = new Chart(ctx2, chartHumidity);

// Update the temperature chart with new data every 3 seconds
setInterval(() => {
    // Generate new random data and add it to the chart
    const newData = Math.floor(Math.random() * 100);
    data.push(newData);
    labels.push(new Date().toLocaleTimeString());
    if (data.length > 10) {
        // Remove oldest data if there are more than 10 data points
        data.shift();
        labels.shift();
    }
    // Update the chart's data and re-render it
    chartHumidity.data.datasets[0].data = data;
    chartHumidity.data.labels = labels;
    chart2.update();

     // Update the values on the page
     document.getElementById('hval').innerText = `${newData}%`;    
}, 3000);