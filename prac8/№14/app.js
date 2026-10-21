
const BEST_KEY = "lab8_quiz_best";
const PROGRESS_KEY = "lab8_quiz_progress";

const questions = [
  {
    question: "Что означает HTML?",
    answers: [
      "Язык разметки гипертекста",
      "Язык программирования баз данных",
      "Графический редактор",
      "Операционная система"
    ],
    correct: 0
  },
  {
    question: "Какой язык отвечает за оформление веб-страниц?",
    answers: ["Python", "CSS", "SQL", "C++"],
    correct: 1
  },
  {
    question: "Что делает JSON.stringify()?",
    answers: [
      "Удаляет объект",
      "Преобразует объект в строку JSON",
      "Создаёт HTML",
      "Перезагружает страницу"
    ],
    correct: 1
  },
  {
    question: "Какое хранилище сохраняет данные между перезапусками браузера?",
    answers: [
      "sessionStorage",
      "localStorage",
      "Переменная let",
      "Консоль"
    ],
    correct: 1
  },
  {
    question: "Что возвращает JSON.parse()?",
    answers: [
      "Преобразует JSON-строку в значение JavaScript",
      "Удаляет все данные",
      "Создаёт CSS-файл",
      "Закрывает вкладку"
    ],
    correct: 0
  }
];

const questionArea = document.querySelector("#questionArea");
const resultArea = document.querySelector("#resultArea");
const questionElement = document.querySelector("#question");
const answersElement = document.querySelector("#answers");
const progressElement = document.querySelector("#progress");
const progressBar = document.querySelector("#progressBar");
const bestScoreElement = document.querySelector("#bestScore");
const feedbackElement = document.querySelector("#feedback");
const nextBtn = document.querySelector("#nextBtn");
const finalScoreElement = document.querySelector("#finalScore");
const restartBtn = document.querySelector("#restartBtn");

let current = 0;
let score = 0;
let answered = false;

// Безопасное чтение лучшего результата.
function loadBest() {
  try {
    const value = JSON.parse(localStorage.getItem(BEST_KEY));

    return Number.isSafeInteger(value) &&
      value >= 0 &&
      value <= questions.length
      ? value
      : 0;
  } catch {
    return 0;
  }
}

// Сохранение текущего прогресса в рамках вкладки.
function saveProgress() {
  try {
    sessionStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        current,
        score,
        answered
      })
    );
  } catch (error) {
    console.error("Не удалось сохранить прогресс:", error);
  }
}

// Восстановление прогресса с проверкой данных.
function loadProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);

    if (!raw) return null;

    const data = JSON.parse(raw);

    if (
      !data ||
      !Number.isInteger(data.current) ||
      data.current < 0 ||
      data.current >= questions.length ||
      !Number.isInteger(data.score) ||
      data.score < 0 ||
      data.score > questions.length ||
      typeof data.answered !== "boolean"
    ) {
      return null;
    }

    if (data.answered && data.current >= data.score + questions.length) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function updateBest() {
  bestScoreElement.textContent = loadBest();
}

function renderQuestion() {
  if (current >= questions.length) {
    finishQuiz();
    return;
  }

  answered = false;
  const item = questions[current];

  progressElement.textContent =
    `Вопрос ${current + 1} из ${questions.length}`;

  progressBar.style.width =
    `${(current / questions.length) * 100}%`;

  questionElement.textContent = item.question;
  answersElement.replaceChildren();
  feedbackElement.textContent = "";
  nextBtn.disabled = true;

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.textContent = answer;

    button.addEventListener("click", () => {
      chooseAnswer(index);
    });

    answersElement.append(button);
  });

  saveProgress();
}

function chooseAnswer(index) {
  if (answered) return;

  answered = true;
  const item = questions[current];
  const buttons = answersElement.querySelectorAll("button");

  buttons.forEach((button, i) => {
    button.disabled = true;

    if (i === item.correct) {
      button.classList.add("correct");
    }
  });

  if (index === item.correct) {
    score++;
    feedbackElement.textContent = "Правильно! Молодец.";
  } else {
    buttons[index].classList.add("wrong");
    feedbackElement.textContent =
      "Неверно. Правильный ответ выделен зелёным.";
  }

  nextBtn.disabled = false;
  nextBtn.textContent =
    current === questions.length - 1
      ? "Посмотреть результат"
      : "Следующий вопрос";

  saveProgress();
}

function finishQuiz() {
  questionArea.hidden = true;
  resultArea.hidden = false;
  progressBar.style.width = "100%";

  finalScoreElement.textContent =
    `Твой результат: ${score} из ${questions.length}.`;

  const best = Math.max(loadBest(), score);

  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch (error) {
    console.error("Не удалось сохранить результат:", error);
  }

  updateBest();

  try {
    sessionStorage.removeItem(PROGRESS_KEY);
  } catch (error) {
    console.error(error);
  }
}

nextBtn.addEventListener("click", () => {
  if (!answered) return;

  current++;
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  answered = false;

  resultArea.hidden = true;
  questionArea.hidden = false;

  renderQuestion();
});

updateBest();

const savedProgress = loadProgress();

if (savedProgress) {
  current = savedProgress.current;
  score = savedProgress.score;
  answered = savedProgress.answered;
}

renderQuestion();

// Если на момент обновления ответ уже был выбран,
// восстанавливаем его отображение без повторного начисления балла.
if (savedProgress && savedProgress.answered) {
  const item = questions[current];
  const buttons = answersElement.querySelectorAll("button");

  // В сохранённой версии нет выбранного индекса,
  // поэтому восстанавливаем вопрос и начисленный счёт,
  // предлагая заново ответить на текущий вопрос.
  answered = false;
  nextBtn.disabled = true;
  nextBtn.textContent = "Следующий вопрос";
  saveProgress();
}
