// --- TELEGRAM WEB APP ---
let tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
    tg.expand();
}

// --- 1. НАСТРОЙКИ ---
const SECRET_WORD = "окак"; // секретное слово

// --- 2. АВТОВХОД + SERVICE WORKER ---
window.addEventListener('load', () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        unlockApp();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log("SW готов ❤️"))
            .catch(err => console.error("SW ошибка:", err));
    }
});

// --- 3. ПРОВЕРКА ПАРОЛЯ ---
function checkPassword() {
    const passwordInput = document.getElementById("password");
    const error = document.getElementById("error-message");

    if (!passwordInput) return;

    const pass = passwordInput.value.toLowerCase().trim();

    if (pass === SECRET_WORD) {
        localStorage.setItem("isLoggedIn", "true");
        if (navigator.vibrate) navigator.vibrate(50);
        unlockApp();

        if (tg) {
            tg.sendData("login_success");
        }
    } else {
        if (error) {
            error.innerText = "Ой, кажется, это не то слово... Попробуй еще раз ❤️";
        }
        passwordInput.value = "";
        passwordInput.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => passwordInput.classList.remove("animate__shakeX"), 500);
    }
}

// --- 4. ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ---
function unlockApp() {
    const loginScreen = document.getElementById("login-screen");
    const letterContent = document.getElementById("letter-content");

    if (loginScreen && letterContent) {
        loginScreen.style.display = "none";
        letterContent.style.display = "block";
        letterContent.classList.add("animate__animated", "animate__fadeIn");

        updateLetterText();

        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

        if (tg) {
            tg.sendData("opened_letter");
        }
    } else {
        window.location.href = "letter.html";
    }
}

// --- 5. ПЕРЕХОД К СЧЁТЧИКУ ---
function goToApp() {
    if (tg) {
        tg.sendData("open_counter");
    }
    window.location.href = "app.html";
}

// --- 6. УВЕДОМЛЕНИЯ ---
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
            btn.style.background = "rgba(255,255,255,0.4)";
        }

        startRandomLoveNotifications();

        if (tg) {
            tg.sendData("enable_love_notifications");
        }
    } else {
        alert("Разреши уведомления в настройках ❤️");
    }
}

// --- 7. ФРАЗЫ ---
async function getRandomPhrase() {
    try {
        const response = await fetch('phrases.json');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.messages.length);
        return data.messages[randomIndex];
    } catch (error) {
        console.error("Ошибка фраз:", error);
        return "Я тебя очень люблю ❤️";
    }
}

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

function startRandomLoveNotifications() {
    showLovePush();
    setInterval(showLovePush, 120000);
}

// --- 8. СЕРДЕЧКИ ---
document.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
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
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0,.9,.57,1)'
    });

    anim.onfinish = () => particle.remove();
}

// --- 9. ОБНОВЛЕНИЕ ТЕКСТА ---
async function updateLetterText() {
    try {
        const response = await fetch('phrases.json');
        const data = await response.json();
        const quotes = data.letter_quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const highlight = document.querySelector('.highlight');
        if (highlight) highlight.innerText = randomQuote + " 🐾💖";
    } catch (e) {
        console.log("Ошибка текста");
    }
}

// --- 10. МУЗЫКА ---
function playLoveMusic() {
    const audio = new Audio('love.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => console.log("Музыка ждёт клика"));
}

// --- 11. PWA УСТАНОВКА ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

async function installPWA() {
    if (!deferredPrompt) {
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            alert("Нажми Поделиться → На экран Домой 📲");
        } else {
            alert("Установка недоступна");
        }
        return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        console.log("Установлено ❤️");
    }
    deferredPrompt = null;

    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.style.display = 'none';
}
