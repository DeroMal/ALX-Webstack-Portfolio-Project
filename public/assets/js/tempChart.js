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
            data: [],
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

let prevId = '';
setInterval(() => {
    fetch('/public/pages')
        .then(response => response.json())
        .then(data => {
            const newData = data.temperature;
            if (data._id !== prevId) {
                chartTemp.data.datasets[0].data.push(newData);
                chartTemp.data.labels.push(new Date().toLocaleTimeString());
                if (chartTemp.data.datasets[0].data.length > 10) {
                    // Remove oldest data if there are more than 10 data points
                    chartTemp.data.datasets[0].data.shift();
                    chartTemp.data.labels.shift();
                }
                chart1.update();
                prevId = data._id;
            }
        })
        .catch(error => console.error(error));
}, 3000);
