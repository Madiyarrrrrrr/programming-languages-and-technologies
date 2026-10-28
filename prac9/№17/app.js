
const userSelect = document.querySelector("#userSelect");
const status = document.querySelector("#status");
const postsContainer = document.querySelector("#posts");
const commentsContainer = document.querySelector("#comments");

async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();
}

async function loadUsers() {
    userSelect.disabled = true;
    status.textContent = "Загрузка пользователей...";

    try {
        const users = await fetchData(
            "https://jsonplaceholder.typicode.com/users"
        );

        userSelect.replaceChildren();

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Выберите пользователя";
        userSelect.append(defaultOption);

        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
            userSelect.append(option);
        });

        status.textContent = `Загружено пользователей: ${users.length}`;
    } catch (error) {
        status.textContent = `Ошибка загрузки: ${error.message}`;

        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Не удалось загрузить пользователей";
        userSelect.replaceChildren(option);
    } finally {
        userSelect.disabled = false;
    }
}

userSelect.addEventListener("change", async () => {
    const userId = userSelect.value;

    postsContainer.replaceChildren();
    commentsContainer.replaceChildren();

    if (!userId) {
        status.textContent = "Выберите пользователя.";
        commentsContainer.textContent = "Выберите публикацию.";
        return;
    }

    userSelect.disabled = true;
    status.textContent = "Загрузка публикаций...";
    commentsContainer.textContent = "Выберите публикацию.";

    try {
        const posts = await fetchData(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );

        if (posts.length === 0) {
            postsContainer.textContent = "Публикаций нет.";
        }

        posts.forEach(post => {
            const card = document.createElement("article");
            card.className = "post";

            const title = document.createElement("h3");
            title.textContent = post.title;

            const body = document.createElement("p");
            body.textContent = post.body;

            const button = document.createElement("button");
            button.textContent = "Показать комментарии";

            button.addEventListener("click", async () => {
                button.disabled = true;
                commentsContainer.replaceChildren();
                status.textContent = "Загрузка комментариев...";

                try {
                    const comments = await fetchData(
                        `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
                    );

                    commentsContainer.replaceChildren();

                    if (comments.length === 0) {
                        commentsContainer.textContent =
                            "Комментарии не найдены.";
                    }

                    comments.forEach(comment => {
                        const item = document.createElement("div");
                        item.className = "comment";

                        const author = document.createElement("h4");
                        author.textContent = comment.name;

                        const email = document.createElement("p");
                        email.textContent = `Email: ${comment.email}`;

                        const text = document.createElement("p");
                        text.textContent = comment.body;

                        item.append(author, email, text);
                        commentsContainer.append(item);
                    });

                    status.textContent =
                        `Загружено комментариев: ${comments.length}`;
                } catch (error) {
                    commentsContainer.textContent =
                        `Ошибка загрузки комментариев: ${error.message}`;
                    status.textContent = "Не удалось загрузить комментарии.";
                } finally {
                    button.disabled = false;
                }
            });

            card.append(title, body, button);
            postsContainer.append(card);
        });

        status.textContent = `Загружено публикаций: ${posts.length}`;
    } catch (error) {
        status.textContent = `Ошибка загрузки: ${error.message}`;
        postsContainer.textContent =
            "Не удалось загрузить публикации. Попробуйте снова.";
    } finally {
        userSelect.disabled = false;
    }
});

loadUsers();
