// 1. Настройки
const SECRET_WORD = "любовь"; 

// 2. Автоматический вход при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        unlockApp(); 
    }
});

// 3. Единственная и правильная функция проверки
function checkPassword() {
    const passwordInput = document.getElementById("password");
    const error = document.getElementById("error-message");
    
    // Проверяем, существует ли поле ввода, чтобы не было ошибок в консоли
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

// 4. Логика переключения или перехода
function unlockApp() {
    const loginScreen = document.getElementById("login-screen");
    const letterContent = document.getElementById("letter-content");

    // Если всё на одной странице:
    if (loginScreen && letterContent) {
        loginScreen.style.display = "none";
        letterContent.style.display = "block";
        letterContent.classList.add("animate__animated", "animate__fadeIn");
    } 
    // Если письмо на другой странице:
    else {
        window.location.href = "letter.html"; 
    }
}

// Позволяем нажимать Enter
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});
