function checkPassword() {
  const password = document.getElementById("password").value;
  const correctPassword = "qazwsx"; // здесь твое секретное слово

  if (password === correctPassword) {
    window.open("secret.html", "_blank");
  } else {
    document.getElementById("error-message").textContent = "Неправильное слово 😢";
  }
}
