// Расчёт общей стоимости
export function calculateTotal(order) {
    return order.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}

// Форматирование цены
export function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price);
}