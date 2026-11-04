// Отображение книг на странице
export function renderBooks(books) {
    const container = document.getElementById("bookList");

    container.innerHTML = "";

    if (books.length === 0) {
        container.textContent = "Книги не найдены.";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book";

        card.innerHTML = `
            <h2>${book.title}</h2>
            <p>Автор: ${book.author}</p>
            <p>Год выпуска: ${book.year}</p>
        `;

        container.appendChild(card);
    });
}

export function renderCount(count) {
    document.getElementById("count").textContent =
        `Найдено книг: ${count}`;
}