import { menu, findMenuItem } from "./modules/menu.js";

import {
    addToOrder,
    removeFromOrder,
    getOrder,
    clearOrder,
    getStatus,
    placeOrder
} from "./modules/orders.js";

import { calculateTotal } from "./modules/pricing.js";

import {
    renderMenu,
    renderOrder,
    renderTotal
} from "./modules/ui.js";

// Обновление интерфейса
function update() {
    const order = getOrder();

    renderOrder(order, id => {
        removeFromOrder(id);
        update();
    });

    renderTotal(calculateTotal(order));
}

// Отображение меню
renderMenu(menu, id => {
    const item = findMenuItem(id);

    addToOrder(item);
    update();
});

// Оформление заказа
document.getElementById("placeOrder")
    .addEventListener("click", () => {

        const success = placeOrder();

        document.getElementById("status").textContent =
            success
                ? "Заказ успешно оформлен! Статус: Принят в обработку."
                : "Сначала добавьте блюда в заказ.";
    });

// Очистка заказа
document.getElementById("clearOrder")
    .addEventListener("click", () => {

        clearOrder();
        update();

        document.getElementById("status").textContent =
            "Заказ очищен.";
    });

update();