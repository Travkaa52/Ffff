// --- 0. ИНИЦИАЛИЗАЦИЯ TG ---
let tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
    tg.expand();
    tg.ready();
}

// --- 1. КОНСТАНТЫ ---
const SECRET_WORD = "окак"; 
const CONFIG = {
    vibrateShort: 50,
    vibrateSuccess: [50, 30, 50],
    notificationInterval: 3600000, // Раз в час (в реальности)
    musicVolume: 0.4
};

// --- 2. АВТОВХОД И ЗАГРУЗКА ---
window.addEventListener('DOMContentLoaded', () => {
    // Если уже входила - пускаем сразу
    if (localStorage.getItem("isLoggedIn") === "true") {
        unlockApp(true); // true значит "без анимации", чтобы не ждать
    }

    // Регистрация SW
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.log("SW не критичен, работаем дальше"));
    }
});

// --- 3. ЛОГИКА ПРОВЕРКИ ---
function checkPassword() {
    const input = document.getElementById("password");
    const error = document.getElementById("error-message");
    if (!input) return;

    const pass = input.value.toLowerCase().trim();

    if (pass === SECRET_WORD) {
        // УСПЕХ
        localStorage.setItem("isLoggedIn", "true");
        if (navigator.vibrate) navigator.vibrate(CONFIG.vibrateSuccess);
        
        // Запускаем музыку именно здесь (после клика)
        playLoveMusic();
        unlockApp(false);
    } else {
        // ОШИБКА
        if (error) error.innerText = "Это не наше секретное слово... ❤️";
        input.value = "";
        input.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => input.classList.remove("animate__shakeX"), 500);
        if (navigator.vibrate) navigator.vibrate(100);
    }
}

// --- 4. РАЗБЛОКИРОВКА И ТЕКСТ ---
async function unlockApp(fastMode = false) {
    const login = document.getElementById("login-screen");
    const content = document.getElementById("letter-content");

    if (!login || !content) return;

    if (fastMode) {
        login.style.display = "none";
        content.style.display = "block";
    } else {
        login.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
            login.style.display = "none";
            content.style.display = "block";
            content.classList.add("animate__animated", "animate__fadeIn");
        }, 500);
    }

    // Загружаем фразы
    const data = await fetchAssets();
    const highlight = document.querySelector('.highlight');
    if (highlight && data.letter_quotes) {
        const randomQuote = data.letter_quotes[Math.floor(Math.random() * data.letter_quotes.length)];
        highlight.innerText = randomQuote + " 🐾💖";
    }
}

// --- 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
async function fetchAssets() {
    try {
        const res = await fetch('phrases.json');
        return await res.json();
    } catch (e) {
        // Запасной вариант, если файл не найден
        return {
            messages: ["Ты чудо ❤️"],
            letter_quotes: ["Ты мой котенок"]
        };
    }
}

function playLoveMusic() {
    const audio = new Audio('love.mp3');
    audio.volume = CONFIG.musicVolume;
    audio.loop = true;
    audio.play().catch(() => console.log("Нужен еще один клик для звука"));
}

function goToApp() {
    // Плавный переход
    document.body.classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {
        window.location.href = "app.html";
    }, 500);
}

// --- 6. УВЕДОМЛЕНИЯ ---
async function enableNotifications() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const btn = document.getElementById('notify-btn');
        if (btn) btn.innerText = "✅ На связи 24/7";
        
        // Сразу шлем первое
        showPush();
        // Ставим интервал
        setInterval(showPush, CONFIG.notificationInterval);
    } else {
        alert("Пожалуйста, разреши уведомления в настройках браузера!");
    }
}

async function showPush() {
    const data = await fetchAssets();
    const phrase = data.messages[Math.floor(Math.random() * data.messages.length)];
    
    if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("Наш Уголок ❤️", {
            body: phrase,
            icon: "myy.png",
            vibrate: [200, 100, 200]
        });
    }
}

// --- 7. ЭФФЕКТ СЕРДЕЧЕК ПРИ КЛИКЕ ---
document.addEventListener('mousedown', (e) => {
    for (let i = 0; i < 6; i++) {
        createHeart(e.clientX, e.clientY);
    }
});

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
    heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 15 + 10}px;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(heart);

    const destX = (Math.random() - 0.5) * 200;
    const destY = (Math.random() - 0.5) * 200 - 100;

    heart.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1200,
        easing: 'ease-out'
    }).onfinish = () => heart.remove();
}
