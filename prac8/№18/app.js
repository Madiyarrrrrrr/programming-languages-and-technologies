
const STORAGE_KEY = "lab8_room_bookings";

const form = document.querySelector("#bookingForm");
const dateInput = document.querySelector("#date");
const roomInput = document.querySelector("#room");
const startInput = document.querySelector("#startTime");
const endInput = document.querySelector("#endTime");
const personInput = document.querySelector("#person");
const bookingList = document.querySelector("#bookingList");
const countElement = document.querySelector("#count");
const message = document.querySelector("#message");

const exportBtn = document.querySelector("#exportBtn");
const clearBtn = document.querySelector("#clearBtn");

function getToday() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}

dateInput.min = getToday();
dateInput.value = getToday();

// Восстановление данных из localStorage.
function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) return [];

    const data = JSON.parse(raw);

    if (!Array.isArray(data)) return [];

    return data.filter((item) =>
      item &&
      typeof item.id === "string" &&
      typeof item.date === "string" &&
      typeof item.room === "string" &&
      typeof item.startTime === "string" &&
      typeof item.endTime === "string" &&
      typeof item.person === "string"
    );
  } catch (error) {
    console.error("Ошибка чтения JSON:", error);
    return [];
  }
}

let bookings = loadBookings();

// Сохранение массива бронирований.
function saveBookings() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bookings)
    );

    return true;
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    showMessage("Не удалось сохранить данные.", true);
    return false;
  }
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

// Проверка конфликтов для одного помещения и даты.
function hasConflict(newBooking) {
  return bookings.some((booking) => {
    if (
      booking.date !== newBooking.date ||
      booking.room !== newBooking.room
    ) {
      return false;
    }

    return (
      newBooking.startTime < booking.endTime &&
      newBooking.endTime > booking.startTime
    );
  });
}

// Добавление нового бронирования.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = dateInput.value;
  const room = roomInput.value;
  const startTime = startInput.value;
  const endTime = endInput.value;
  const person = personInput.value.trim();

  if (!date || !room || !startTime || !endTime || !person) {
    showMessage("Заполните все поля.", true);
    return;
  }

  if (date < getToday()) {
    showMessage("Нельзя выбрать прошедшую дату.", true);
    return;
  }

  if (startTime >= endTime) {
    showMessage(
      "Время окончания должно быть позже начала.",
      true
    );
    return;
  }

  const booking = {
    id: crypto.randomUUID(),
    date,
    room,
    startTime,
    endTime,
    person
  };

  if (hasConflict(booking)) {
    showMessage(
      "Ошибка: эта комната уже забронирована на выбранное время.",
      true
    );
    return;
  }

  bookings.push(booking);

  if (!saveBookings()) {
    bookings.pop();
    return;
  }

  renderBookings();
  form.reset();
  dateInput.value = getToday();

  showMessage("Бронирование успешно создано!");
});

// Удаление бронирования по идентификатору.
function deleteBooking(id) {
  const previous = bookings;

  bookings = bookings.filter((booking) => booking.id !== id);

  if (!saveBookings()) {
    bookings = previous;
    return;
  }

  renderBookings();
  showMessage("Бронирование удалено.");
}

// Отрисовка списка.
function renderBookings() {
  bookingList.replaceChildren();

  const sorted = [...bookings].sort((a, b) =>
    (a.date + a.startTime).localeCompare(b.date + b.startTime)
  );

  countElement.textContent = `${bookings.length} записей`;

  if (sorted.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Бронирований пока нет.";
    bookingList.append(empty);
    return;
  }

  sorted.forEach((booking) => {
    const card = document.createElement("article");
    card.className = "booking-card";

    const info = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = booking.room;

    const date = document.createElement("p");
    date.textContent = `Дата: ${booking.date}`;

    const time = document.createElement("p");
    time.textContent =
      `Время: ${booking.startTime}–${booking.endTime}`;

    const person = document.createElement("p");
    person.textContent = `Бронирующий: ${booking.person}`;

    info.append(title, date, time, person);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "delete-btn";
    button.textContent = "Удалить";
    button.addEventListener("click", () => {
      deleteBooking(booking.id);
    });

    card.append(info, button);
    bookingList.append(card);
  });
}

// Очистка списка с подтверждением.
clearBtn.addEventListener("click", () => {
  if (bookings.length === 0) {
    showMessage("Список уже пуст.", true);
    return;
  }

  if (!confirm("Удалить все бронирования?")) return;

  const previous = bookings;
  bookings = [];

  if (!saveBookings()) {
    bookings = previous;
    return;
  }

  renderBookings();
  showMessage("Все бронирования удалены.");
});

// Экспорт данных в файл JSON.
exportBtn.addEventListener("click", () => {
  const json = JSON.stringify(bookings, null, 2);
  const blob = new Blob([json], {
    type: "application/json;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "room-bookings.json";
  link.click();

  URL.revokeObjectURL(url);
  showMessage("Данные экспортированы в JSON.");
});

// Первоначальное отображение при открытии страницы.
renderBookings();
