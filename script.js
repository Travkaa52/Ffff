// 1. Настройки
const SECRET_WORD = "окак"; 

// 2. Автоматический вход и инициализация уведомлений
window.addEventListener('load', () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        unlockApp(); 
    }
    
    // Регистрация сервис-воркера для уведомлений
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log("Почтальон любви готов! ✨"))
            .catch(err => console.error("Ошибка SW:", err));
    }
});

// 3. Функция проверки пароля
function checkPassword() {
    const passwordInput = document.getElementById("password");
    const error = document.getElementById("error-message");
    
    if (!passwordInput) return;

    const pass = passwordInput.value.toLowerCase().trim();

    if (pass === SECRET_WORD) {
        localStorage.setItem("isLoggedIn", "true");
        if (navigator.vibrate) navigator.vibrate(50);
        unlockApp();
    } else {
        if (error) {
            error.innerText = "Ой, кажется, это не то слово... Попробуй еще раз ❤️";
        }
        passwordInput.value = "";
        passwordInput.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => passwordInput.classList.remove("animate__shakeX"), 500);
    }
}

// 4. Логика переключения экранов
function unlockApp() {
    const loginScreen = document.getElementById("login-screen");
    const letterContent = document.getElementById("letter-content");

    if (loginScreen && letterContent) {
        loginScreen.style.display = "none";
        letterContent.style.display = "block";
        letterContent.classList.add("animate__animated", "animate__fadeIn");
    } else {
        window.location.href = "letter.html"; 
    }
}

// 5. Переход к счетчику
function goToApp() {
    window.location.href = "app.html"; 
}

// --- 6. ОБНОВЛЕННАЯ СИСТЕМА УВЕДОМЛЕНИЙ ---

async function enableNotifications() {
    const btn = document.getElementById('notify-btn');
    
    if (!("Notification" in window)) {
        alert("Этот телефон не поддерживает уведомления 😔");
        return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        if (btn) {
            btn.innerText = "✅ Уведомления включены";
            btn.style.background = "rgba(255, 255, 255, 0.4)";
        }
        
        // Запускаем цикл случайных уведомлений
        startRandomLoveNotifications();
    } else {
        alert("Разреши уведомления в настройках, чтобы получать сообщения! ❤️");
    }
}

// Функция загрузки JSON и выбора случайной фразы
async function getRandomPhrase() {
    try {
        const response = await fetch('phrases.json');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.messages.length);
        return data.messages[randomIndex];
    } catch (error) {
        console.error("Не удалось загрузить фразы:", error);
        return "Я тебя очень люблю! ❤️"; // Запасная фраза, если файл не скачался
    }
}

// Функция отправки уведомления
async function showLovePush() {
    const phrase = await getRandomPhrase();
    
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification("Наш Уголок ❤️", {
                body: phrase,
                icon: "myy.png",
                badge: "myy.png",
                vibrate: [200, 100, 200]
            });
        });
    }
}

// Запуск цикла
function startRandomLoveNotifications() {
    // Показываем первое сразу
    showLovePush();
    
    // Повторяем, например, каждые 3 часа (10800000 мс)
    // Важно: в браузере это работает, пока вкладка открыта в фоне
    setInterval(showLovePush, 120000); 
}
// --- 7. МАКСИМАЛЬНЫЙ ИНТЕРАКТИВ ---

// Эффект летящих сердечек из точки нажатия
document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.innerText = '❤️';
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    document.body.appendChild(particle);

    const destinationX = (Math.random() - 0.5) * 300;
    const destinationY = (Math.random() - 0.5) * 300;

    const anim = particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
    });

    anim.onfinish = () => particle.remove();
}

// Обновим функцию unlockApp, чтобы она меняла фразу в письме
const originalUnlock = unlockApp;
unlockApp = async function() {
    originalUnlock(); // Вызываем старую логику
    
    // Меняем "цитату дня" в письме
    try {
        const response = await fetch('phrases.json');
        const data = await response.json();
        const highlight = document.querySelector('.highlight');
        if (highlight && data.letter_quotes) {
            const randomQuote = data.letter_quotes[Math.floor(Math.random() * data.letter_quotes.length)];
            highlight.innerText = randomQuote + " 🐾💖";
        }
    } catch (e) { console.error(e); }
};


// ... (весь твой предыдущий код остается без изменений до раздела 6) ...

// --- 8. МЕНЕДЖЕР УСТАНОВКИ (Android & iOS) ---

let deferredPrompt;

// Слушаем событие готовности к установке (Android)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Показываем кнопку установки, если она есть в HTML
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

// Функция для вызова окна установки (вешаем на кнопку в HTML)
async function installPWA() {
    if (!deferredPrompt) {
        // Если зашли с iPhone, показываем инструкцию
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            alert("Чтобы установить приложение на iPhone:\n1. Нажми кнопку 'Поделиться' (квадрат со стрелкой)\n2. Выбери 'На экран Домой' 📲");
        } else {
            alert("Приложение уже установлено или браузер не поддерживает авто-установку.");
        }
        return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log('Пользователь установил приложение ❤️');
    }
    deferredPrompt = null;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.style.display = 'none';
}

// Переопределяем функцию входа, чтобы включить музыку и обновить текст
// (Это дополнение к твоему коду)
unlockApp = function() {
    const loginScreen = document.getElementById("login-screen");
    const letterContent = document.getElementById("letter-content");

    if (loginScreen && letterContent) {
        loginScreen.style.display = "none";
        letterContent.style.display = "block";
        letterContent.classList.add("animate__animated", "animate__fadeIn");
        
        updateLetterText(); // Твоя функция обновления текста
        playLoveMusic();    // Твоя функция музыки
        
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    }
};

// --- ДОПОЛНИТЕЛЬНЫЙ ФУНКЦИОНАЛ ---

// 1. Эффект разлетающихся сердечек при клике в любое место
document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.innerText = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        document.body.appendChild(heart);

        const destX = (Math.random() - 0.5) * 200;
        const destY = (Math.random() - 0.5) * 200;

        heart.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
        ], { duration: 1000, easing: 'ease-out' }).onfinish = () => heart.remove();
    }
});

// 2. Обновление фразы в письме из JSON
async function updateLetterText() {
    try {
        const response = await fetch('phrases.json');
        const data = await response.json();
        const quotes = data.letter_quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const highlight = document.querySelector('.highlight');
        if (highlight) highlight.innerText = randomQuote;
    } catch (e) { console.log("Ошибка загрузки текста"); }
}

// Изменяем функцию входа, чтобы всё запускалось
const oldUnlock = unlockApp;
unlockApp = function() {
    oldUnlock();
    updateLetterText();
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
};

// 3. Секретная музыка (запустится при нажатии на "Открыть")
function playLoveMusic() {
    const audio = new Audio('love.mp3'); // Положи файл love.mp3 в папку
    audio.volume = 0.3;
    audio.play().catch(() => console.log("Музыка ждет клика"));
}
