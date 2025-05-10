// for time series graph
function fetchData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('data-container');
            container.innerHTML = '';  // Clear previous data
            if (data.length > 0) {
                // Sort data based on timestamp in descending order to get the latest reading
                const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                // Get the first 9 elements
                const latestData = sortedData.slice(0, 9);
                console.log(latestData);
            }
        })  // Closing the .then() here
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call fetchData() to fetch the data
fetchData();