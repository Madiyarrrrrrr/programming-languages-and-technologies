// Массив книг
const books = [
    {
        title: "Преступление и наказание",
        author: "Фёдор Достоевский",
        year: 1866
    },
    {
        title: "Война и мир",
        author: "Лев Толстой",
        year: 1869
    },
    {
        title: "Мастер и Маргарита",
        author: "Михаил Булгаков",
        year: 1967
    },
    {
        title: "1984",
        author: "Джордж Оруэлл",
        year: 1949
    },
    {
        title: "Маленький принц",
        author: "Антуан де Сент-Экзюпери",
        year: 1943
    },
    {
        title: "Три товарища",
        author: "Эрих Мария Ремарк",
        year: 1936
    }
];

export function getBooks() {
    return [...books];
}

// Поиск книг
export function filterBooks(list, query) {
    const text = query.toLowerCase().trim();

    return list.filter(book =>
        book.title.toLowerCase().includes(text) ||
        book.author.toLowerCase().includes(text)
    );
}

// Сортировка книг
export function sortBooks(list, type) {
    const result = [...list];

    if (type === "year") {
        return result.sort((a, b) => b.year - a.year);
    }

    return result.sort((a, b) =>
        a[type].localeCompare(b[type], "ru")
    );
}