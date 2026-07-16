const totalStepsZnak = 12;
let currentStepZnak = 1;

const cardsZnak = Array.from(document.querySelectorAll('.question-card'));
const progressBarZnak= document.getElementById('progressBarZnak');
const progressTextZnak= document.getElementById('progressTextZnak');
const nextBtnZnak= document.getElementById('nextBtnZnak');
const prevBtnZnak = document.getElementById('prevBtnZnak');
const quizFormZnak = document.getElementById('quizFormZnak');
const quizSectionZnak = document.getElementById('quizZnak');
const resultSectionZnak = document.getElementById('resultZnak');
const calculatorSectionZnak = document.getElementById('calculatorZnak');
const calcFormZnak = document.getElementById('calcFormZnak');
const calcBackZnak = document.getElementById('calcBackZnak');
const leadSectionZnak = document.getElementById('leadZnak');

function showStepZnak(step) {
    cardsZnak.forEach(card => card.classList.add('hidden'));
    const active = cardsZnak.find(card => Number(card.dataset.step) === step);
    if (active) active.classList.remove('hidden');

    progressBarZnak.style.width = `${(step / totalStepsZnak) * 100}%`;
    progressTextZnak.textContent = `Вопрос ${step} из ${totalStepsZnak}`;
    prevBtnZnak.style.visibility = step === 1 ? 'hidden' : 'visible';
    nextBtnZnak.textContent = step === totalStepsZnak ? 'Показать результат и стоимость' : 'Далее';
}

function getStepValueZnak(step) {
    const selected = quizFormZnak.querySelector(`input[name="q${step}"]:checked`);
    return selected ? Number(selected.value) : null;
}

function calculateScoreZnak() {
    let score = 0;
    for (let i = 1; i <= totalStepsZnak; i++) {
        const value = getStepValueZnak(i);
        if (value !== null) score += value;
    }
    return score;
}

function showResultZnak(score) {
    quizSectionZnak.classList.add('hidden');

    const riskBoxZnak = document.getElementById('riskBoxZnak');
    const resultTitleZnak = document.getElementById('resultTitleZnak');
    const resultSubtitleZnak = document.getElementById('resultSubtitleZnak');
    const riskTextZnak = document.getElementById('riskTextZnak');
    const meaningTextZnak = document.getElementById('meaningTextZnak');
    const recommendTextZnak = document.getElementById('recommendTextZnak');

    if (score <= 4) {
        riskBoxZnak.className = 'p-8 border-l-8 bg-white shadow-lg border-green-500';
        resultTitleZnak.textContent = 'Вероятность обязательной маркировки низкая';
        resultSubtitleZnak.textContent = 'По вашим ответам не видно явных признаков, что вы обязаны маркировать товары.';
        riskTextZnak.textContent = 'Возможно, ваша деятельность не попадает в обязательные категории или вы не производите/импортируете товары.';
        meaningTextZnak.textContent = 'Вероятно, маркировка не обязательна в вашей ситуации, но стоит периодически проверять, не изменились ли требования.';
        recommendTextZnak.textContent = 'Рекомендуем короткую консультацию, чтобы убедиться, что вы правильно классифицировали свою деятельность.';
    } else if (score <= 8) {
        riskBoxZnak.className = 'p-8 border-l-8 bg-white shadow-lg border-yellow-500';
        resultTitleZnak.textContent = 'Вероятность обязательной маркировки средняя';
        resultSubtitleZnak.textContent = 'По вашим ответам есть признаки, что вы можете попадать в обязательную маркировку.';
        riskTextZnak.textContent = 'Возможно, часть товаров уже должна быть маркирована, а вы этого не реализовали.';
        meaningTextZnak.textContent = 'Стоит провести детальный разбор вашей деятельности и категорий товаров, чтобы понять степень риска.';
        recommendTextZnak.textContent = 'Рекомендуем консультацию по категориям маркировки и первому шагу в системе «Честный знак».';
    } else {
        riskBoxZnak.className = 'p-8 border-l-8 bg-white shadow-lg border-red-500';
        resultTitleZnak.textContent = 'Вероятность обязательной маркировки высокая';
        resultSubtitleZnak.textContent = 'По вашим ответам видно, что вы, скорее всего, обязаны маркировать товары.';
        riskTextZnak.textContent = 'Ситуация может требовать работы с документами, процессами и интеграциями в систему маркировки.';
        meaningTextZnak.textContent = 'Ваша деятельность, скорее всего, попадает в обязательную маркировку, и отсутствие маркировки может создать риски.';
        recommendTextZnak.textContent = 'Рекомендуем срочную консультацию и планирование процессов маркировки, чтобы избежать штрафов и проблем.';
    }

    resultSectionZnak.classList.remove('hidden');
    calculatorSectionZnak.classList.remove('hidden');
    resultSectionZnak.scrollIntoView({ behavior: 'smooth' });
}

nextBtnZnak.addEventListener('click', () => {
    const value = getStepValueZnak(currentStepZnak);
    if (value === null) {
        alert('Пожалуйста, выберите ответ.');
        return;
    }

    if (currentStepZnak < totalStepsZnak) {
        currentStepZnak++;
        showStepZnak(currentStepZnak);
    } else {
        showResultZnak(calculateScoreZnak());
        calcCalculatorZnak();
    }
});

prevBtnZnak.addEventListener('click', () => {
    if (currentStepZnak > 1) {
        currentStepZnak--;
        showStepZnak(currentStepZnak);
    }
});

calcBackZnak.addEventListener('click', () => {
    calculatorSectionZnak.classList.add('hidden');
    quizSectionZnak.classList.remove('hidden');
    resultZnak.classList.add('hidden')
});

function calcCalculatorZnak() {
    const volume = calcFormZnak.querySelector('input[name="volume"]:checked');
    const activity = calcFormZnak.querySelector('input[name="activity"]:checked');
    const channels = calcFormZnak.querySelector('input[name="channels"]:checked');
    const int = calcFormZnak.querySelector('input[name="int"]:checked');
    const train = calcFormZnak.querySelector('input[name="train"]:checked');
    const totalPriceEl = document.getElementById('totalPriceZnak');

    if (!volume || !activity || !channels || !int || !train) {
        totalPriceEl.textContent = '0 ₽';
        return;
    }

    const base = 30000;
    const volMult = Number(volume.value);
    const actMult = Number(activity.value);
    const chanMult = Number(channels.value);
    const intCost = Number(int.value) ? 35000 : 0;
    const trainCost = Number(train.value) ? 10000 : 0;

    const total = (base * volMult * actMult * chanMult) + intCost + trainCost;
    totalPriceEl.textContent = `${Math.round(total)} ₽`;
}

calcFormZnak.addEventListener('change', calcCalculatorZnak);

showStepZnak(currentStepZnak);