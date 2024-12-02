// Disclaimer 
document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById('disclaimermatPopup');

    if (!localStorage.getItem('usermatAgreed')) {
        popup.style.display = 'flex';
    }

    document.getElementById('agreematBtn').addEventListener('click', function () {
        localStorage.setItem('usermatAgreed', 'true');
        popup.style.display = 'none';
    });

    document.getElementById('disagreematBtn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});

document.querySelectorAll('.info-icon').forEach(function (icon) {
    icon.addEventListener('mouseover', function () {
        const tooltip = this.querySelector('::after');
        if (tooltip) {
            let rect = tooltip.getBoundingClientRect();
            if (rect.left < 0) {
                tooltip.style.left = '0px';
                tooltip.style.transform = 'translateX(0%)';
            } else if (rect.right > window.innerWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '0px';
                tooltip.style.transform = 'translateX(0%)';
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const bodyTempInput = document.getElementById('bodyTemp');
    const bodyTempIcon = document.querySelector('.body-temp-icon');

    bodyTempInput.addEventListener('input', function () {
        const celsius = parseFloat(this.value);
        if (!isNaN(celsius)) {
            const fahrenheit = (celsius * 9 / 5 + 32).toFixed(1);
            bodyTempIcon.setAttribute('data-tooltip', `${celsius}°C is equivalent to ${fahrenheit}°F`);
        } else {
            bodyTempIcon.setAttribute('data-tooltip', 'Enter your body temperature to see the equivalent in F');
        }
    });
});





// Display error messages
document.getElementById('healthForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the default form submission

    // Clear all previous error messages
    document.querySelectorAll('.error-message').forEach(function (el) {
        el.textContent = '';
    });

    let formIsValid = true;

    // Validate age
    const age = document.getElementById('age');
    if (age.value === '' || age.value < 16 || age.value > 50) {
        document.getElementById('ageError').textContent = 'Please enter a valid age between 16 and 50.';
        formIsValid = false;
    }

    // Validate systolic blood pressure
    const systolicBP = document.getElementById('systolicBP');
    if (systolicBP.value === '' || systolicBP.value < 70 || systolicBP.value > 160) {
        document.getElementById('systolicBPError').textContent = 'Please enter a valid systolic blood pressure between 70 and 160.';
        formIsValid = false;
    }

    // Validate diastolic blood pressure
    const diastolicBP = document.getElementById('diastolicBP');
    if (diastolicBP.value === '' || diastolicBP.value < 49 || diastolicBP.value > 100) {
        document.getElementById('diastolicBPError').textContent = 'Please enter a valid diastolic blood pressure between 49 and 100.';
        formIsValid = false;
    }

    // Validate blood sugar
    const bs = document.getElementById('bs');
    if (bs.value === '' || bs.value < 6.0 || bs.value > 19.0) {
        document.getElementById('bsError').textContent = 'Please enter a valid blood sugar level between 6.0 and 19.0.';
        formIsValid = false;
    }

    // Validate body temperature
    const bodyTemp = document.getElementById('bodyTemp');
    if (bodyTemp.value === '' || bodyTemp.value < 36.1 || bodyTemp.value > 38) {
        document.getElementById('bodyTempError').textContent = 'Please enter a valid body temperature between 36.1 and 38°C.';
        formIsValid = false;
    }

    // Validate heart rate
    const heartRate = document.getElementById('heartRate');
    if (heartRate.value === '' || heartRate.value < 60 || heartRate.value > 100) {
        document.getElementById('heartRateError').textContent = 'Please enter a valid heart rate between 60 and 100.';
        formIsValid = false;
    }
});

const form = document.getElementById('healthForm');
const resultDiv = document.getElementById('result');
const adviceDiv = document.getElementById('advice');
const description = document.querySelector('.maternal-description');
const resultAdviceContainer = document.getElementById('result-advice-container');
const redirectInfo = document.getElementById('redirectInfo');
const loadingSpinner = document.getElementById('loading');

const API_URL = 'https://hkzbacqwx6.execute-api.ap-southeast-2.amazonaws.com/dev/pregnancyAssessment';

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Hide the form and description
    form.style.display = 'none';
    description.style.display = 'none';

    // Show the spinner and ensure it stays visible for at least 4 seconds
    loadingSpinner.style.display = 'flex';
    resultAdviceContainer.style.display = 'none';  // Hide results initially

    const startTime = new Date().getTime();  // Record the start time

    // Gather form data
    const formData = {
        age: document.getElementById('age').value.trim(),
        systolicBP: document.getElementById('systolicBP').value.trim(),
        diastolicBP: document.getElementById('diastolicBP').value.trim(),
        bs: document.getElementById('bs').value.trim(),
        bodyTemp: document.getElementById('bodyTemp').value.trim(),
        heartRate: document.getElementById('heartRate').value.trim()
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    };

    // Send POST request to the API Gateway
    fetch(API_URL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const responseBody = JSON.parse(data.body);
            const risk = responseBody.risk;
            let advice = '';

            // Icon styles based on risk level
            let iconHtml = '';
            if (risk === 'low risk') {
                iconHtml = `<i class="fas fa-exclamation-circle" style="color: #FFD700;"></i>`;
            } else if (risk === 'mid risk') {
                iconHtml = `<i class="fas fa-exclamation-circle" style="color: orange;"></i>`;
            } else if (risk === 'high risk') {
                iconHtml = `<i class="fas fa-exclamation-circle" style="color: red;"></i>`;
            }

            // Show the risk level in resultDiv
            if (risk === 'mid risk') {
                resultDiv.innerHTML = `<h2>Risk Prediction: ${iconHtml} medium risk</h2>`;
            } else {
                resultDiv.innerHTML = `<h2>Risk Prediction: ${iconHtml} ${risk}</h2>`;
            }

            // Add specific advice based on the risk level
            if (risk === 'low risk') {
                advice += `<p>Your body temperature is slightly elevated, which can be a normal response during pregnancy due to hormonal changes and increased blood flow. Here are some practical steps:</p>`;
                advice += `<p>1. Stay Hydrated: Drink plenty of water to help regulate your body temperature and prevent dehydration.</p>`;
                advice += `<p>2. Wear Light Clothing: Opt for breathable, lightweight fabrics to keep cool.</p>`;
                advice += `<p>3. Rest: Ensure you're getting enough rest, as overexertion can increase body temperature.</p>`;
                advice += `<p>4. Monitor Regularly: Check your temperature at different times of the day.</p>`;
            } else if (risk === 'mid risk') {
                advice += `<p>Your risk level is medium. It's important to take extra care during this time and closely monitor your health. Here are some key steps to follow:</p>`;
                advice += `<p>1. Attend Regular Prenatal Check-ups: Make sure to attend all scheduled prenatal appointments, and consider discussing with your healthcare provider whether more frequent check-ups might be necessary for closer monitoring.</p>`;
                advice += `<p>2. Stay Active: Engage in light to moderate exercise, as recommended by your doctor, to maintain overall health.</p>`;
                advice += `<p>3. Watch for Symptoms: Keep an eye on any unusual symptoms, such as excessive swelling, headaches, vision changes, or abnormal pain, and report them to your doctor immediately.</p>`;
                advice += `<p>4. Maintain a Balanced Diet: Eating a nutritious diet rich in fruits, vegetables, lean proteins, and whole grains is vital to support your baby's development.</p>`;
                advice += `<p>5. Rest Adequately: Ensure you're getting plenty of rest.</p>`;
                advice += `<p>6. Manage Stress: Practice relaxation techniques like deep breathing, meditation, or prenatal massages.</p>`;
            } else if (risk === 'high risk') {
                advice += `<p>Your risk level is high. It is crucial to consult with your healthcare provider immediately for a comprehensive evaluation and personalized care plan.</p>`;
                advice += `<p>1. Immediate Medical Consultation: Contact your healthcare provider right away.</p>`;
                advice += `<p>2. Frequent Prenatal Visits: You will likely need more frequent prenatal visits.</p>`;
                advice += `<p>3. Monitor Symptoms Closely: Keep a close watch on any symptoms.</p>`;
                advice += `<p>4. Follow a Tailored Care Plan: Follow your doctor's care plan closely.</p>`;
                advice += `<p>5. Rest and Manage Stress: High-risk pregnancies often require extra rest.</p>`;
                advice += `<p>6. Stay Hydrated: Drink plenty of water to stay hydrated.</p>`;
            }

            // Display advice
            adviceDiv.innerHTML = advice;

            // Calculate how long the process took
            const endTime = new Date().getTime();
            const processTime = endTime - startTime;

            const minimumTime = 2000;
            const remainingTime = minimumTime - processTime;

            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                resultAdviceContainer.style.display = 'block';
                resultDiv.style.display = 'block';
                adviceDiv.style.display = 'block';
                redirectInfo.style.display = 'block';
            }, remainingTime > 0 ? remainingTime : 0);

        })
        .catch(error => {
            // Hide the spinner and show the error message if something goes wrong
            loadingSpinner.style.display = 'none';
            resultDiv.innerHTML = `<h2>Error making prediction. Please try again.</h2>`;
            resultAdviceContainer.style.display = 'block';
            resultDiv.style.display = 'block';
        });
});
