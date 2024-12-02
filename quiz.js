document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const nextButton = document.getElementById('next-button');
    const finalFeedback = document.getElementById('final-feedback');
    const assessmentLink = '<a href="report.html">personalised report page</a>';
    const infographicLink = '<a href="infographic.html">infographic page</a>';
    const visualisationLink = '<a href="visualisation.html">visualisation page</a>';

    let currentQuestionIndex = 0;
    const questionsPerPage = 4;

    const quizQuestions = [
        {
            question: "Women with very short or long menstrual cycles may face what health issue?",
            answers: {
                a: "High blood pressure",
                b: "Infertility",
                c: "Heart disease",
                d: "None of the above"
            },
            correctAnswer: "b",
            explanation: "A very short or long menstrual cycle can indicate underlying hormonal imbalances that may affect fertility."
        },
        {
            question: "Women with menstrual cycles longer than 40 days may face what issue?",
            answers: {
                a: "Decreased bone density",
                b: "Ovarian dysfunction",
                c: "Increased insulin levels",
                d: "High cholesterol"
            },
            correctAnswer: "b",
            explanation: "Ovarian dysfunction, such as Polycystic Ovary Syndrome (PCOS), can lead to long menstrual cycles."
        },
        {
            question: "What disease is closely linked to long-term irregular menstrual cycles?",
            answers: {
                a: "Diabetes",
                b: "Hypertension",
                c: "Polycystic ovary syndrome (PCOS)",
                d: "Heart disease"
            },
            correctAnswer: "c",
            explanation: "PCOS is a common condition associated with irregular periods and long-term hormonal imbalances."
        },
        {
            question: "What is the primary risk of long-term irregular menstrual cycles?",
            answers: {
                a: "Diabetes",
                b: "Thyroid dysfunction",
                c: "Kidney failure",
                d: "Infertility"
            },
            correctAnswer: "d",
            explanation: "Long-term irregular cycles often indicate ovulation problems, which can lead to infertility."
        },
        {
            question: "Changes in the menstrual cycle usually indicate changes in what health condition?",
            answers: {
                a: "Hormonal imbalance",
                b: "Fat metabolism changes",
                c: "Blood circulation problems",
                d: "None of the above"
            },
            correctAnswer: "a",
            explanation: "Menstrual cycle changes are commonly linked to hormonal imbalances in the body, such as those involving estrogen and progesterone."
        },
        {
            question: "Which treatment can help regulate the length of menstrual cycles?",
            answers: {
                a: "Hormone therapy",
                b: "Physical therapy",
                c: "Regular exercise",
                d: "Acupuncture"
            },
            correctAnswer: "a",
            explanation: "Hormone therapy is often used to correct hormonal imbalances and regulate menstrual cycles."
        },
        {
            question: "Abnormal menstrual cycle changes can affect a woman's?",
            answers: {
                a: "Blood sugar levels",
                b: "Bone health",
                c: "Fertility",
                d: "None of the above"
            },
            correctAnswer: "c",
            explanation: "Irregular menstrual cycles can impact fertility by disrupting ovulation."
        },
        {
            question: "What could a menstrual cycle shorter than 21 days indicate?",
            answers: {
                a: "High blood pressure",
                b: "Thyroid issues",
                c: "Low blood sugar",
                d: "Hormonal imbalance"
            },
            correctAnswer: "d",
            explanation: "A menstrual cycle shorter than 21 days is often a sign of hormonal imbalances, such as low progesterone levels."
        }
    ];

    function loadQuestions() {
        quizContainer.innerHTML = '';
        let endIndex = Math.min(currentQuestionIndex + questionsPerPage, quizQuestions.length);

        for (let i = currentQuestionIndex; i < endIndex; i++) {
            const currentQuestion = quizQuestions[i];
            const questionCard = document.createElement('div');
            questionCard.classList.add('col-12', 'mb-4');

            let questionHtml = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Question ${i + 1}</h5>
                        <p class="card-text">${currentQuestion.question}</p>
                        <div class="choices">
                            <button class="btn btn-outline-primary" data-answer="a">A) ${currentQuestion.answers.a}</button>
                            <button class="btn btn-outline-primary" data-answer="b">B) ${currentQuestion.answers.b}</button>
                            <button class="btn btn-outline-primary" data-answer="c">C) ${currentQuestion.answers.c}</button>
                            <button class="btn btn-outline-primary" data-answer="d">D) ${currentQuestion.answers.d}</button>
                        </div>
                        <p class="feedback mt-3"></p>
                    </div>
                </div>
            `;

            questionCard.innerHTML = questionHtml;
            quizContainer.appendChild(questionCard);

            const choicesButtons = questionCard.querySelectorAll('.btn-outline-primary');
            choicesButtons.forEach(button => {
                button.addEventListener('click', () => {
                    checkAnswer(i, button.getAttribute('data-answer'), questionCard.querySelector('.feedback'));
                    // 
                    if (i === quizQuestions.length - 1) {
                        checkFinalScore();
                        nextButton.style.display = 'none';
                    }
                });
            });
        }

        nextButton.style.display = endIndex >= quizQuestions.length ? 'none' : 'block';
    }

    function checkAnswer(questionIndex, selectedAnswer, feedbackElement) {
        const currentQuestion = quizQuestions[questionIndex];

        // 
        if (selectedAnswer === currentQuestion.correctAnswer) {
            feedbackElement.innerHTML = `Correct! ${currentQuestion.explanation}`;
            feedbackElement.style.color = "green"; // 
            feedbackElement.style.fontWeight = "bold";
        } else {
            // 
            feedbackElement.innerHTML = `Almost there! The correct answer was ${currentQuestion.answers[currentQuestion.correctAnswer]}. ${currentQuestion.explanation} Keep going, you're doing great!`;
            feedbackElement.style.color = "red"; // 
            feedbackElement.style.fontWeight = "bold";
        }
    }

    // only show the other function no more score 
    function checkFinalScore() {
        finalFeedback.innerHTML = `Quiz finished! Thank you for participating. 
            We recommend you to visit our ${assessmentLink} to learn more about your sexual health. 
            You can also learn more about sexual and reproductive health topics by visiting our ${infographicLink}. 
            Learn about STI data in Australia by visiting our ${visualisationLink}. 
           
            `;
        finalFeedback.classList.add("text-info");
        finalFeedback.style.fontSize = "1.2rem";
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex += questionsPerPage;

        if (currentQuestionIndex >= quizQuestions.length) {
            checkFinalScore();
            nextButton.style.display = 'none';
        } else {
            loadQuestions();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    loadQuestions();
});
