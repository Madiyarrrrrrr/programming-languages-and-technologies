const form = document.getElementById("hotelForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const guests = Number(document.getElementById("guests").value);
    const room = document.getElementById("room").value;

    const selectedServices = document.querySelectorAll(
        'input[name="services"]:checked'
    );

    if (name === "") {
        showError("Введите имя.");
        return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
        showError("Количество гостей должно быть от 1 до 6.");
        return;
    }

    if (room === "") {
        showError("Выберите тип номера.");
        return;
    }

    let services = [];

    selectedServices.forEach(function(item) {
        services.push(item.value);
    });

    if (services.length === 0) {
        services.push("без дополнительных услуг");
    }

    message.textContent =
        `Бронирование выполнено! Гость: ${name}. ` +
        `Количество гостей: ${guests}. ` +
        `Номер: ${room}. ` +
        `Услуги: ${services.join(", ")}.`;

    message.style.color = "green";
});

function showError(text) {
    message.textContent = text;
    message.style.color = "red";
}
