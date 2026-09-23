const form = document.getElementById("ticketForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const city = document.getElementById("city").value;
    const ticketType = document.querySelector(
        'input[name="ticketType"]:checked'
    );
    const agree = document.getElementById("agree").checked;

    if (name === "") {
        message.textContent = "Введите имя.";
        message.style.color = "red";
        return;
    }

    if (city === "") {
        message.textContent = "Выберите город назначения.";
        message.style.color = "red";
        return;
    }

    if (!ticketType) {
        message.textContent = "Выберите тип билета.";
        message.style.color = "red";
        return;
    }

    if (!agree) {
        message.textContent = "Необходимо подтвердить согласие.";
        message.style.color = "red";
        return;
    }

    message.textContent =
        `Билет успешно заказан! ${name}, направление: ${city}, ` +
        `тип билета: ${ticketType.value}.`;
    message.style.color = "green";
});
