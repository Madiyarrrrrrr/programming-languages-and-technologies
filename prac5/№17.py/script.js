// Массив товаров

const products = [
    {
        name: "Ноутбук Lenovo",
        category: "Ноутбуки",
        price: 350000
    },

    {
        name: "Смартфон Samsung",
        category: "Смартфоны",
        price: 280000
    },

    {
        name: "Наушники JBL",
        category: "Аудио",
        price: 45000
    },

    {
        name: "Клавиатура Logitech",
        category: "Компьютерные аксессуары",
        price: 30000
    },

    {
        name: "Мышь Logitech",
        category: "Компьютерные аксессуары",
        price: 18000
    },

    {
        name: "Монитор LG",
        category: "Мониторы",
        price: 120000
    },

    {
        name: "Планшет Xiaomi",
        category: "Планшеты",
        price: 150000
    },

    {
        name: "Веб-камера",
        category: "Аксессуары",
        price: 35000
    }
];


// Получаем элементы страницы

const catalog = document.querySelector("#catalog");
const message = document.querySelector("#message");
const maxPrice = document.querySelector("#maxPrice");


// Функция вывода товаров

function showProducts(productList) {

    catalog.innerHTML = "";

    if (productList.length === 0) {

        message.textContent =
            "Товаров с такой ценой не найдено.";

        return;
    }

    message.textContent =
        `Найдено товаров: ${productList.length}`;


    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product";

        card.innerHTML = `
            <h3>${product.name}</h3>

            <p class="category">
                Категория: ${product.category}
            </p>

            <p class="price">
                ${product.price.toLocaleString("ru-RU")} ₸
            </p>
        `;

        catalog.appendChild(card);
    });
}


// При загрузке страницы показываем все товары

showProducts(products);


// Фильтрация по цене

document.querySelector("#filterButton")
    .addEventListener("click", () => {

        const price = Number(maxPrice.value);

        if (!maxPrice.value) {

            showProducts(products);

            return;
        }

        const filteredProducts =
            products.filter(product =>
                product.price <= price
            );

        showProducts(filteredProducts);
    });


// Кнопка "Показать все"

document.querySelector("#showAll")
    .addEventListener("click", () => {

        maxPrice.value = "";

        showProducts(products);
    });
