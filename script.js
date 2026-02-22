function checkPassword() {
  const password = document.getElementById("password").value;
 const SECRET_WORD = "любовь"; // Замени на ваше слово

function checkPassword() {
    const pass = document.getElementById("password").value.toLowerCase().trim();
    const error = document.getElementById("error-message");

    if (pass === SECRET_WORD) {
        // Прячем вход, показываем письмо
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("letter-content").style.display = "block";
        
        // Вибрация при успехе
        if(navigator.vibrate) navigator.vibrate(50);
        
        // Сохраняем, что вход выполнен
        localStorage.setItem("isLoggedIn", "true");
    } else {
        error.innerText = "Ой, кажется, это не то слово... Попробуй еще раз ❤️";
        document.getElementById("password").value = "";
    }
}

function goToApp() {
    // Редирект на файл с чатом и счетчиком
    window.location.href = "app.html"; 
}

// Проверка: если уже входила, можно сразу пускать (опционально)
/*
window.onload = () => {
    if(localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = "app.html";
    }
};
*/
