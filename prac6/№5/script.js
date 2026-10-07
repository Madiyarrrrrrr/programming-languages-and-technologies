const themeBtn = document.querySelector("#themeBtn");
const text = document.querySelector("#text");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeBtn.textContent = "☀️ Включить светлую тему";
        text.textContent = "Сейчас используется тёмная тема.";
    } else {
        themeBtn.textContent = "🌙 Включить тёмную тему";
        text.textContent = "Сейчас используется светлая тема.";
    }
});
