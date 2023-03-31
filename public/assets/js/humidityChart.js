//Setting Humidity chart configurations
const data = [];
const labelsH = [];
const chartHum = {
    type: "bar",
    data: {
        labels: ["Hum"],
        datasets: [{
            label: "Hum",
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

const chartTemp = {
    type: "line",
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


const chartMoi = {
    type: "line",
    data: {
        labels: ["Moisture"],
        datasets: [{
            label: "Moisture",
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

//Create the Humidity chart
const ctxH = document.getElementById('chart-line').getContext('2d');
const chartH = new Chart(ctxH, chartHum);

const ctxM = document.getElementById('chart-line-tasks').getContext('2d');
const chartM = new Chart(ctxM, chartMoi);

const ctxT = document.getElementById('chart-bars').getContext('2d');
const chartT = new Chart(ctxT, chartTemp);

// Update the Humidity chart with new data every 3 seconds

let prevId1 = '';
let prevId2 = '';
let prevId3 = '';
setInterval(() => {
    fetch('/public/pages')
        .then(response => response.json())
        .then(responseData => {
            const newDataH = responseData.humidity;
            if (responseData._id !== prevId1) {
                chartHum.data.datasets[0].data.push(newDataH);
                chartHum.data.labels.push(new Date().toLocaleTimeString());
                if (chartHum.data.datasets[0].data.length > 10) {
                    // Remove oldest data if there are more than 10 data points
                    chartHum.data.datasets[0].data.shift();
                    chartHum.data.labels.shift();
                }
                chartH.update();
                prevId1 = responseData._id;
            }

            const newDataM = responseData.moisture;
            if (responseData._id !== prevId2) {
                chartMoi.data.datasets[0].data.push(newDataM);
                chartMoi.data.labels.push(new Date().toLocaleTimeString());
                if (chartMoi.data.datasets[0].data.length > 10) {
                    // Remove oldest data if there are more than 10 data points
                    chartMoi.data.datasets[0].data.shift();
                    chartMoi.data.labels.shift();
                }
                chartM.update();
                prevId2 = responseData._id;
            }

            const newDataT = responseData.temperature;
            if (responseData._id !== prevId3) {
                chartTemp.data.datasets[0].data.push(newDataT);
                chartTemp.data.labels.push(new Date().toLocaleTimeString());
                if (chartTemp.data.datasets[0].data.length > 10) {
                    // Remove oldest data if there are more than 10 data points
                    chartTemp.data.datasets[0].data.shift();
                    chartTemp.data.labels.shift();
                }
                chartT.update();
                prevId3 = responseData._id;
            }
        })
        .catch(error => console.error(error));
}, 3000);