
const loadBtn = document.querySelector("#loadBtn");
const status = document.querySelector("#status");
const usersContainer = document.querySelector("#users");

loadBtn.addEventListener("click", loadUsers);

async function loadUsers() {
    loadBtn.disabled = true;
    status.textContent = "Загрузка пользователей...";
    usersContainer.replaceChildren();

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const users = await response.json();

        if (users.length === 0) {
            status.textContent = "Пользователи не найдены.";
            return;
        }

        users.forEach(user => {
            const card = document.createElement("div");
            card.className = "card";

            const name = document.createElement("h2");
            name.textContent = user.name;

            const email = document.createElement("p");
            email.textContent = `Email: ${user.email}`;

            card.append(name, email);
            usersContainer.append(card);
        });

        status.textContent = `Загружено пользователей: ${users.length}`;
    } catch (error) {
        status.textContent = `Ошибка загрузки: ${error.message}`;
    } finally {
        loadBtn.disabled = false;
    }
}
