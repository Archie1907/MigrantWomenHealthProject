document.querySelector('.dropdown-button').addEventListener('click', function () {
    const dropdownMenu = document.querySelector('.mini-dropdown-menu');
    dropdownMenu.classList.toggle('active');
});

// Hide dropdown when a topic is selected
document.querySelectorAll('.dropdown-content a').forEach(function (link) {
    link.addEventListener('click', function () {
        const dropdownMenu = document.querySelector('.mini-dropdown-menu');
        dropdownMenu.classList.remove('active'); // Hide the dropdown
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.dropdown-content a');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            const topic = event.target.getAttribute('data-value');

            // Clear any previous content in #additional-content
            const additionalContent = document.getElementById('additional-content');
            additionalContent.innerHTML = ''; // Clear content

            // Check if the clicked link is "Sexual and Reproductive Health"
            if (topic === 'Sexual and Reproductive Health') {
                additionalContent.innerHTML = `
                    <div class="text-center mt-4">
                        <p>Learn more about sexual and reproductive health through our 
                        <a href="infographic.html">Infographics page</a></p>
                    </div>
                `;
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const dropdownItems = document.querySelectorAll('.dropdown-content a');
    const dropdownButton = document.querySelector('.dropdown-button');
    const resultsContainer = document.getElementById('search-results');
    let selectedTopic = '';

    // Function to display the policies
    function displayPolicies(data) {
        resultsContainer.innerHTML = ''; // Clear any previous results

        if (data.statusCode === 200) {
            const policies = JSON.parse(data.body);

            policies.forEach(policy => {
                const policyBox = document.createElement('div');
                policyBox.classList.add('policy-box');

                const title = document.createElement('h3');
                title.textContent = policy.Title;

                const description = document.createElement('p');
                description.textContent = policy.Des;

                const link = document.createElement('a');
                link.href = policy.Link;
                link.textContent = 'Learn More';
                link.target = '_blank'; // Open the link in a new tab

                policyBox.appendChild(title);
                policyBox.appendChild(description);
                policyBox.appendChild(link);

                resultsContainer.appendChild(policyBox);
            });
        } else if (data.statusCode === 204) {
            const message = JSON.parse(data.body).message;
            resultsContainer.innerHTML = `<p>${message}</p>`;
        } else {
            resultsContainer.innerHTML = `<p>Error processing request, please check back later.</p>`;
        }
    }

    // Event listener for the topic dropdown selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            selectedTopic = this.getAttribute('data-value');
            dropdownButton.innerText = this.textContent; // Update dropdown button text with selected item

            if (!selectedTopic) {
                alert('Please select a topic.');
                return;
            }

            // Clear results before showing topic-based results
            resultsContainer.innerHTML = '';

            const requestBody = {
                body: JSON.stringify({ topic: selectedTopic })
            };

            // Send the selected topic to the Lambda function
            fetch('https://hkzbacqwx6.execute-api.ap-southeast-2.amazonaws.com/dev/showPolicies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(data => {
                    displayPolicies(data);
                })
                .catch(error => {
                    resultsContainer.innerHTML = `<p>Error processing request, please check back later.</p>`;
                });
        });
    });

    // Event listener for the search button click
    searchButton.addEventListener('click', function () {
        const keyword = searchInput.value.trim();

        if (!keyword) {
            alert('Please enter a keyword before searching.');
            return;
        }

        // Clear results before making a new search
        resultsContainer.innerHTML = '';

        const requestBody = {
            keyword: keyword
        };


        // Send the keyword and topic to the Lambda function
        fetch('https://hkzbacqwx6.execute-api.ap-southeast-2.amazonaws.com/dev/policyfinder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                displayPolicies(data);
            })
            .catch(error => {
                resultsContainer.innerHTML = `<p>Error processing request, please check back later.</p>`;
            });
    });
});


