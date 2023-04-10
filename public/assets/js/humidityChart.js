// Variables to keep track of the latest reading time and status element
var latestReadingTimeH = null;
var statusElementH = document.getElementById("statusH");

// Function to fetch chart data from the server and update the chart and status
function updateChartH() {
    // Make an AJAX request to fetch the chart data from the server
    fetch('/chart-data')
        .then(response => response.json())
        .then(data => {
            // Get the timestamp of the latest reading in the fetched data
            var latestDataTime = moment(data.dateTime[0], 'MM Do, h:mm:ss a').valueOf();
            // Check if the latest reading time in the fetched data is newer than the current latest reading time
            if (!latestReadingTimeH || latestDataTime > latestReadingTimeH) {
                // Calculate the time difference between the latest reading time and the current time
                var timeDiff = moment.duration(moment().diff(moment(latestDataTime)));
                var timeDiffString = "";
                if (timeDiff.asSeconds() < 60) {
                    timeDiffString = "updated " + Math.round(timeDiff.asSeconds()) + " seconds ago";
                } else if (timeDiff.asMinutes() < 60) {
                    timeDiffString = "updated " + Math.round(timeDiff.asMinutes()) + " minutes ago";
                } else if (timeDiff.asHours() < 24) {
                    timeDiffString = "updated " + Math.round(timeDiff.asHours()) + " hours ago";
                } else {
                    var days = Math.floor(timeDiff.asDays());
                    var hours = Math.floor(timeDiff.asHours() - days * 24);
                    timeDiffString = "updated " + days + " days";
                    if (hours > 0) {
                        timeDiffString += " and " + hours + " hours";
                    }
                    timeDiffString += " ago";
                }
                // Update the latest reading time and status element
                latestReadingTimeH = latestDataTime;
                statusElementH.textContent = timeDiffString;
                // Update the chart data
                chartH.data.datasets[0].data = data.humidity;
                chartH.data.labels = data.dateTime;
                // chart.data.labels = moment(data.dateTime[0], 'MM Do, h:mm:ss a');
                // Update the chart
                chartH.update();
            }
        })
        .catch(error => console.error(error));
}

// Create the initial chart using the current data
var ctxH = document.getElementById("humidChart").getContext("2d");
var chartH = new Chart(ctx, {
    type: "line",
    data: {
        labels: [], // Empty initially
        datasets: [{
            label: "Humidity",
            data: [], // Empty initially
            backgroundColor: "rgba(255, 255, 255, .8)",
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
    },
});

// Call the updateChartH function every 3 seconds
setInterval(updateChartH, 3000);