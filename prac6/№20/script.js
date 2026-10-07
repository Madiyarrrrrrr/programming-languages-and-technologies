const gameArea = document.querySelector("#gameArea");
const targetObject = document.querySelector("#targetObject");
const scoreElement = document.querySelector("#score");
const targetScoreElement = document.querySelector("#targetScore");
const message = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");

const maxScore = 10;

let score = 0;
let gameActive = true;


// Перемещение объекта
function moveObject() {

    const maxX =
        gameArea.clientWidth - targetObject.offsetWidth;

    const maxY =
        gameArea.clientHeight - targetObject.offsetHeight;

    const randomX =
        Math.floor(Math.random() * maxX);

    const randomY =
        Math.floor(Math.random() * maxY);

    targetObject.style.left = `${randomX}px`;
    targetObject.style.top = `${randomY}px`;
}


// Клик по объекту
targetObject.addEventListener("click", () => {

    if (!gameActive) {
        return;
    }

    // Увеличиваем количество попаданий
    score++;

    // Изменяем DOM
    scoreElement.textContent = score;

    // Проверяем окончание игры
    if (score >= maxScore) {

        gameActive = false;

        targetObject.disabled = true;
        targetObject.style.display = "none";

        message.textContent =
            "🎉 Победа! Вы сделали 10 попаданий!";

        return;
    }

    message.textContent =
        `Попадание! Осталось попаданий: ${maxScore - score}`;

    // Перемещаем объект
    moveObject();
});


// Перезапуск игры
restartBtn.addEventListener("click", () => {

    score = 0;
    gameActive = true;

    scoreElement.textContent = score;

    message.textContent =
        "Нажмите на красный объект!";

    targetObject.disabled = false;
    targetObject.style.display = "block";

    moveObject();
});


// Первоначальное положение объекта
moveObject();
