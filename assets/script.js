const totalSteps = 15;
let currentStep = 1;
const cards = Array.from(document.querySelectorAll('.question-card'));
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const quizForm = document.getElementById('quizForm');
const quizSection = document.getElementById('quiz');
const resultSection = document.getElementById('result');
const getConsultation = document.getElementById('getConsultation');
function showStep(step) {
    cards.forEach(card => card.classList.add('hidden'));
    const active = cards.find(card => Number(card.dataset.step) === step);
    if (active) active.classList.remove('hidden');

    progressBar.style.width = `${(step / totalSteps) * 100}%`;
    progressText.textContent = `Вопрос ${step} из ${totalSteps}`;
    prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    nextBtn.textContent = step === totalSteps ? 'Показать результат' : 'Далее';
}

function getStepValue(step) {
    const selected = quizForm.querySelector(`input[name="q${step}"]:checked`);
    return selected ? Number(selected.value) : null;
}

function calculateScore() {
    let score = 0;
    for (let i = 1; i <= totalSteps; i++) {
        const value = getStepValue(i);
        if (value !== null) score += value;
    }
    return score;
}
function showResult(score) {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    const riskBox = document.getElementById('riskBox');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    const riskText = document.getElementById('riskText');
    const meaningText = document.getElementById('meaningText');
    const recommendText = document.getElementById('recommendText');

    if (score <= 3) {
        riskBox.className = 'p-8 border-l-8 bg-white shadow-lg border-green-500';
        resultTitle.textContent = 'Низкий риск';
        resultSubtitle.textContent = 'По вашим ответам признаков системной проблемы немного.';
        riskText.textContent = 'Вероятно, у вас есть базовый порядок, но отдельные операции стоит периодически перепроверять.';
        meaningText.textContent = 'Сейчас у компании не видно явной картины системных ошибок, требующих срочного вмешательства.';
        recommendText.textContent = 'Рекомендуем профилактическую проверку и короткую консультацию по спорным случаям.';
    } else if (score <= 7) {
        riskBox.className = 'p-8 border-l-8 bg-white shadow-lg border-yellow-500';
        resultTitle.textContent = 'Средний риск';
        resultSubtitle.textContent = 'В работе уже есть признаки, которые стоит перепроверить.';
        riskText.textContent = 'Часть операций может потребовать анализа и уточнения порядка действий.';
        meaningText.textContent = 'Есть признаки ошибок в кассовой дисциплине или проблемных ситуаций, которые лучше разобрать до проверки.';
        recommendText.textContent = 'Рекомендуем экспресс-аудит, разбор операций и проверку необходимости чеков коррекции.';
        getConsultation.classList.remove('hidden');
    } else {
        riskBox.className = 'p-8 border-l-8 bg-white shadow-lg border-red-500';
        resultTitle.textContent = 'Высокий риск';
        resultSubtitle.textContent = 'По вашим ответам видно, что компании нужен детальный разбор.';
        riskText.textContent = 'Возможно, уже есть существенные признаки нарушений или ошибок по ККТ.';
        meaningText.textContent = 'Ситуация требует анализа операций, документов и порядка исправления ошибок.';
        recommendText.textContent = 'Рекомендуем срочную консультацию и подготовку плана корректирующих действий.';
        getConsultation.classList.remove('hidden');
    }

    resultSection.scrollIntoView({ behavior: 'smooth' });
}

nextBtn.addEventListener('click', () => {
    const value = getStepValue(currentStep);
    if (value === null) {
        alert('Пожалуйста, выберите ответ.');
        return;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    } else {
        showResult(calculateScore());
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
    }
});

// document.getElementById('leadForm').addEventListener('submit', (e) => {
//     e.preventDefault();
//         alert('Заявка отправлена. Здесь подключается отправка в CRM.');
// });

showStep(currentStep);