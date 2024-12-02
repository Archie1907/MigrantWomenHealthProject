
document.getElementById("age").addEventListener("focus", function () {
    const selectElement = document.getElementById('age');
    if (selectElement.options[0].disabled) {
        selectElement.remove(0);
    }
});

// Logic for cycle length
let cycleLength = 28;
const cycleLengthElement = document.getElementById('cycle-length');

document.querySelector('.increment-btn').addEventListener('click', () => {
    cycleLength++;
    updateCycleLength();
    performCycleCalculation();
});

document.querySelector('.decrement-btn').addEventListener('click', () => {
    if (cycleLength > 1) {
        cycleLength--;
        updateCycleLength();
        performCycleCalculation();
    }
});

function updateCycleLength() {
    if (cycleLength === 1) {
        cycleLengthElement.textContent = `${cycleLength} Day`;
    } else {
        cycleLengthElement.textContent = `${cycleLength} Days`;
    }
}

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate).toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}


let estimatedCalendar = flatpickr("#estimated-calendar", {
    inline: true,
    clickOpens: false,
    enable: [],
});

document.getElementById("age").addEventListener("change", fetchAgeGroupInfo);

function fetchAgeGroupInfo() {
    const selectedAgeGroup = document.getElementById("age").value;

    // Validation to ensure the user selected an age
    if (!selectedAgeGroup) {
        alert("Please select an age group.");
        return;
    }

    // API post method 
    fetch('https://hkzbacqwx6.execute-api.ap-southeast-2.amazonaws.com/dev/displayCycleInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: JSON.stringify({
                ageGroup: selectedAgeGroup
            })
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.body) {
                const parsedData = JSON.parse(data.body);
                displayAgeGroupInfo(parsedData);
            } else {
                alert("Error processing the age group information.");
            }
        })
        .catch(error => {
            alert("There was an error fetching the age group information. Please try again later.");
        });
}

// Displaying menstrual cycle age group information
function displayAgeGroupInfo(data) {
    const selectedAgeGroup = document.getElementById("age").value;

    const infoContainer = document.getElementById("age-group-info");
    infoContainer.innerHTML = `
        <p><strong>For a woman in the age group of ${selectedAgeGroup}:</strong> The typical cycle length ranges from ${data["Cycle length"]}. During this stage, the cycle is ${data["Regularity"]}. It’s important to monitor any changes in cycle length, flow, or symptoms. Common symptoms during this age include ${data["Symptoms"]}. Be aware of significant changes such as irregular cycles, heavy bleeding, or severe pain, and consult a healthcare provider if these occur.</p>
    `;
}

let selectedStartDate = null;
let selectedEndDate = null;

flatpickr("#calendar", {
    mode: "range",
    dateFormat: "Y-m-d",
    inline: true,
    maxDate: "today",
    onChange: function (selectedDates) {
        if (selectedDates.length === 2) {
            selectedStartDate = selectedDates[0];
            selectedEndDate = selectedDates[1];
            performCycleCalculation();
        }
    }
});

document.getElementById("age").addEventListener("change", () => {
    if (selectedStartDate && selectedEndDate) {
        performCycleCalculation();
    }
});

// Calculating next user's next menstrual cycle  
function performCycleCalculation() {
    const selectedAgeGroup = document.getElementById("age").value;

    if (!selectedAgeGroup) {
        alert("Please select an age group.");
        return;
    }

    if (!selectedStartDate || !selectedEndDate) {
        return;
    }

    const formattedStartDate = formatDate(selectedStartDate);
    const formattedEndDate = formatDate(selectedEndDate);

    fetch('https://hkzbacqwx6.execute-api.ap-southeast-2.amazonaws.com/dev/calculateCycle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: JSON.stringify({
                ageGroup: selectedAgeGroup,
                cycleLength: cycleLength,
                endDate: formattedEndDate,
                startDate: formattedStartDate
            })
        })
    })
        .then(response => response.json())
        .then(data => {

            if (data.body) {
                const parsedData = JSON.parse(data.body);


                if (parsedData.estimatedStartDate && parsedData.estimatedEndDate) {
                    highlightCycleRange(parsedData.estimatedStartDate, parsedData.estimatedEndDate);
                } else {
                    alert(parsedData.message || "Error calculating the next cycle.");
                }

                // Show the hidden content
                const cycleAnalysis = document.getElementById("cycle-analysis");
                cycleAnalysis.classList.remove("hidden-content");
                cycleAnalysis.classList.add("show-content");

                // Display the cycle message
                const cycleMessageContainer = document.getElementById("cycle-message");

                switch (parsedData.cycleStatus) {
                    case "shorter":
                        cycleMessageContainer.innerHTML = `
                        Your menstrual cycle is shorter than the average in your age group. 
                        This could be influenced by factors such as stress or diet. 
                        To support hormone balance, consider adjusting your diet to include foods rich in essential fatty acids, like omega-3s. 
                        Additionally, incorporating stress-reduction practices like yoga can be beneficial. 
                         Try this relaxing <a href="https://www.youtube.com/watch?v=HI-hKN-dVLY" target="_blank">15-minute yoga routine</a> to help reduce stress and improve overall well-being, 
    or take a moment to unwind with this <a href="https://www.youtube.com/watch?v=ZToicYcHIOU" target="_blank">10-minute guided meditation</a> for mindfulness and relaxation.
If you consistently experience a shorter menstrual cycle over an extended period, please consult with a GP.

`;
                        break;
                    case "average":
                        cycleMessageContainer.innerHTML = `
                        Your menstrual cycle is normal compared to the average in your age group. Maintaing a healthy lifestyle with a balanced diet, regular exercise and adequate sleep in essential. 
                         If you would like to maintain an exercising habit on your period you can try the following exercises: <a href="https://www.youtube.com/watch?v=mfG0p1sv9OI" target="_blank">30 minutes period friendly pilates</a>  
    or take a moment to stretch with this <a href="https://www.youtube.com/watch?v=2X78NWuRfJU" target="_blank">15 minute PMS stretch</a>. Please remember that these are just suggestions, and if you notice anything unusual with your body, it's advisable to consult a GP.


`; break;
                    case "longer":
                        cycleMessageContainer.innerHTML = `
                       Your menstrual cycle is longer than the average in your age group, which could be influenced by factors such as stress or diet. To support your health, consider adjusting your diet to include more magnesium, zinc, and vitamin B6. Incorporating regular physical activity into your routine can also be beneficial. Try this <a href="https://www.youtube.com/watch?v=rI_6l992GrA" target="_blank">30-minute full-body workout</a> to add some exercise to your day, or enjoy this fun <a href="https://www.youtube.com/watch?v=mZeFvX3ALKYk" target="_blank">Zumba workout</a>. If you consistently experience a longer menstrual cycle over an extended period, please consult with a GP to check for any underlying conditions.

`; break;
                    default:
                        cycleMessageContainer.innerText = "Your menstrual cycle length and timing appear normal.";
                        break;
                }


                // Draw the cycle length distribution chart
                drawCycleLengthDistribution(
                    parsedData.cycleLengthDistribution,
                    cycleLength,
                    parsedData.totalWomenInAgeGroup
                );

            } else {
                alert("Error processing your request.");
            }
        })
        .catch(error => {
            alert("There was an error processing your request. Please try again later.");
        });
}


function formatDate(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}

function highlightCycleRange(startDate, endDate) {
    const daysBetween = getDatesInRange(new Date(startDate), new Date(endDate));

    // Update the estimated calendar with the new date range
    estimatedCalendar.destroy(); // Destroy the previous instance
    estimatedCalendar = flatpickr("#estimated-calendar", {
        inline: true,
        defaultDate: startDate, // Set the default date to the start of the estimated cycle
        clickOpens: false,
        enable: [], // Disable all date selections
        onDayCreate: function (dObj, dStr, fp, dayElem) {
            const date = dayElem.dateObj.toISOString().split("T")[0];
            if (daysBetween.includes(date)) {
                dayElem.classList.add("highlighted-date");
            }
        },
        onMonthChange: function (selectedDates, dateStr, instance) {
            // Re-apply highlighting when month is changed
            const allDays = instance.days.childNodes;
            allDays.forEach((dayElem) => {
                const date = dayElem.dateObj.toISOString().split("T")[0];
                if (daysBetween.includes(date)) {
                    dayElem.classList.add("highlighted-date");
                } else {
                    dayElem.classList.remove("highlighted-date");
                }
            });
        }
    });

    // Ensure the calendar shows the month of the estimated start date
    estimatedCalendar.jumpToDate(startDate);
}

document.getElementById('age').addEventListener('change', function () {
    var analysisSection = document.getElementById('analysis-section');

    if (this.value) {
        analysisSection.style.display = 'block';
    } else {
        analysisSection.style.display = 'none';
    }
});

let cycleLengthChartInstance = null;

function drawCycleLengthDistribution(cycleLengthDistribution, userCycleLength, totalWomen) {
    const ctx = document.getElementById('cycleLengthChart').getContext('2d');

    // Check if the chart instance already exists, and if so, destroy it
    if (cycleLengthChartInstance) {
        cycleLengthChartInstance.destroy();
    }

    // Convert the counts to percentages
    const percentageDistribution = cycleLengthDistribution.map(item => ({
        cycleLength: item.cycleLength,
        percentage: (item.count / totalWomen) * 100
    }));

    // Extract cycle lengths and percentages
    const cycleLengths = percentageDistribution.map(item => item.cycleLength);
    const percentages = percentageDistribution.map(item => item.percentage);

    // Find the percentage for the user's cycle length and raise it slightly above the corresponding bar
    const userPercentage = (percentageDistribution.find(item => item.cycleLength === userCycleLength)?.percentage || 0) + 5;

    // Custom plugin to draw text above the user's data point
    const userCycleLengthLabel = {
        id: 'userCycleLengthLabel',
        afterDatasetDraw(chart, args, options) {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;

            ctx.save();

            const userDataset = chart.data.datasets[1];
            const userDataPoint = userDataset.data[0];
            const xScale = chart.scales.x;
            const yScale = chart.scales.y;

            const x = xScale.getPixelForValue(userDataPoint.x);
            const y = yScale.getPixelForValue(userDataPoint.y);

            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#FF1493';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            ctx.fillText('Your cycle length:', x, y - 25);

            ctx.fillText(`${userCycleLength} days`, x, y - 10);

            ctx.restore();
        }
    };

    // Create a new bar chart with the user's cycle length as dot
    cycleLengthChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cycleLengths.map(length => `${length} days`),
            datasets: [{
                label: 'Cycle Length Distribution',
                data: percentages,
                backgroundColor: 'rgba(255, 182, 193, 0.6)',
                borderColor: 'rgba(255, 182, 193, 1)',
                borderWidth: 1,
            },
            {
                type: 'scatter',
                label: 'Your Cycle Length',
                data: [{
                    x: `${userCycleLength} days`,
                    y: userPercentage
                }],
                backgroundColor: '#FF1493',
                borderColor: '#FF1493',
                borderWidth: 1,
                pointRadius: 8,
                pointHoverRadius: 10,
            }],
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cycle Length (days)',
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            const label = this.getLabelForValue(value);
                            if (label.length > 10) {
                                return label.split(" ").map((word, i) => i ? "\n" + word : word);
                            }
                            return label;
                        },
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Percentage of Women (%)',
                    },
                    beginAtZero: true,
                    min: 0,
                    max: Math.max(...percentages) + 10,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    filter: function (tooltipItem) {
                        return tooltipItem.datasetIndex === 0;
                    },
                    callbacks: {
                        label: function (tooltipItem) {
                            const yValue = tooltipItem.raw.toFixed(2);
                            return `${yValue}% of women have a cycle length of ${tooltipItem.label}`;
                        }
                    }
                },
                userCycleLengthLabel: true,
            },
        },
        plugins: [userCycleLengthLabel],
    });
}