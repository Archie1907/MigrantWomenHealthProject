// Bold the nav link where user is active
document.addEventListener('DOMContentLoaded', () => {

    const currentPath = window.location.pathname.split('/').pop();

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active-link');
        }
    });
});


// Adding Google translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

function applyLanguage(lang) {
    if (lang && lang !== 'en') {
        var intervalId = setInterval(function () {
            if (google.translate && google.translate.TranslateElement) {
                new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
                var select = document.querySelector('select.goog-te-combo');
                if (select) {
                    select.value = lang;
                    select.dispatchEvent(new Event('change'));
                    clearInterval(intervalId);
                }
            }
        }, 100);

        // Clear interval after 5 seconds to prevent infinite loop
        setTimeout(function () { clearInterval(intervalId); }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const languageSelector = document.getElementById('language-selector');
    const translateContainer = document.querySelector('.translate-container');

    if (languageSelector && translateContainer) {
        languageSelector.addEventListener('click', function (e) {
            e.preventDefault();
            languageSelector.style.display = 'none';
            translateContainer.style.display = 'inline-block';
        });

        // Hide translate container when clicking outside
        document.addEventListener('click', function (e) {
            if (!translateContainer.contains(e.target) && e.target !== languageSelector) {
                translateContainer.style.display = 'none';
                languageSelector.style.display = 'inline-block';
            }
        });
    }

    // Apply saved language
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        applyLanguage(savedLang);
    }

    // Observer to detect language changes
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                const selectElement = document.querySelector('.goog-te-combo');
                if (selectElement) {
                    const selectedLang = selectElement.value;
                    if (selectedLang && selectedLang !== localStorage.getItem('selectedLanguage')) {
                        localStorage.setItem('selectedLanguage', selectedLang);
                    }
                }
            }
        });
    });

    // Start observing once Google Translate is loaded
    var checkGoogleTranslate = setInterval(function () {
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
            observer.observe(selectElement, { childList: true, subtree: true });
            clearInterval(checkGoogleTranslate);
        }
    }, 100);
});

// Ensure language is applied even after Google Translate script loads
window.addEventListener('load', function () {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        applyLanguage(savedLang);
    }
});