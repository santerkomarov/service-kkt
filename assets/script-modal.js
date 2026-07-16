// Получаем необходимые элементы DOM
    const modal = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModalBtn');
    const openButtons = document.querySelectorAll('.open-modal-btn'); // Селектор для ВСЕХ кнопок вызова
    const sourceInput = document.getElementById('modalSourceInput');
    const modalForm = document.getElementById('modalForm');
    const submitBtn = document.getElementById('submitModalBtn');
    const contentWrapper = document.getElementById('modalContentWrapper');

    // Сохраняем исходный HTML формы, чтобы восстановить окно при повторном открытии
    const originalModalHTML = contentWrapper.innerHTML;

    // === ЛОГИКА УПРАВЛЕНИЯ ОКНОМ ===
    
    // Функция открытия окна
const openModal = (event) => {
      // Получаем кнопку, на которую кликнули
    const clickedButton = event.currentTarget;

    // Считываем данные из data-атрибутов (если они есть, иначе ставим 'unknown')
    const pageSource = clickedButton ? clickedButton.getAttribute('data-page') : 'unknown';
    const btnSource = clickedButton ? clickedButton.getAttribute('data-btn-id') : 'unknown';



    contentWrapper.innerHTML = originalModalHTML;
    rebindFormSubmit();

      // Записываем динамические данные в скрытые инпуты
    document.getElementById('modalSourcePage').value = pageSource;
    document.getElementById('modalSourceBtn').value = btnSource;

     // 2. И только СЕЙЧАС инициализируем маску на открытом инпуте
    const phoneInput = document.getElementById('phone');

    if (phoneInput && !phoneInput.classList.contains('js-mask-init')) {
    // 1. Создаем маску и сохраняем её в переменную maskInstance
    const maskInstance = IMask(phoneInput, {
        mask: '{8} (000) 000-00-00', 
        lazy: true,
        prepare: function (str, masked) {
            if (str === '7' && masked.value === '') return '8';
            return str;
        }
    });

    // 2. ЯВНО привязываем маску к самому инпуту
    phoneInput.imask = maskInstance; 
    phoneInput.focus();
    phoneInput.classList.add('js-mask-init');
}

    const button = event.currentTarget;
    const source = button.getAttribute('data-from') || 'unknown';
    
    const currentSourceInput = document.getElementById('modalSourceInput');
    if (currentSourceInput) {
        currentSourceInput.value = source;
    }

    if (typeof ym !== 'undefined') {
        ym(12345678, 'reachGoal', 'click_open_modal', { placement: source });
    }

     // ВЫЧИСЛЯЕМ И ПРИМЕНЯЕМ КОМПЕНСАЦИЮ СДВИГА
    // const scrollbarWidth = getScrollbarWidth();
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // БЛОКИРОВКА СКРОЛЛА
    document.body.classList.add('overflow-hidden');

    // ПЛАВНОЕ ПРОЯВЛЕНИЕ: Переключаем классы видимости
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');
};


    // Функция закрытия окна
const closeModal = () => {
    // СБРОС БЛОКИРОВКИ СКРОЛЛА
    document.body.classList.remove('overflow-hidden');

     // СБРОС КОМПЕНСАЦИИ: возвращаем исходный отступ body через 300мс (после окончания анимации)
    
    document.body.style.paddingRight = '';
    
    // ПЛАВНОЕ ИСЧЕЗНОВЕНИЕ: Возвращаем исходные классы
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
};

// Функция для точного расчета ширины скроллбара в браузере пользователя
// const getScrollbarWidth = () => {
//     return window.innerWidth - document.documentElement.clientWidth;
// };


// Привязка клика ко всем кнопкам
openButtons.forEach(button => button.addEventListener('click', openModal));
closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
});

// Проверка нажатия Escape с учетом новой логики (проверяем класс opacity-100)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('opacity-100')) closeModal();
});

document.addEventListener('DOMContentLoaded', () => {

});

    // === ЛОГИКА AJAX-ОТПРАВКИ (FETCH) ===
    
function rebindFormSubmitOrigin() {
    const currentForm = document.getElementById('modalForm');
    const currentSubmitBtn = document.getElementById('submitModalBtn');
    
    if (!currentForm) return;

    currentForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Отменяем перезагрузку страницы

        // Блокируем кнопку отправки (защита от повторных кликов)
        currentSubmitBtn.disabled = true;
        const originalBtnText = currentSubmitBtn.textContent;
        currentSubmitBtn.textContent = 'Отправка...';
        currentSubmitBtn.classList.add('opacity-50', 'cursor-not-allowed');

        // Автоматически собираем все данные полей формы
        const formData = new FormData(currentForm);

        try {
            // Выполняем AJAX-запрос на сервер (сейчас указана заглушка 'send.php')
            const response = await fetch('send.php', {
                method: 'POST',
                body: formData
            });

            // Имитация успешного ответа сервера (Заглушка для тестов)
            // Если файла send.php пока нет, мы искусственно пропускаем шаг для демонстрации успеха
            if (response.ok || response.status === 404) { 
                
                // Фиксируем цель успешного лида в Яндекс.Метрике
                if (typeof ym !== 'undefined') {
                    ym(12345678, 'reachGoal', 'lead_success_submit');
                } else {
                    console.log('[Яндекс.Метрика] Цель: lead_success_submit (Форма успешно отправлена)');
                }

                // Красивый вывод сообщения об успехе прямо внутри окна
                contentWrapper.innerHTML = `
                    <div class="text-center py-8">
                        <div class="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4">✓</div>
                        <h4 class="text-xl font-bold text-gray-900">Заявка принята!</h4>
                        <p class="text-gray-500 text-sm mt-2 leading-relaxed">Наш эксперт уже изучает вашу проблему. Мы свяжемся с вами в течение 15 минут.</p>
                        <button onclick="closeModal()" type="button" class="mt-6 inline-block bg-gray-900 hover:bg-gray-800 text-white font-medium px-5 py-2.5 text-sm rounded-xl transition shadow-sm focus:outline-none">
                            Закрыть окно
                        </button>
                    </div>
                `;
            } else {
                throw new Error('Ошибка сервера');
            }

        } catch (error) {
            // Если произошел сбой сети или сервера — возвращаем кнопку в исходное состояние
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
            currentSubmitBtn.disabled = false;
            currentSubmitBtn.textContent = originalBtnText;
            currentSubmitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            console.error('Ошибка fetch:', error);
        }
    });
}
const rebindFormSubmit = () => {
    const form = document.getElementById('modalForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => { // Добавили async
        event.preventDefault();

        const phoneInput = document.getElementById('phone');
        const policyCheckbox = document.getElementById('policy');
        const phoneError = document.getElementById('phoneError');
        const policyError = document.getElementById('policyError');
        
        // Элементы управления лоадером и кнопкой
        const submitBtn = document.getElementById('submitModalBtn');
        const btnLoader = document.getElementById('btnLoader');
        const btnText = document.getElementById('btnText');
        const serverErrorBlock = document.getElementById('serverErrorBlock');

        const phoneMask = phoneInput ? phoneInput.imask : null; 

        // let isPhoneValid = phoneMask && phoneMask.masked.isComplete;
        // let isPolicyValid = policyCheckbox && policyCheckbox.checked;

        // Безопасно определяем валидность (без риска уронить скрипт)
        let isPhoneValid = false;
        if (phoneMask && phoneMask.masked) {
            isPhoneValid = phoneMask.masked.isComplete;
        }
        
        let isPolicyValid = policyCheckbox && policyCheckbox.checked;        
        console.log(phoneMask.masked.isComplete);
        // Визуальное отображение ошибок валидации (как в прошлых шагах)
        if (isPhoneValid) {
            if (phoneError) phoneError.classList.add('hidden');
            phoneInput.classList.remove('border-red-500', 'focus:ring-red-500');
        } else {
            if (phoneError) phoneError.classList.remove('hidden');
            phoneInput.classList.add('border-red-500', 'focus:ring-red-500');
        }

        if (isPolicyValid) {
            if (policyError) policyError.classList.add('hidden');
        } else {
            if (policyError) policyError.classList.remove('hidden');
        }

        // ЕСЛИ ВАЛИДАЦИЯ ПРОЙДЕНА -> Начинаем отправку
        if (isPhoneValid && isPolicyValid) {
            if (serverErrorBlock) serverErrorBlock.classList.add('hidden'); // прячем старые ошибки сервера

            // 1. Включаем лоадер и блокируем кнопку от повторных кликов
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            btnLoader.classList.remove('hidden');
            btnText.textContent = 'Отправка...';

            // Внутри обработчика отправки формы (submit) соберите объект formData:
            const formData = {
                userName: form.elements['user_name'].value,
                rawPhone: phoneMask.unmaskedValue,
                sourcePage: document.getElementById('modalSourcePage').value,  // Откуда пришел (страница)
                sourceButton: document.getElementById('modalSourceBtn').value  // Какую кнопку нажал
            };

            console.log('Данные для записи в БД:', formData);

            try {
                // 2. Имитируем или делаем реальный запрос к вашему API handler
                // const response = await fetch('/api/send-lead.php', { // Замените путь на ваш рабочий URL
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(formData)
                // });

                // if (response.ok) {
                //     // 3. Успех: полностью стираем форму и рисуем экран "Спасибо"
                //     contentWrapper.innerHTML = successModalHTML;
                // } else {
                //     // Сервер ответил ошибкой (например, 500 или 404)
                //     throw new Error('Ошибка сервера');
                // }

                 // Браузер подождет 1.5 секунды, изображая работу сервера, и пойдет дальше
                await new Promise(resolve => setTimeout(resolve, 2500));

                // 3. Успех: полностью стираем форму и рисуем экран "Спасибо"
                contentWrapper.innerHTML = successModalHTML;

            } catch (error) {
                console.error('Ошибка при отправке формы:', error);
                
                // 4. Сбой: показываем ошибку пользователю и возвращаем кнопку в исходное состояние
                if (serverErrorBlock) serverErrorBlock.classList.remove('hidden');
                
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                btnLoader.classList.add('hidden');
                btnText.textContent = 'Отправить заявку';
            }
        }

        if (phoneInput) {
            // Событие 'input' срабатывает при каждом нажатии клавиши или изменении текста в поле телефона
            phoneInput.addEventListener('input', () => {
                // Убираем красную рамку и скрываем текст ошибки
                phoneError.classList.add('hidden');
                phoneInput.classList.remove('border-red-500', 'focus:ring-red-500');
            });
        }

        if (policyCheckbox) {
            // Событие 'change' срабатывает, когда пользователь кликает по чекбоксу
            policyCheckbox.addEventListener('change', () => {
                // Если чекбокс стал выбранным, скрываем текст ошибки
                if (policyCheckbox.checked) {
                    policyError.classList.add('hidden');
                }
            });
        }
    });
};

const successModalHTML = `
<div id="modalContentWrapper" class="text-center py-6 flex flex-col items-center">
    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4 text-green-600">
        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    </div>
    <h3 class="text-2xl font-bold text-gray-900 tracking-tight">Заявка принята!</h3>
    <p class="text-gray-500 text-base mt-4 max-w-sm mx-auto">
        Спасибо за доверие. Мы свяжемся с Вами в самое ближайшее время. 
        <br>Режим обратного звонка: <b>08:00 - 18:00 (Мск)</b>.
        
    </p>
    <button onclick="closeModal()" class="btn-success inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 my-8 rounded-lg transition">
        Закрыть окно
    </button>
</div>
`;
