document.getElementById("serviceSelect").addEventListener("focus", function () {
    const selectElement = document.getElementById('serviceSelect');
    if (selectElement.options[0].disabled) {
        selectElement.remove(0);
    }
});

// Hotline button
const hotlineBtn = document.getElementById('hotlineBtn');
const popupContainer = document.getElementById('popupContainer');
const hotlineNumber = document.getElementById('hotlineNumber');
const serviceSelect = document.getElementById('serviceSelect');
const closePopup = document.getElementById('closePopup');

const hotlines = {

    sti: {
        number: '1300-479-023',
        organisation: 'Stigma Health: STI testing and support'
    },
    lgbtqa: {
        number: '03-5406-1200',
        organisation: 'Bendigo Health Service'
    },
    violence: {
        number: '1800-806-292',
        organisation: '1800Respect'
    },
    general: {
        number: '1800-022-222',
        organisation: 'Health Direct: Nurse on call(VIC)'
    },
    translation: {
        number: '131-450',
        organisation: 'Translating and Interpreting Service (National)'
    }
};


hotlineBtn.addEventListener('click', () => {
    popupContainer.style.display = 'block';
});


serviceSelect.addEventListener('change', () => {
    const selectedService = serviceSelect.value;
    const hotlineInfo = hotlines[selectedService];

    // Display hotline number and organisation
    hotlineNumber.innerHTML = `
        <strong>Hotline:</strong> ${hotlineInfo.number}<br>
        <strong>Organisation:</strong> ${hotlineInfo.organisation}
    `;
});

// Close the popup when the 'X' is clicked
closePopup.addEventListener('click', () => {
    popupContainer.style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function () {


    const translateContainer = document.querySelector('.translate-container');
    if (translateContainer) {
        translateContainer.style.marginLeft = 'auto';

    }
});