// 1. Настройки
const SECRET_WORD = "Окак"; 

// 2. Автоматический вход при загрузке страницы
window.addEventListener('load', () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        unlockApp(); 
    }
});

// 3. Единственная функция проверки пароля
function checkPassword() {
    const passwordInput = document.getElementById("password");
    const error = document.getElementById("error-message");
    
    // Если элементов нет в HTML, выходим из функции, чтобы не было ошибок
    if (!passwordInput) return;

    const pass = passwordInput.value.toLowerCase().trim();

    if (pass === SECRET_WORD) {
        // Сохраняем состояние входа
        localStorage.setItem("isLoggedIn", "true");
        
        // Вибрация
        if (navigator.vibrate) navigator.vibrate(50);
        
        unlockApp();
    } else {
        if (error) {
            error.innerText = "Ой, кажется, это не то слово... Попробуй еще раз ❤️";
        }
        passwordInput.value = "";
        
        // Эффект тряски
        passwordInput.classList.add("animate__animated", "animate__shakeX");
        setTimeout(() => passwordInput.classList.remove("animate__shakeX"), 500);
    }
}

// 4. Логика переключения экранов
function unlockApp() {
    const loginScreen = document.getElementById("login-screen");
    const letterContent = document.getElementById("letter-content");

    // Если всё в одном файле (index.html), просто переключаем блоки
    if (loginScreen && letterContent) {
        loginScreen.style.display = "none";
        letterContent.style.display = "block";
        letterContent.classList.add("animate__animated", "animate__fadeIn");
    } 
    // Если письмо в другом файле (letter.html), перенаправляем
    else {
        window.location.href = "letter.html"; 
    }
}

// 5. Переход к счетчику (для кнопки "Перейти")
function goToApp() {
    window.location.href = "app.html"; 
}

// Добавляем обработку нажатия Enter в поле пароля
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const passInput = document.getElementById("password");
        if (passInput === document.activeElement) {
            checkPassword();
        }
    }
});
