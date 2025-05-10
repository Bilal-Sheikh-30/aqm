
const list = document.querySelectorAll('.list');

function activeLink() {
    list.forEach((item) =>
        item.classList.remove('active')
    );
    this.classList.add('active');
}

list.forEach((item) =>
    item.addEventListener('click', activeLink)
);

const slogans = [
    "Breathe Better. Live Healthier.",
    "Clear Skies, Clear Minds.",
    "Your Air, Your Health, Our Concern.",
    "Because Every Breath Counts.",
    "Smart Living Starts with Smart Breathing.",
    "Invisible Threats. Visible Solutions.",
    "Clean Air is a Human Right.",
    "Monitor Today, Save Tomorrow."
  ];

  let sloganIndex = 0;
  const sloganElement = document.getElementById('slogan-text');

  setInterval(() => {
    sloganElement.style.opacity = 0;
    setTimeout(() => {
      sloganIndex = (sloganIndex + 1) % slogans.length;
      sloganElement.textContent = slogans[sloganIndex];
      sloganElement.style.opacity = 1;
    }, 1000);
  }, 15000); // rotates every 6 seconds


//Navbar
  window.onscroll = function() {
    const navbar = document.querySelector('.navigation');
    
    // Check if the page is scrolled more than 50px
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };


      // Function to fetch and display the most recent sensor data
      function fetchSensorData() {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('data-container');
                container.innerHTML = '';  // Clear previous data
                if (data.length > 0) {
                    // Sort data based on timestamp in descending order to get the latest reading
                    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
                    const latestData = sortedData[0];
                    
    
                
    const row = document.createElement('div');
    row.classList.add('card-row');
    
    // Create and append temperature card
    const tempCard = createSvgMeterCard('Temperature', latestData.temperature, 0, 100, '°C');
    row.appendChild(tempCard);
    
    // Create and append humidity card
    const humidityCard = createSvgMeterCard('Humidity', latestData.humidity, 0, 100, '%');
    row.appendChild(humidityCard);
    
    // Append the row to the main container
    container.appendChild(row);
                    const date_time = document.getElementById('dnt');
                    date_time.innerHTML = '';  // Clear previous data
                    // Display timestamp below the cards
                    const timestampDiv = document.createElement('div');
                    timestampDiv.classList.add('timestamp');
                    timestampDiv.innerText = `Last updated: ${new Date(latestData.timestamp).toLocaleString()}`;
                    date_time.appendChild(timestampDiv);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    
    // Function to create a SVG-style meter card
    function createSvgMeterCard(label, value, min, max, unit) {
        const card = document.createElement('div');
        card.classList.add('meter-card');
    
        // Add label
        const labelElement = document.createElement('div');
        labelElement.classList.add('label');
        labelElement.innerText = label;
        card.appendChild(labelElement);
    
        // Add value
        const valueElement = document.createElement('div');
        valueElement.classList.add('value');
        valueElement.innerText = `${value.toFixed(1)} ${unit}`;
        card.appendChild(valueElement);
    
        // Add SVG meter
        const svgContainer = document.createElement('div');
        svgContainer.classList.add('svg-meter');
    
        // Background circle
        const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        backgroundCircle.setAttribute('width', '180');
        backgroundCircle.setAttribute('height', '180');
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', '90');
        bgCircle.setAttribute('cy', '90');
        bgCircle.setAttribute('r', '70');
        bgCircle.classList.add('background-circle');
        backgroundCircle.appendChild(bgCircle);
    
        // Progress circle
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', '90');
        progressCircle.setAttribute('cy', '90');
        progressCircle.setAttribute('r', '70');
        progressCircle.classList.add('progress-circle');
        const valuePercentage = ((value - min) / (max - min)) * 440;
        progressCircle.style.strokeDashoffset = 440 - valuePercentage;
        backgroundCircle.appendChild(progressCircle);
    
    
    
        svgContainer.appendChild(backgroundCircle);
        card.appendChild(svgContainer);
    
        return card;
    }
    
    // Automatically fetch data every minute
    setInterval(fetchSensorData, 60000);  // 60000 ms = 1 minute
    
    // Initial fetch to load data when the page loads
    fetchSensorData();


let temperatureChart = null;
let humidityChart = null;

function initCharts() {
    const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
    const ctxHum = document.getElementById('humidityChart').getContext('2d');

    // Common chart options for consistency
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        animation: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 12
                }
            }
        },
        elements: {
            point: {
                radius: 3,
                hoverRadius: 5
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    temperatureChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                fill: true,
                backgroundColor: 'rgba(255, 99, 71, 0.2)',
                borderColor: 'rgba(255, 99, 71, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: 'rgba(255, 99, 71, 1)'
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Temperature Time Series',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#ff6347'
                }
            },
            scales: {
                ...commonOptions.scales,
                x: {
                    ...commonOptions.scales.x,
                    title: {
                        display: true,
                        text: 'Time',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 50
                }
            }
        }
    });

    humidityChart = new Chart(ctxHum, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Humidity Time Series',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#36a2eb'
                }
            },
            scales: {
                ...commonOptions.scales,
                x: {
                    ...commonOptions.scales.x,
                    title: {
                        display: true,
                        text: 'Time',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Humidity (%)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

function updateChartData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const timeSeriesSortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                const latestData = timeSeriesSortedData.slice(0, 10).reverse();

                const timestamps = latestData.map(entry =>
                    new Date(entry.timestamp).toLocaleTimeString()
                );
                const temperatures = latestData.map(entry => entry.temperature);
                const humidities = latestData.map(entry => entry.humidity);

                // Update charts directly
                temperatureChart.data.labels = timestamps;
                temperatureChart.data.datasets[0].data = temperatures;
                temperatureChart.update();

                humidityChart.data.labels = timestamps;
                humidityChart.data.datasets[0].data = humidities;
                humidityChart.update();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Initialize and start real-time updates
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    updateChartData(); // initial fetch
    setInterval(updateChartData, 10000); // update every 10 seconds
});

    //Update firware js
    document.getElementById('firmware-form').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent actual form submission
    
    // Get the form data, including the file
    const formData = new FormData(this);

    // Use fetch to send the form data to the server
    fetch('/upload-firmware', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('✅ Firmware uploaded to GitHub successfully.')) {
            // Display success message
            document.getElementById('upload-success').style.display = 'block';
        }
    })
    .catch(err => {
        console.error('Error uploading firmware:', err);
        alert('Failed to upload firmware. Please try again.');
    });
});
//   Update firware ends 
// weekly reports starts here
async function loadCharts() {
      const res = await fetch('/api/data-chart');
      const { dates, tempAvgs, humAvgs } = await res.json();

      new Chart(document.getElementById('weeklytempChart'), {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Temperature (°C)',
            data: tempAvgs,
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { autoSkip: true, maxTicksLimit: 30 }
            },
            y: {
              beginAtZero: true
            }
          },
          barThickness: 30,  // Reduce bar width
        }
      });

      new Chart(document.getElementById('weeklyhumChart'), {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Humidity (%)',
            data: humAvgs,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { autoSkip: true, maxTicksLimit: 30 }
            },
            y: {
              beginAtZero: true
            }
          },
          barThickness: 30,  // Reduce bar width
        }
      });
    }

    loadCharts();
// weekly report ends here 


// function AlertSystem() {
//   fetch('/api/data')
//       .then(response => response.json())
//       .then(data => {
//           const tempAlert = document.querySelector('.tempAlert')
//           const humAlert = document.querySelector('.humAlert');
//           tempAlert.innerHTML = ''; 
//           humAlert.innerHTML = ''; // Clear previous data
//           if (data.length > 0) {
//               // Sort data based on timestamp in descending order to get the latest reading
//               const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//               const latestData = sortedData[0];
//               temperature=latestData.temperature;
//               humidity=latestData.humidity;
//               if (temperature < 0) {
//                 tempAlert.innerHTML = "<div>Freezing Cold ❄️</div>";
//               } else if (temperature <= 10) {
//                 tempAlert.innerHTML = "<div>Very Cold 🧥</div>";
//               } else if (temperature <= 18) {
//                 tempAlert.innerHTML = "<div>Cool 🌬️</div>";
//               } else if (temperature <= 25) {
//                 tempAlert.innerHTML = "<div>Comfortable 😊</div>";
//               } else if (temperature <= 30) {
//                 tempAlert.innerHTML = "<div>Warm ☀️</div>";
//               } else if (temperature <= 35) {
//                 tempAlert.innerHTML = "<div>Hot 🔥</div>";
//               } else {
//                 tempAlert.innerHTML = "<div>Very Hot! ☀️🔥</div>";
//               }
            
//               // Humidity status
//               if (humidity < 20) {
//                 humAlert.innerHTML = "<div>Very Dry 🌵</div>";
//               } else if (humidity <= 30) {
//                 humAlert.innerHTML = "<div>Dry 🏜️</div>";
//               } else if (humidity <= 50) {
//                 humAlert.innerHTML = "<div>Comfortable 🙂</div>";
//               } else if (humidity <= 70) {
//                 humAlert.innerHTML = "<div>Humid 💦</div>";
//               } else if (humidity <= 85) {
//                 humAlert.innerHTML = "<div>Very Humid 🥵</div>";
//               } else {
//                 humAlert.innerHTML = "<div>Extremely Humid 🌫️</div>";
//               }
//             }

              
//           }
        
// )};
// AlertSystem();
function AlertSystem() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        const tempAlert = document.querySelector('.tempAlert');
        const humAlert = document.querySelector('.humAlert');
        
        tempAlert.innerHTML = ''; 
        humAlert.innerHTML = '';
        
        if (data.length > 0) {
          const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          const latestData = sortedData[0];
          const temperature = latestData.temperature;
          const humidity = latestData.humidity;
          
          // Temperature alerts
          if (temperature < 0) {
            tempAlert.innerHTML = "<div>Freezing Cold ❄️</div>";
            tempAlert.setAttribute('data-status', 'freezing');
          } else if (temperature <= 10) {
            tempAlert.innerHTML = "<div>Very Cold 🧥</div>";
            tempAlert.setAttribute('data-status', 'very-cold');
          } else if (temperature <= 18) {
            tempAlert.innerHTML = "<div>Cool 🌬️</div>";
            tempAlert.setAttribute('data-status', 'cool');
          } else if (temperature <= 25) {
            tempAlert.innerHTML = "<div>Comfortable 😊</div>";
            tempAlert.setAttribute('data-status', 'comfortable');
          } else if (temperature <= 30) {
            tempAlert.innerHTML = "<div>Warm ☀️</div>";
            tempAlert.setAttribute('data-status', 'warm');
          } else if (temperature <= 35) {
            tempAlert.innerHTML = "<div>Hot 🔥</div>";
            tempAlert.setAttribute('data-status', 'hot');
          } else {
            tempAlert.innerHTML = "<div>Very Hot! ☀️🔥</div>";
            tempAlert.setAttribute('data-status', 'very-hot');
          }
          
          // Humidity alerts
          if (humidity < 20) {
            humAlert.innerHTML = "<div>Very Dry 🌵</div>";
            humAlert.setAttribute('data-status', 'very-dry');
          } else if (humidity <= 30) {
            humAlert.innerHTML = "<div>Dry 🏜️</div>";
            humAlert.setAttribute('data-status', 'dry');
          } else if (humidity <= 50) {
            humAlert.innerHTML = "<div>Comfortable 🙂</div>";
            humAlert.setAttribute('data-status', 'comfortable');
          } else if (humidity <= 70) {
            humAlert.innerHTML = "<div>Humid 💦</div>";
            humAlert.setAttribute('data-status', 'humid');
          } else if (humidity <= 85) {
            humAlert.innerHTML = "<div>Very Humid 🥵</div>";
            humAlert.setAttribute('data-status', 'very-humid');
          } else {
            humAlert.innerHTML = "<div>Extremely Humid 🌫️</div>";
            humAlert.setAttribute('data-status', 'extremely-humid');
          }
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Run initially and then set interval
  AlertSystem();
  setInterval(AlertSystem, 30000); // Update every 30 seconds              