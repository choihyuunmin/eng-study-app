document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const submitBtn = document.getElementById('submit-btn');
    const partSelect = document.getElementById('part-select');
    const levelSelect = document.getElementById('level-select');
    const loading = document.getElementById('loading');
    const quizArea = document.getElementById('quiz-area');
    const questionContainer = document.getElementById('question-container');
    const part7Passage = document.getElementById('part7-passage');
    const explanationContainer = document.getElementById('explanation-container');
    const explanation = document.getElementById('explanation');

    let currentQuestions = [];
    let currentAnswers = {};

    startBtn.addEventListener('click', getQuestion);
    submitBtn.addEventListener('click', checkAnswer);

    async function getQuestion() {
        const part = partSelect.value;
        const level = levelSelect.value;

        loading.style.display = 'block';
        quizArea.style.display = 'none';
        submitBtn.style.display = 'none';
        explanationContainer.style.display = 'none';
        part7Passage.style.display = 'none';
        questionContainer.innerHTML = '';
        part7Passage.innerHTML = '';

        try {
            const response = await fetch('http://127.0.0.1:5000/get_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ part, level }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            if (part === '7') {
                displayPart7(data);
            } else {
                displayPart5or6(data);
            }

        } catch (error) {
            console.error("Error fetching question:", error);
            questionContainer.innerHTML = "Failed to load question. Please try again.";
        } finally {
            loading.style.display = 'none';
            quizArea.style.display = 'block';
            submitBtn.style.display = 'block';
        }
    }

    function displayPart5or6(data) {
        currentQuestions = [data];
        currentAnswers = { 0: data.answer };
        const questionHtml = createQuestionHtml(data, 0);
        questionContainer.innerHTML = questionHtml;
    }

    function displayPart7(data) {
        part7Passage.innerHTML = `<p>${data.passage.replace(/\n/g, '<br>')}</p>`;
        part7Passage.style.display = 'block';
        currentQuestions = data.questions;
        let questionsHtml = '';
        data.questions.forEach((q, index) => {
            currentAnswers[index] = q.answer;
            questionsHtml += createQuestionHtml(q, index);
        });
        questionContainer.innerHTML = questionsHtml;
    }

    function createQuestionHtml(questionData, index) {
        let optionsHtml = '';
        for (const [key, value] of Object.entries(questionData.options)) {
            optionsHtml += `
                <label>
                    <input type="radio" name="question-${index}" value="${key}">
                    ${key}. ${value}
                </label><br>
            `;
        }
        
        // 문제 텍스트의 줄바꿈을 HTML <br> 태그로 변환
        const formattedQuestion = questionData.question.replace(/\n/g, '<br>');
        
        // 이메일이나 문서 형태인지 확인 (줄바꿈이 많거나 특정 키워드가 있는 경우)
        const isDocumentStyle = questionData.question.includes('\n') || 
                               questionData.question.toLowerCase().includes('to:') ||
                               questionData.question.toLowerCase().includes('from:') ||
                               questionData.question.toLowerCase().includes('subject:');
        
        const questionClass = isDocumentStyle ? 'question-text document-style' : 'question-text';
        
        return `
            <div class="question-block" data-question-index="${index}">
                <p class="${questionClass}">${index + 1}. ${formattedQuestion}</p>
                <div class="options">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }

    function checkAnswer() {
        let allCorrect = true;
        let explanationsHtml = '';

        currentQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            const questionBlock = document.querySelector(`.question-block[data-question-index="${index}"]`);
            const labels = questionBlock.querySelectorAll('label');

            if (selectedOption) {
                const userAnswer = selectedOption.value;
                const correctAnswer = currentAnswers[index];
                
                labels.forEach(label => {
                    const input = label.querySelector('input');
                    if(input.value === correctAnswer) {
                        label.classList.add('correct');
                    } else if (input.checked) {
                        label.classList.add('incorrect');
                    }
                    input.disabled = true;
                });

                if (userAnswer !== correctAnswer) {
                    allCorrect = false;
                }
                explanationsHtml += `<p><b>Question ${index + 1}:</b> ${q.explanation}</p>`;
            } else {
                allCorrect = false;
                explanationsHtml += `<p><b>Question ${index + 1}:</b> Please select an answer.</p>`;
            }
        });

        explanation.innerHTML = explanationsHtml;
        explanationContainer.style.display = 'block';
        submitBtn.style.display = 'none';
    }
});
