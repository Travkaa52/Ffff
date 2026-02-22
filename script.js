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

// --- 6. СИСТЕМА УВЕДОМЛЕНИЙ ---

async function enableNotifications() {
    const btn = document.getElementById('notify-btn');
    
    // Проверяем, поддерживает ли браузер уведомления
    if (!("Notification" in window)) {
        alert("Этот телефон не поддерживает уведомления 😔");
        return;
    }

    // Запрашиваем разрешение
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        if (btn) {
            btn.innerText = "✅ Уведомления включены";
            btn.style.background = "rgba(255, 255, 255, 0.4)";
        }
        
        // Показываем первое нежное сообщение сразу
        sendInstantLove();
    } else {
        alert("Разреши уведомления в настройках браузера, чтобы я мог присылать тебе сообщения! ❤️");
    }
}

function sendInstantLove() {
    if (navigator.serviceWorker.controller) {
        // Отправляем тестовый пуш через SW
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification("Наш Уголок ❤️", {
                body: "Теперь я буду присылать тебе напоминания о моей любви! ✨",
                icon: "myy.png",
                badge: "myy.png",
                vibrate: [200, 100, 200]
            });
        });
    }
}

// Обработка Enter
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const passInput = document.getElementById("password");
        if (passInput === document.activeElement) {
            checkPassword();
        }
    }
});
