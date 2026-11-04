import {
    getBooks,
    filterBooks,
    sortBooks
} from "./modules/books.js";

import {
    renderBooks,
    renderCount
} from "./modules/ui.js";

const books = getBooks();

const search = document.getElementById("search");
const sort = document.getElementById("sort");

function updateCatalog() {
    let result = filterBooks(books, search.value);

    result = sortBooks(result, sort.value);

    renderBooks(result);
    renderCount(result.length);
}

// Поиск
search.addEventListener("input", updateCatalog);

// Сортировка
sort.addEventListener("change", updateCatalog);

updateCatalog();