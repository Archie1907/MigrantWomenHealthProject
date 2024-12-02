const geoJsonFile = 'https://iterationvis.s3.ap-southeast-2.amazonaws.com/australian-states.min.geojson';
const stateDataFile = 'https://iterationvis.s3.ap-southeast-2.amazonaws.com/new_reshaped_state_data.csv';
const ageDataFile = 'https://iterationvis.s3.ap-southeast-2.amazonaws.com/reshaped_age_data.csv';
const femaleDataFile = 'https://iterationvis.s3.ap-southeast-2.amazonaws.com/reshaped_female_data.csv';

// Function to load CSV data
async function loadCSV(url) {
    try {
        const data = await d3.csv(url);
        return data;
    } catch (error) {
        return [];
    }
}

// Function to populate dropdowns
function populateDropdowns(stateData) {
    const years = [...new Set(stateData.map(d => d.Year))];
    const stis = [...new Set(stateData.map(d => d.STI))];

    const yearDropdown = document.getElementById('year');
    years.forEach(year => {
        let option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearDropdown.appendChild(option);
    });

    const stiDropdown = document.getElementById('sti');
    stis.forEach(sti => {
        let option = document.createElement('option');
        option.value = sti;
        option.text = sti;
        stiDropdown.appendChild(option);
    });
}

// Variables to store data
let ageData, femaleData;

// Function to update charts based on user selection
async function updateCharts() {
    const selectedYear = document.getElementById('year').value;
    const selectedSTI = document.getElementById('sti').value;

    if (!selectedYear || !selectedSTI) {
        return;
    }

    const filteredAgeData = ageData.filter(d => d.Year === selectedYear && d.STI === selectedSTI);
    const filteredFemaleData = femaleData.filter(d => d.Year === selectedYear && d.STI === selectedSTI);

    // Store filtered data globally for later use
    window.barChartData = filteredAgeData;
    window.pieChartData = filteredFemaleData;


    updateBarChart();
    updatePieChart();
}

// Create choropleth map using Plotly
async function updateMap() {
    const selectedYear = document.getElementById('year').value;
    const selectedSTI = document.getElementById('sti').value;

    const geoJsonData = await d3.json(geoJsonFile);
    const stateData = await loadCSV(stateDataFile);

    const filteredStateData = stateData.filter(d => d.Year === selectedYear && d.STI === selectedSTI);

    
    const totalCases = d3.sum(filteredStateData, d => +d.Cases);

    
    filteredStateData.forEach(d => {
        d.Proportion = (d.Cases / totalCases * 100).toFixed(2);  
    });

    const mapData = [{
        type: 'choroplethmapbox',
        geojson: geoJsonData,
        locations: filteredStateData.map(d => d.State),  // State names from CSV
        featureidkey: 'properties.STATE_NAME',  // Path to state names in GeoJSON
        z: filteredStateData.map(d => +d.Cases),  // Ensure 'Cases' are numeric
        text: filteredStateData.map(d => d.State),
        hovertemplate: 
            '<b>%{text}</b><br>' +  
            'Total Cases: %{z:,}<br>' +  
            'Proportion: %{customdata}%' +  
            '<extra></extra>',  
        customdata: filteredStateData.map(d => d.Proportion),  
        colorscale: [
            [0, '#FFFFFF'],   // white
            [0.2, '#FFE4E9'], // very light pink
            [0.4, '#FFC0CB'], // light pink
            [0.6, '#FF91B2'], // medium pink
            [0.8, '#FF69B4'], // deeper pink
            [1, '#FF1493']    // hot pink (deep pink)
        ],
        marker: {
            line: {
                width: 0.5,  
                color: 'gray'  
            }
        },
        colorbar: {
            title: {
                text: 'Number of Cases', 
                side: 'top'  
            },
            thickness: 15,  
            len: 0.8  
        }
    }];
    
    const layout = {
        mapbox: {
            style: "carto-positron",
            center: { lon: 133.7751, lat: -25.2744 },
            zoom: 3.2
        },
        autosize: true,  
        title: `${selectedYear} STI Geographic Distribution for ${selectedSTI}`,
        showlegend: true,
        legend: {
            orientation: 'h',  
            xanchor: 'center',
            y: -0.2,  
            x: 0.5,
            title: {
                text: 'Number of Cases', 
                font: {
                    size: 14,
                    color: '#333'
                }
            }
        },
        margin: { t: 40, b: 10 }
    };

    Plotly.react('map', mapData, layout);  // Use react to efficiently update the plot
}


// Create a bar chart using Plotly
function updateBarChart() {
    const selectedYear = document.getElementById('year').value;
    const selectedSTI = document.getElementById('sti').value;
    const filteredAgeData = window.barChartData;

    // calculate total cases
    const totalCases = d3.sum(filteredAgeData, d => +d.Cases);

    // calculate age proportion
    filteredAgeData.forEach(d => {
        d.Proportion = (d.Cases / totalCases * 100).toFixed(2);  
    });

    const barData = [{
        x: filteredAgeData.map(d => d['Age Group']),
        y: filteredAgeData.map(d => +d.Cases),
        type: 'bar',
        marker: { color: 'rgba(255, 182, 193, 0.6)' },  // Light pink color
        hovertemplate: 
            '<b>Total Cases: %{y}</b><br>' +  
            'Proportion: %{customdata}%' +  
            '<extra></extra>',  
        customdata: filteredAgeData.map(d => d.Proportion), 
    }];

    const layout = {
        title: `${selectedYear} Age Distribution of ${selectedSTI} Cases`,
        xaxis: { title: 'Age Group' },
        yaxis: { title: 'Cases' }
    };

    Plotly.react('barchart', barData, layout);
}

// Create a pie chart using Plotly
function updatePieChart() {
    const selectedYear = document.getElementById('year').value;
    const selectedSTI = document.getElementById('sti').value;
    const filteredFemaleData = window.pieChartData;

    // Calculating total cases, female cases, and male cases
    const totalCases = d3.sum(filteredFemaleData, d => +d['Total Cases']);
    const femaleCases = d3.sum(filteredFemaleData, d => +d.Female);
    const maleCases = totalCases - femaleCases;

    const pieData = [{
        values: [femaleCases, maleCases],
        labels: ['Female', 'Male'],
        type: 'pie',
        marker: { colors: ['#FFC0CB', '#FF69B4'] },  // Pink color scheme

        // Adding hover template to show Total cases and Proportion
        hovertemplate: 
            '<b style="text-align:left;">%{label}</b><br>' +  // Gender (Female/Male)
            'Total Cases: %{value:,}<br>' +  // Displaying Total cases
            'Proportion: %{percent:.2%}' +  // Displaying proportion (percentage)
            '<extra></extra>',  // Remove 'trace' information from hover
    }];

    const layout = {
        title: `${selectedYear} Gender Distribution of ${selectedSTI} Cases`,
        font: { family: 'Arial, sans-serif', size: 18, color: '#333' },
        showlegend: true,  // Display legend
    };

    // Use Plotly.react to efficiently update the pie chart
    Plotly.react('piechart', pieData, layout);
}

// Function to toggle chart visibility
function showChart(chartId) {
    document.getElementById('map').classList.remove('active');
    document.getElementById('barchart').classList.remove('active');
    document.getElementById('piechart').classList.remove('active');

    document.getElementById(chartId).classList.add('active');
}

// Event listeners for chart buttons
document.getElementById('mapButton').addEventListener('click', function () {
    showChart('map');
    updateMap();
});

document.getElementById('barButton').addEventListener('click', function () {
    showChart('barchart');
    updateBarChart();
});

document.getElementById('pieButton').addEventListener('click', function () {
    showChart('piechart');
    updatePieChart();
});

// Load initial data and populate dropdowns on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function () {
    const stateData = await loadCSV(stateDataFile);
    ageData = await loadCSV(ageDataFile);
    femaleData = await loadCSV(femaleDataFile);

    populateDropdowns(stateData);
    updateCharts();  // Initialize the charts with default selections
});

const layout = {
    mapbox: {
        style: "carto-positron",
        center: { lon: 133.7751, lat: -25.2744 },
        zoom: 3.5
    },
    autosize: true,
    title: `${selectedYear} STI Geographic Distribution for ${selectedSTI} Cases`,
    showlegend: true,
    margin: { t: 40, b: 10 }
};
