let count = 0;

const value = document.querySelector("#value");

const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");
const resetButton = document.querySelector("#reset");

// Увеличение
plusButton.addEventListener("click", () => {
    count++;
    value.textContent = count;
});

// Уменьшение
minusButton.addEventListener("click", () => {
    count--;
    value.textContent = count;
});

// Сброс
resetButton.addEventListener("click", () => {
    count = 0;
    value.textContent = count;
});
