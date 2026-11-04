import { formatPrice } from "./pricing.js";

// Отображение меню
export function renderMenu(menu, onAdd) {
    const container = document.getElementById("menuList");

    container.innerHTML = "";

    menu.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <span>${item.name} — ${formatPrice(item.price)} ₸</span>
            <button>Добавить</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            onAdd(item.id);
        });

        container.appendChild(div);
    });
}

// Отображение заказа
export function renderOrder(order, onRemove) {
    const container = document.getElementById("orderList");

    container.innerHTML = "";

    if (order.length === 0) {
        container.textContent = "Ваш заказ пуст.";
        return;
    }

    order.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
            <span>
                ${item.name} × ${item.quantity}
                — ${formatPrice(item.price * item.quantity)} ₸
            </span>
            <button>Удалить</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            onRemove(item.id);
        });

        container.appendChild(div);
    });
}

// Отображение общей суммы
export function renderTotal(total) {
    document.getElementById("total").textContent =
        formatPrice(total);
}