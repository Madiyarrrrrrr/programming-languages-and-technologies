const gameArea = document.getElementById("gameArea");
const targetObject = document.getElementById("targetObject");

const scoreElement = document.getElementById("score");
const targetElement = document.getElementById("target");

const timeElement = document.getElementById("time");
const messageElement = document.getElementById("message");

const startButton = document.getElementById("startButton");

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

// Настройки уровней сложности
const levels = {
    easy: {
        name: "Легко",
        speed: 2500,
        size: 70
    },

    medium: {
        name: "Средне",
        speed: 1400,
        size: 55
    },

    hard: {
        name: "Сложно",
        speed: 700,
        size: 40
    }
};

let currentLevel = "easy";

let score = 0;
let targetScore = 10;

let gameRunning = false;

let moveTimer;
let gameTimer;

let seconds = 0;


// Выбор уровня сложности
difficultyButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (gameRunning) {
            return;
        }

        difficultyButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentLevel = button.dataset.level;

        messageElement.textContent =
            "Выбрана сложность: " + levels[currentLevel].name;
    });
});


// Получить случайную позицию объекта
function getRandomPosition() {

    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const objectSize = targetObject.offsetWidth;

    const maxX = areaWidth - objectSize;
    const maxY = areaHeight - objectSize;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    return {
        x: x,
        y: y
    };
}


// Перемещение объекта
function moveObject() {

    if (!gameRunning) {
        return;
    }

    const position = getRandomPosition();

    targetObject.style.left = position.x + "px";
    targetObject.style.top = position.y + "px";
}


// Запуск автоматического движения
function startMoving() {

    clearInterval(moveTimer);

    const speed = levels[currentLevel].speed;

    moveTimer = setInterval(function() {
        moveObject();
    }, speed);
}


// Нажатие на объект
targetObject.addEventListener("click", function() {

    if (!gameRunning) {
        return;
    }

    score++;

    scoreElement.textContent = score;

    // Меняем цвет объекта после успешного попадания
    targetObject.style.background =
        "#" + Math.floor(Math.random() * 16777215).toString(16);

    // Объект сразу перемещается
    moveObject();

    if (score >= targetScore) {
        finishGame();
    } else {

        messageElement.textContent =
            "Попадание! 🎯 Осталось: " +
            (targetScore - score);
    }
});


// Запуск игры
startButton.addEventListener("click", function() {

    if (gameRunning) {
        return;
    }

    startGame();
});


function startGame() {

    gameRunning = true;

    score = 0;
    seconds = 0;

    scoreElement.textContent = score;
    timeElement.textContent = seconds;

    targetElement.textContent = targetScore;

    startButton.disabled = true;
    startButton.textContent = "Игра идёт...";

    messageElement.textContent =
        "Лови объект! 👀";

    // Размер зависит от сложности
    const size = levels[currentLevel].size;

    targetObject.style.width = size + "px";
    targetObject.style.height = size + "px";

    targetObject.style.display = "block";

    moveObject();
    startMoving();

    // Секундомер
    gameTimer = setInterval(function() {

        seconds++;

        timeElement.textContent = seconds;

    }, 1000);
}


// Завершение игры
function finishGame() {

    gameRunning = false;

    clearInterval(moveTimer);
    clearInterval(gameTimer);

    targetObject.style.display = "none";

    startButton.disabled = false;
    startButton.textContent = "Играть снова";

    messageElement.textContent =
        "🎉 Победа! Ты поймал объект " +
        targetScore +
        " раз за " +
        seconds +
        " секунд!";
}