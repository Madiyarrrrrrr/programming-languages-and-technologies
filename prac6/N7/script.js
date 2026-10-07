const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const clearBtn = document.querySelector("#clearBtn");
const counter = document.querySelector("#counter");

// Обновление счетчика
function updateCounter() {

    const tasks = document.querySelectorAll("#taskList li");
    const completedTasks =
        document.querySelectorAll("#taskList li.completed");

    counter.textContent =
        `Всего задач: ${tasks.length} | Выполнено: ${completedTasks.length}`;
}


// Добавление задачи
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Введите текст задачи!");
        return;
    }

    // Создаем новый элемент списка
    const li = document.createElement("li");

    // Создаем текст задачи
    const span = document.createElement("span");

    span.textContent = taskText;
    span.classList.add("task-text");

    // Создаем кнопку удаления
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");

    // Клик по задаче — выполнение
    span.addEventListener("click", () => {

        li.classList.toggle("completed");

        updateCounter();
    });

    // Клик по кнопке — удаление
    deleteBtn.addEventListener("click", () => {

        li.remove();

        updateCounter();
    });

    // Добавляем элементы в li
    li.append(span, deleteBtn);

    // Добавляем li в список
    taskList.append(li);

    // Очищаем поле
    taskInput.value = "";

    updateCounter();
}


// Добавление через кнопку
addBtn.addEventListener("click", addTask);


// Добавление через клавишу Enter
taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }
});


// Очистка выполненных задач
clearBtn.addEventListener("click", () => {

    const completedTasks =
        document.querySelectorAll("#taskList li.completed");

    completedTasks.forEach(task => {
        task.remove();
    });

    updateCounter();
});


// Начальный счетчик
updateCounter();
