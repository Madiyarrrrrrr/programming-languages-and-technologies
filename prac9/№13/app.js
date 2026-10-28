
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
            const card = document.createElement("section");
            card.className = "card";

            const title = document.createElement("h2");
            title.textContent = user.name;

            const email = document.createElement("p");
            email.textContent = `Email: ${user.email}`;

            const button = document.createElement("button");
            button.textContent = "Показать публикации";

            const postsContainer = document.createElement("div");

            button.addEventListener("click", async () => {
                button.disabled = true;
                postsContainer.replaceChildren();

                const message = document.createElement("p");
                message.textContent = "Загрузка публикаций...";
                postsContainer.append(message);

                try {
                    const response = await fetch(
                        `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const posts = await response.json();
                    postsContainer.replaceChildren();

                    if (posts.length === 0) {
                        const empty = document.createElement("p");
                        empty.textContent = "Публикаций нет.";
                        postsContainer.append(empty);
                    } else {
                        const list = document.createElement("ul");
                        list.className = "posts";

                        posts.forEach(post => {
                            const item = document.createElement("li");
                            item.textContent = post.title;
                            list.append(item);
                        });

                        postsContainer.append(list);
                    }

                    button.textContent = "Обновить публикации";
                } catch (error) {
                    postsContainer.replaceChildren();
                    const errorMessage = document.createElement("p");
                    errorMessage.textContent =
                        `Ошибка загрузки: ${error.message}`;
                    postsContainer.append(errorMessage);
                } finally {
                    button.disabled = false;
                }
            });

            card.append(title, email, button, postsContainer);
            usersContainer.append(card);
        });

        status.textContent = `Загружено пользователей: ${users.length}`;
    } catch (error) {
        status.textContent = `Ошибка загрузки: ${error.message}`;
    } finally {
        loadBtn.disabled = false;
    }
}
