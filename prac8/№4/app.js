
const STORAGE_KEY = "lab8_visit_count";
const visitsElement = document.querySelector("#visits");
const messageElement = document.querySelector("#message");
const resetBtn = document.querySelector("#resetBtn");

function readVisits() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return 0;
    }

    const value = JSON.parse(saved);

    return Number.isSafeInteger(value) && value >= 0
      ? value
      : 0;
  } catch (error) {
    console.error("Ошибка чтения данных:", error);
    return 0;
  }
}

function saveVisits(count) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(count));
    return true;
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    messageElement.textContent = "Не удалось сохранить данные.";
    return false;
  }
}

function render() {
  visitsElement.textContent = readVisits();
}

// При каждом открытии страницы увеличиваем счётчик.
const currentVisits = readVisits();
const nextVisits = currentVisits + 1;

if (saveVisits(nextVisits)) {
  render();
  messageElement.textContent =
    "Это посещение номер " + nextVisits + ".";
} else {
  render();
}

// Сброс счётчика.
resetBtn.addEventListener("click", () => {
  if (saveVisits(0)) {
    render();
    messageElement.textContent =
      "Счётчик сброшен. Следующее открытие начнёт новый подсчёт.";
  }
});
