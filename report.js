// Popup disclaimer
document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('disclaimerPopup');

    if (!localStorage.getItem('userAgreed')) {
        popup.style.display = 'flex';
    }

    document.getElementById('agreeBtn').addEventListener('click', function () {
        // Save the user's agreement in localStorage and close the popup
        localStorage.setItem('userAgreed', 'true');
        popup.style.display = 'none';
    });

    document.getElementById('disagreeBtn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});

// Progress bar and multi-step form
document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".question");
    const progressText = document.getElementById("progress-text");
    const progressBar = document.getElementById("progressBar");
    let currentQuestionIndex = 0;
    const questionsPerPage = 4;
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    // Function to show questions and update progress bar
    function showQuestions(startIndex) {
        questions.forEach((question, i) => {
            if (i >= startIndex && i < startIndex + questionsPerPage) {
                question.style.display = "block";
            } else {
                question.style.display = "none";
            }
        });
        updateProgressBar();
    }

    // Update progress bar based on the current page
    function updateProgressBar() {
        const currentPage = Math.ceil(currentQuestionIndex / questionsPerPage) + 1;
        progressBar.value = (currentPage / totalPages) * 100;
        progressText.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    // Handle navigation buttons for Next and Previous
    function handleNavigationButtons() {
        document.querySelectorAll(".nextBtn").forEach(button => {
            button.addEventListener("click", function () {
                if (validateCurrentQuestions()) {
                    currentQuestionIndex = Math.min(currentQuestionIndex + questionsPerPage, questions.length - 1);
                    showQuestions(currentQuestionIndex);
                } else {
                    alert("Please select an option for all questions before proceeding.");
                }
            });
        });

        document.querySelectorAll(".prevBtn").forEach(button => {
            button.addEventListener("click", function () {
                currentQuestionIndex = Math.max(currentQuestionIndex - questionsPerPage, 0);
                showQuestions(currentQuestionIndex);
            });
        });
    }

    // Validate that the user has selected an option for all current questions
    function validateCurrentQuestions() {
        const currentQuestions = Array.from(questions).slice(currentQuestionIndex, currentQuestionIndex + questionsPerPage);
        return currentQuestions.every(question => {
            const currentSelect = question.querySelector("select");
            return currentSelect && currentSelect.value !== "";
        });
    }

    showQuestions(currentQuestionIndex);
    handleNavigationButtons();
});

// Placeholder handling for dropdowns
document.addEventListener("DOMContentLoaded", function () {
    const selects = document.querySelectorAll("select");

    selects.forEach(select => {
        select.addEventListener("focus", function () {
            this.classList.add('hide-placeholder');
        });

        select.addEventListener("blur", function () {
            if (this.value === "") {
                this.classList.remove('hide-placeholder');
            }
        });
    });
});

// Submission handler with validation and progress indication
document.getElementById("surveyForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    document.querySelector('.progress-bar-container').style.display = 'none';


    const dropdowns = document.querySelectorAll('#surveyForm select');
    let allSelected = true;
    let firstEmptyField = null;

    // Iterate over each dropdown to check if any are unselected
    dropdowns.forEach(dropdown => {
        if (dropdown.value === "") {
            allSelected = false;
            if (!firstEmptyField) {
                firstEmptyField = dropdown;
            }
        }
    });

    // If any dropdown is unselected, show an alert and focus on the first unselected dropdown
    if (!allSelected) {
        alert("Please fill out the entire questionnaire before submitting.");
        if (firstEmptyField) {
            firstEmptyField.focus();
        }
        return;
    }

    document.getElementById("disclaimer").style.display = "none";
    document.getElementById("surveyForm").style.display = "none";
    document.getElementById("loading").style.display = "flex";

    // Collect form data
    const formData = {
        age: document.getElementById("age").value,
        exerciseFrequency: document.getElementById("exerciseFrequency").value,
        exerciseType: document.getElementById("exerciseType").value,
        menstrualCycle: document.getElementById("menstrualCycle").value,
        menstrualSymptoms: document.getElementById("menstrualSymptoms").value,
        sexualHealthConcerns: document.getElementById("sexualHealthConcerns").value,
        contraception: document.getElementById("contraception").value,
        dietaryRestrictions: document.getElementById("dietaryRestrictions").value,
        pregnancyPlans: document.getElementById("pregnancyPlans").value,
        stressLevel: document.getElementById("stressLevel").value,
        countryOfOrigin: document.getElementById("countryOfOrigin").value
    };

    try {
        const response = await fetch('https://hkzbacqwx6.execute-api.ap-southeast-2.amazonaws.com/dev/createReport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: JSON.stringify(formData) })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data from Lambda. Status code: " + response.status);
        }

        const rawData = await response.json();

        // Parsing the JSON string inside the 'body' key
        const data = JSON.parse(rawData.body);

        // Clear previous content
        document.getElementById("nutrientAdvice").innerHTML = "";
        document.getElementById("nutrientVideos").innerHTML = "";
        document.getElementById("exerciseAdvice").innerHTML = "";
        document.getElementById("exerciseVideos").innerHTML = "";
        document.getElementById("sexualHealthAdvice").innerHTML = "";

        // Display Nutrient Advice
        if (data.nutrientAdvice) {
            const nutrientAdviceSection = document.getElementById("nutrientAdvice");
            nutrientAdviceSection.innerHTML = formatText(data.nutrientAdvice);

            // Display YouTube recipe videos for nutrient advice
            const youtubeNutrientVideosSection = document.getElementById("nutrientVideos");
            if (data.nutrientVideos && data.nutrientVideos.length > 0) {
                data.nutrientVideos.forEach((video) => {
                    const videoId = video.url.split('v=')[1];
                    const videoElement = document.createElement('div');
                    videoElement.innerHTML = embedYouTubeVideo(videoId);
                    youtubeNutrientVideosSection.appendChild(videoElement);
                });
            }
        }

        // Display Exercise Advice
        if (data.exerciseAdvice) {
            const exerciseAdviceSection = document.getElementById("exerciseAdvice");
            exerciseAdviceSection.innerHTML = formatText(data.exerciseAdvice);

            // Display YouTube exercise videos
            const youtubeExerciseVideosSection = document.getElementById("exerciseVideos");
            if (data.exerciseVideos && data.exerciseVideos.length > 0) {
                data.exerciseVideos.forEach((video) => {
                    const videoId = video.url.split('v=')[1];
                    const videoElement = document.createElement('div');
                    videoElement.innerHTML = embedYouTubeVideo(videoId);
                    youtubeExerciseVideosSection.appendChild(videoElement);
                });
            }
        }

        // Display Sexual Health Advice with radar chart

        if (data.sexualHealthAdvice && data.radarData) {
            const sexualHealthAdviceSection = document.getElementById("sexualHealthAdvice");
            const chartContainer = document.getElementById('chartContainer');
            const canvas = document.getElementById('radarChart');

            // Function to resize the chart
            const resizeChart = () => {
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            };

            // Initial resize
            resizeChart();

            // Create the radar chart using Chart.js
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const chart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: data.radarData.map(item => item.subject),
                        datasets: [{
                            data: data.radarData.map(item => item.A),
                            fill: true,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(255, 99, 132)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        elements: {
                            line: {
                                borderWidth: 3
                            }
                        },
                        scales: {
                            r: {
                                angleLines: {
                                    display: false
                                },
                                suggestedMin: 0,
                                suggestedMax: 10,
                                ticks: {
                                    display: true,
                                    font: {
                                        size: 14
                                    },
                                    color: '#333'
                                },
                                pointLabels: {
                                    font: {
                                        size: 18,
                                        weight: 'bold'
                                    },
                                    color: '#4A2E1C'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: true,
                                bodyFont: {
                                    size: 14
                                }
                            }
                        }
                    }
                });

                // Resize chart when window is resized
                window.addEventListener('resize', () => {
                    resizeChart();
                    chart.update();
                });
            } else {
                console.log("Error creating chart");
            }



            // Display the advice text
            const adviceList = document.createElement('ul');
            data.sexualHealthAdvice.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.category}:</strong> ${item.text}`;
                adviceList.appendChild(li);
            });
            sexualHealthAdviceSection.appendChild(adviceList);
        } else {
            console.warn("Sexual health advice or radar data is missing");
        }

        // Show the result section
        document.getElementById("result").style.display = "block";

    } catch (error) {
        alert("There was an error processing your request. Please try again.");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
});

function formatText(text) {
    // Replace newline characters with <br> tags
    return text.replace(/\n/g, '<br>');
}

function embedYouTubeVideo(videoId) {
    return `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
        </div>`;
}
