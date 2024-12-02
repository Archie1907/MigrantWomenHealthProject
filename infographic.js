window.onload = function () {
    // Add event listeners to the buttons once the page loads
    document.getElementById("btn-menstrual-cycle").addEventListener('click', loadMenstrualCycleImages);
    document.getElementById("btn-safe-sex").addEventListener('click', loadSafeSexImages);
    document.getElementById("btn-sexual-diseases").addEventListener('click', loadSexualDiseasesImages);
    document.getElementById("btn-show-all").addEventListener('click', loadAllImages);
    document.getElementById("btn-show-sources").addEventListener('click', showSources);

    loadAllImages(); // Load all images when the page first loads
};

// Show enlarged image in modal
function openImageModal(imageSrc) {
    var modal = document.createElement("div");
    modal.classList.add("image-modal");

    var imgElement = document.createElement("img");
    imgElement.src = imageSrc;
    imgElement.classList.add("modal-image");

    modal.appendChild(imgElement);
    document.body.appendChild(modal);

    modal.addEventListener('click', function () {
        document.body.removeChild(modal);
    });
}

// Show all image sources and hide the gallery
function showSources() {
    document.getElementById("infographic-gallery").style.display = "none";
    document.getElementById("infographic-sources").style.display = "block";
    var additionalContent = document.getElementById("additional-content");
    additionalContent.innerHTML = ""; // Clear previous additional content
}

// Return to the gallery from the sources view
function returnToGallery() {
    document.getElementById("infographic-sources").style.display = "none";
    document.getElementById("infographic-gallery").style.display = "block";
}

// Load Menstrual Cycle images and add the additional content
function loadMenstrualCycleImages() {
    returnToGallery();

    var imageFolder = "./images/Menstrual Cycle/";
    var largeImages = [
        "Sympotoms of endometriosis.jpg", "Hormonal imbalances.jpg", "About your menstrual cycle.png",
        "Period education.png", "Ovulation Cycle Calendar Infographic.jpg", "WechatIMG210.jpg",
        "Tracking menstrual cycle.jpg", "Phases of your menstrual cycle.png", "Understand period poverty.jpg",
        "Menstruation.jpg", "Phases of menstual cycle.png", "anxiety.jpg",
        "Menstual cycle and fitness.jpg", "cycle phases.jpg", "Menstrual Cycle skin carre.jpg",
        "_.jpeg", "Phases of Menstrual cycle.jpeg", "Cycle Syncing.jpeg", "Cycle Syncing Guide_ 4 Seasons Of You.jpeg",
        "Cycle Syncing Your Workouts_ How to Exercise According to Your Menstrual Cycle.jpeg"
    ];

    // Get the gallery element and reset it
    var gallery = document.getElementById("infographic-gallery");
    gallery.innerHTML = ""; // Clear previous content
    gallery.className = "grid-gallery-layout"; // Apply the correct class

    // Loop through and create each image element
    largeImages.forEach(function (image) {
        createImageElement(imageFolder, image, gallery);
    });

    // Add additional content below the images
    var additionalContent = document.getElementById("additional-content");
    additionalContent.innerHTML = `
        <div class="text-center mt-4">
            <p>Do you want to test your knowledge on menstrual cycles? You can take the
            <a href="quiz.html">Menstrual Cycle Quiz</a>. You can also visit the <a href="cycle.html">Cycle Tracker</a> to track your own menstrual cycle.</p>
        </div>
    `;
}

// Load Safe Sex images
function loadSafeSexImages() {
    returnToGallery(); // Ensure the gallery is visible
    var imageFolder = "./images/Safe Sex/";
    var largeImages = [
        "how to use a male condom.png", "Contraception methods covered by insurance.png", "Myth and True of contraception.jpg",
        "how to use a dental dam.png", "Sexual Consent Signs.jpeg", "Male Contraception.png", "How to put on a condom.jpg",
        "Types of contraception.jpg", "Effectiveness of contraceptions.png", "male contraception methods.png",
        "Get Closer With Barriers - Fenway Health.jpeg", "Contraceptive methods.png", "Existing contraceptive methods.png",
        "How to put on a condom.png", "Safe sex.jpg", "Male contraception myth busting.png", "Use of contraception.jpg",
        "Unprotected Sex And STI Symptoms.jpeg"
    ];

    // Get the gallery element and reset it
    var gallery = document.getElementById("infographic-gallery");
    gallery.innerHTML = "";
    gallery.className = "grid-gallery-layout";

    // Loop through and create each image element
    largeImages.forEach(function (image) {
        createImageElement(imageFolder, image, gallery);
    });

    // Clear additional content since it's not relevant for Safe Sex
    var additionalContent = document.getElementById("additional-content");
    additionalContent.innerHTML = `
        <div class="text-center mt-4">
            <p>Interested in learning more about your sexual and reproductive health? You can generate your 
            <a href="report.html">Personalised Report</a> or if you're pregnant access  
            <a href="maternal.html">Maternal Health Risk</a> to asess your risk.</p>
        </div>
    `;
}

// Load Sexual Diseases images
function loadSexualDiseasesImages() {
    returnToGallery();
    var imageFolder = "./images/Sexual Diseases/";
    var largeImages = [
        "common stds.png", "Protect from HIV.jpg", "Control HIV.png",
        "Sexual Diseases with causes.jpg", "STD Awareness.jpg", "STI and STD facts.png", "Transmission and symptom of AIDS.jpg",
        "Gonorrhea.jpg", "HIV and AIDs Awearness.jpg", "HPV Vaccination.png", "stds-when should i get tested.png",
        "AIDS POSTER.jpeg", "Vector Medical Poster Obesity_ Stock Vector - Illustration of child, obesity_ 156702466.jpeg",
        "HIV and AIDS .jpeg"
    ];

    // Get the gallery element and reset it
    var gallery = document.getElementById("infographic-gallery");
    gallery.innerHTML = "";
    gallery.className = "grid-gallery-layout";

    // Loop through and create each image element
    largeImages.forEach(function (image) {
        createImageElement(imageFolder, image, gallery);
    });

    // Clear additional content since it's not relevant for Sexual Diseases
    var additionalContent = document.getElementById("additional-content");
    additionalContent.innerHTML = `
        <div class="text-center mt-4">
            <p>Interested in learning aboug STI trends in Australia? View our 
            <a href="policy.html">Visualisation</a> page to explore more.</p>
        </div>
    `;
}

// Load all images from all categories into one gallery
function loadAllImages() {
    returnToGallery();
    var gallery = document.getElementById("infographic-gallery");
    gallery.innerHTML = "";
    gallery.className = "grid-gallery-layout";

    var allImages = [
        { folder: "./images/Menstrual Cycle/", images: ["Sympotoms of endometriosis.jpg", "Hormonal imbalances.jpg", "About your menstrual cycle.png", "Period education.png", "Ovulation Cycle Calendar Infographic.jpg", "WechatIMG210.jpg", "Tracking menstrual cycle.jpg", "Phases of your menstrual cycle.png", "Understand period poverty.jpg", "Menstruation.jpg"] },
        { folder: "./images/Safe Sex/", images: ["how to use a male condom.png", "Contraception methods covered by insurance.png", "Myth and True of contraception.jpg", "how to use a dental dam.png", "Sexual Consent Signs.jpeg", "Male Contraception.png", "How to put on a condom.jpg", "Types of contraception.jpg"] },
        { folder: "./images/Sexual Diseases/", images: ["common stds.png", "HIV and AIDS .jpeg", "Protect from HIV.jpg", "Control HIV.png", "Sexual Diseases with causes.jpg", "STD Awareness.jpg", "Vector Medical Poster Obesity_ Stock Vector - Illustration of child, obesity_ 156702466.jpeg", "AIDS POSTER.jpeg"] }
    ];

    // Loop through and create each image element from all categories
    allImages.forEach(function (category) {
        category.images.forEach(function (image) {
            createImageElement(category.folder, image, gallery);
        });
    });

    // Clear additional content since it's not relevant for Show All
    var additionalContent = document.getElementById("additional-content");
    additionalContent.innerHTML = `
        <div class="text-center mt-4">
             <p>Looking to learn more about related policies? Visit our 
            <a href="policy.html">Find Policy</a> page to explore relevant policies and guidelines.</p>
        </div>
    `;
}

// Create image element and append to gallery
function createImageElement(folder, imageName, gallery) {
    var imgElement = document.createElement("img");
    imgElement.src = folder + imageName;
    imgElement.alt = imageName;
    imgElement.classList.add("zoomable");

    var imageDiv = document.createElement("div");
    imageDiv.classList.add("large-image");

    imageDiv.appendChild(imgElement);
    gallery.appendChild(imageDiv);

    imgElement.addEventListener('click', function () {
        openImageModal(this.src);
    });
}



