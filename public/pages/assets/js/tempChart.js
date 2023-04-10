var chart;
var chartH;
var chartL;
// Variables to keep track of the latest reading time and status element
var latestReadingTime = null;
var statusElement = document.getElementById("status");
var statusElementH = document.getElementById("statusH");
var statusElementL = document.getElementById("statusL");

// Function to fetch chart data from the server and update the chart and status
function updateChart() {
    // Make an AJAX request to fetch the chart data from the server
    fetch('/chart-data')
        .then(response => response.json())
        .then(data => {
            // Get the timestamp of the latest reading in the fetched data
            var latestDataTime = moment(data.dateTime[0], 'MM Do, h:mm:ss a').valueOf();
            // Check if the latest reading time in the fetched data is newer than the current latest reading time
            if (!latestReadingTime || latestDataTime > latestReadingTime) {
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
                latestReadingTime = latestDataTime;
                statusElement.textContent = timeDiffString;
                statusElementH.textContent = timeDiffString;
                statusElementL.textContent = timeDiffString;

                // Update the chart data
                if (chart) {
                    chart.destroy();
                }

                if (chartH) {
                    chartH.destroy();
                }

                if (chartL) {
                    chartL.destroy();
                }

                // Create the initial charts using the current data
                var ctx = document.getElementById("tempChart").getContext("2d");
                chart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: data.dateTime, // Empty initially
                        datasets: [{
                            label: "Temperature",
                            data: data.temperature, // Empty initially
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

                // Create the initial humidity chart using the current data
                var ctxH = document.getElementById("humidChart").getContext("2d");
                chartH = new Chart(ctxH, {
                    type: "line",
                    data: {
                        labels: data.dateTime, // Empty initially
                        datasets: [{
                            label: "Humidity",
                            data: data.humidity, // Empty initially
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

                // Create the initial Light chart using the current data
                var ctx3 = document.getElementById("lightChart").getContext("2d");
                chartL = new Chart(ctx3, {
                    type: "line",
                    data: {
                        labels: data.dateTime, // Empty initially
                        datasets: [{
                            label: "Light Intensity",
                            data: data.light, // Empty initially
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

            }
        })
        .catch(error => console.error(error));
}

// // Create the initial chart using the current data
// var ctx = document.getElementById("tempChart").getContext("2d");
// var chart = new Chart(ctx, {
//     type: "bar",
//     data: {
//         labels: [], // Empty initially
//         datasets: [{
//             label: "Temperature",
//             data: [], // Empty initially
//             backgroundColor: "rgba(255, 255, 255, .8)",
//             maxBarThickness: 6
//         }],
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false,
//             }
//         },
//         interaction: {
//             intersect: false,
//             mode: 'index',
//         },
//         scales: {
//             y: {
//                 grid: {
//                     drawBorder: false,
//                     display: true,
//                     drawOnChartArea: true,
//                     drawTicks: false,
//                     borderDash: [5, 5],
//                     color: 'rgba(255, 255, 255, .2)'
//                 },
//                 ticks: {
//                     suggestedMin: 0,
//                     suggestedMax: 500,
//                     beginAtZero: true,
//                     padding: 10,
//                     font: {
//                         size: 14,
//                         weight: 300,
//                         family: "Roboto",
//                         style: 'normal',
//                         lineHeight: 2
//                     },
//                     color: "#fff"
//                 },
//             },
//             x: {
//                 grid: {
//                     drawBorder: false,
//                     display: true,
//                     drawOnChartArea: true,
//                     drawTicks: false,
//                     borderDash: [5, 5],
//                     color: 'rgba(255, 255, 255, .2)'
//                 },
//                 ticks: {
//                     display: true,
//                     color: '#f8f9fa',
//                     padding: 10,
//                     font: {
//                         size: 14,
//                         weight: 300,
//                         family: "Roboto",
//                         style: 'normal',
//                         lineHeight: 2
//                     },
//                 }
//             },
//         },
//     },
// });

// // Create the initial chart using the current data
// var ctxH = document.getElementById("humidChart").getContext("2d");
// var chartH = new Chart(ctx, {
//     type: "line",
//     data: {
//         labels: [], // Empty initially
//         datasets: [{
//             label: "Humidity",
//             data: [], // Empty initially
//             backgroundColor: "rgba(255, 255, 255, .8)",
//             maxBarThickness: 6
//         }],
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false,
//             }
//         },
//         interaction: {
//             intersect: false,
//             mode: 'index',
//         },
//         scales: {
//             y: {
//                 grid: {
//                     drawBorder: false,
//                     display: true,
//                     drawOnChartArea: true,
//                     drawTicks: false,
//                     borderDash: [5, 5],
//                     color: 'rgba(255, 255, 255, .2)'
//                 },
//                 ticks: {
//                     suggestedMin: 0,
//                     suggestedMax: 500,
//                     beginAtZero: true,
//                     padding: 10,
//                     font: {
//                         size: 14,
//                         weight: 300,
//                         family: "Roboto",
//                         style: 'normal',
//                         lineHeight: 2
//                     },
//                     color: "#fff"
//                 },
//             },
//             x: {
//                 grid: {
//                     drawBorder: false,
//                     display: true,
//                     drawOnChartArea: true,
//                     drawTicks: false,
//                     borderDash: [5, 5],
//                     color: 'rgba(255, 255, 255, .2)'
//                 },
//                 ticks: {
//                     display: true,
//                     color: '#f8f9fa',
//                     padding: 10,
//                     font: {
//                         size: 14,
//                         weight: 300,
//                         family: "Roboto",
//                         style: 'normal',
//                         lineHeight: 2
//                     },
//                 }
//             },
//         },
//     },
// });

// Call the updateChart function every 3 seconds
setInterval(updateChart, 500);