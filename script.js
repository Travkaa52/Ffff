function checkPassword() {
  const password = document.getElementById("password").value;
// 1. Настройки
const SECRET_WORD = "любовь"; // Твое секретное слово

// 2. Автоматический вход
// Если она уже заходила ранее, сразу перенаправляем на приложение
window.onload = () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        // Если у тебя всё в одном файле, вызывай unlockApp(), 
        // если в разных — window.location.href = "app.html";
        unlockApp(); 
    }
};

// 3. Функция проверки пароля
function checkPassword() {
    const passwordInput = document.getElementById("password");
    const pass = passwordInput.value.toLowerCase().trim();
    const error = document.getElementById("error-message");

    if (pass === SECRET_WORD) {
        // Сохраняем состояние входа
        localStorage.setItem("isLoggedIn", "true");
        
        // Вибрация (приятный тактильный отклик на смартфонах)
        if (navigator.vibrate) navigator.vibrate(50);
        
        unlockApp();
    } else {
        error.innerText = "Ой, кажется, это не то слово... Попробуй еще раз ❤️";
        passwordInput.value = "";
        
        // Добавим эффект «тряски» для поля ввода при ошибке
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
        // Если используешь пересылку на другую страницу
        window.location.href = "app.html";
    }
}

// 5. Переход к счетчику (если нужно)
function goToApp() {
    window.location.href = "app.html"; 
}
