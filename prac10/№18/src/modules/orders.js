// Управление заказами
let order = [];
let status = "Не оформлен";

// Добавление блюда
export function addToOrder(item) {
    const existing = order.find(x => x.id === item.id);

    if (existing) {
        existing.quantity++;
    } else {
        order.push({
            ...item,
            quantity: 1
        });
    }

    status = "Редактируется";
}

// Удаление блюда
export function removeFromOrder(id) {
    order = order.filter(item => item.id !== Number(id));

    status = order.length
        ? "Редактируется"
        : "Не оформлен";
}

// Получение заказа
export function getOrder() {
    return order.map(item => ({ ...item }));
}

// Очистка заказа
export function clearOrder() {
    order = [];
    status = "Не оформлен";
}

// Статус заказа
export function getStatus() {
    return status;
}

// Оформление заказа
export function placeOrder() {
    if (order.length === 0) {
        return false;
    }

    status = "Принят в обработку";
    return true;
}