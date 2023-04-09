// Function to fetch data and update chart
function fetchDataAndUpdateChart() {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Set the HTTP method and URL
    xhr.open('GET', '/chart-data');

    // Set the response type
    xhr.responseType = 'json';

    // Set the onload event handler
    xhr.onload = function() {
        // Check if the response is OK
        if (xhr.status === 200) {
            // Parse the response data
            const data = xhr.response;

            const chartData = {
                labels: data.dateTime,
                datasets: [{
                    label: 'Humidity',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    data: data.humidity
                }, {
                    label: 'Temperature',
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    data: data.temperature
                }]
            };

            // Update the chart data and options
            const myChart = Chart.getChart('myChart');
            myChart.data = chartData;
            myChart.update({
                duration: 2000,
                easing: 'linear',
                lazy: false
            });
        } else {
            console.error('Error fetching data: ' + xhr.status);
        }
    };

    // Send the request
    xhr.send();
}

// Create a bar chart
const ctx = document.getElementById('chart-bars').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {},
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        animation: {
            duration: 0 // Disable global chart animation
        }
    },
    // Set the chart ID
    id: 'chart-bars'
});

// Call the function initially to fetch and display the data
fetchDataAndUpdateChart();

// Call the function every 3 seconds using setInterval()
setInterval(fetchDataAndUpdateChart, 3000);