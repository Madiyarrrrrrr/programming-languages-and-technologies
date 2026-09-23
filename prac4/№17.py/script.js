const form = document.getElementById("registrationForm");

const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const loginMessage = document.getElementById("loginMessage");
const emailMessage = document.getElementById("emailMessage");
const passwordMessage = document.getElementById("passwordMessage");
const confirmMessage = document.getElementById("confirmMessage");

const strengthBar = document.getElementById("strengthBar");
const message = document.getElementById("message");


// Проверка логина во время ввода
login.addEventListener("input", function() {
    const value = login.value.trim();

    if (value.length < 3) {
        login.classList.add("invalid");
        login.classList.remove("valid");
        loginMessage.textContent = "Логин должен содержать минимум 3 символа.";
        loginMessage.style.color = "red";
    } else {
        login.classList.add("valid");
        login.classList.remove("invalid");
        loginMessage.textContent = "Логин корректный.";
        loginMessage.style.color = "green";
    }
});


// Проверка e-mail во время ввода
email.addEventListener("input", function() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(email.value)) {
        email.classList.add("invalid");
        email.classList.remove("valid");
        emailMessage.textContent = "Введите корректный e-mail.";
        emailMessage.style.color = "red";
    } else {
        email.classList.add("valid");
        email.classList.remove("invalid");
        emailMessage.textContent = "E-mail корректный.";
        emailMessage.style.color = "green";
    }
});


// Индикатор сложности пароля
password.addEventListener("input", function() {
    const value = password.value;
    let strength = 0;

    if (value.length >= 6) {
        strength++;
    }

    if (/[A-ZА-Я]/.test(value)) {
        strength++;
    }

    if (/[0-9]/.test(value)) {
        strength++;
    }

    if (/[^A-Za-zА-Яа-я0-9]/.test(value)) {
        strength++;
    }

    if (value.length === 0) {
        strengthBar.style.width = "0%";
        passwordMessage.textContent = "";
    }
    else if (strength <= 1) {
        strengthBar.style.width = "25%";
        strengthBar.style.background = "red";
        passwordMessage.textContent = "Слабый пароль";
        passwordMessage.style.color = "red";
    }
    else if (strength <= 2) {
        strengthBar.style.width = "50%";
        strengthBar.style.background = "orange";
        passwordMessage.textContent = "Средний пароль";
        passwordMessage.style.color = "orange";
    }
    else if (strength === 3) {
        strengthBar.style.width = "75%";
        strengthBar.style.background = "#9acd32";
        passwordMessage.textContent = "Хороший пароль";
        passwordMessage.style.color = "#669900";
    }
    else {
        strengthBar.style.width = "100%";
        strengthBar.style.background = "green";
        passwordMessage.textContent = "Сильный пароль";
        passwordMessage.style.color = "green";
    }

    checkPasswords();
});


// Проверка совпадения паролей
confirmPassword.addEventListener("input", checkPasswords);

function checkPasswords() {
    if (confirmPassword.value === "") {
        confirmMessage.textContent = "";
        return;
    }

    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add("invalid");
        confirmPassword.classList.remove("valid");
        confirmMessage.textContent = "Пароли не совпадают.";
        confirmMessage.style.color = "red";
    } else {
        confirmPassword.classList.add("valid");
        confirmPassword.classList.remove("invalid");
        confirmMessage.textContent = "Пароли совпадают.";
        confirmMessage.style.color = "green";
    }
}


// Проверка всей формы
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const loginValue = login.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    const confirmValue = confirmPassword.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (loginValue.length < 3) {
        showError("Логин должен содержать минимум 3 символа.");
        return;
    }

    if (!emailPattern.test(emailValue)) {
        showError("Введите корректный e-mail.");
        return;
    }

    if (passwordValue.length < 6) {
        showError("Пароль должен содержать минимум 6 символов.");
        return;
    }

    if (passwordValue !== confirmValue) {
        showError("Пароли не совпадают.");
        return;
    }

    message.textContent =
        "Регистрация успешно завершена!";
    message.style.color = "green";
});

function showError(text) {
    message.textContent = text;
    message.style.color = "red";
}
