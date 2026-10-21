
const ROOMS = [
    {
      id: "1",
      name: "Переговорная A",
      capacity: 6,
      description: "Небольшие встречи и обсуждения",
      art: "art-one",
      icon: "◫"
    },
    {
      id: "2",
      name: "Переговорная B",
      capacity: 10,
      description: "Командные совещания и презентации",
      art: "art-two",
      icon: "▤"
    },
    {
      id: "3",
      name: "Конференц-зал",
      capacity: 20,
      description: "Большие встречи и мероприятия",
      art: "art-three",
      icon: "▥"
    }
  ];
  
  const STORAGE_KEY = "roomly-bookings-v1";
  
  const roomGrid = document.getElementById("roomsGrid");
  const bookingForm = document.getElementById("bookingForm");
  const bookingTable = document.getElementById("bookingTable");
  const message = document.getElementById("message");
  const dateInput = document.getElementById("date");
  const roomInput = document.getElementById("room");
  
  let bookings = loadBookings();
  let messageTimeout;
  
  function loadBookings() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  
      if (!Array.isArray(data)) {
        return [];
      }
  
      return data.filter(item =>
        item &&
        Number.isInteger(item.id) &&
        typeof item.employee === "string" &&
        typeof item.roomId === "string" &&
        typeof item.date === "string" &&
        typeof item.start === "string" &&
        typeof item.end === "string"
      );
    } catch {
      return [];
    }
  }
  
  function saveBookings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      return true;
    } catch {
      showMessage(
        "Не удалось сохранить данные в браузере.",
        "error"
      );
      return false;
    }
  }
  
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }
  
  function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  function renderRooms() {
    roomGrid.innerHTML = ROOMS.map(room => `
      <article class="room-card">
        <div class="room-art ${room.art}">
          ${room.icon}
        </div>
        <h3>${room.name}</h3>
        <p class="room-description">${room.description}</p>
        <div class="room-meta">
          <span class="room-capacity">
            ♙ ${room.capacity} мест
          </span>
          <span class="room-status" id="room-status-${room.id}">
            Доступна
          </span>
        </div>
        <button
          class="secondary-button room-book-button"
          data-room="${room.id}"
          style="width:100%; margin-top:16px"
          type="button">
          Забронировать
        </button>
      </article>
    `).join("");
  
    roomGrid.querySelectorAll(".room-book-button").forEach(button => {
      button.addEventListener("click", () => {
        roomInput.value = button.dataset.room;
        document.getElementById("bookingFormSection")
          .scrollIntoView({ behavior: "smooth" });
        document.getElementById("employee").focus();
      });
    });
  }
  
  function showMessage(text, type) {
    clearTimeout(messageTimeout);
    message.textContent = text;
    message.className = `message ${type}`;
  
    messageTimeout = setTimeout(() => {
      message.textContent = "";
      message.className = "message";
    }, 5000);
  }
  
  function parseBookingDate(date, time) {
    const value = `${date}T${time}`;
    const parsed = new Date(value);
  
    if (
      Number.isNaN(parsed.getTime()) ||
      getLocalDateString(parsed) !== date ||
      parsed.getHours() !== Number(time.split(":")[0]) ||
      parsed.getMinutes() !== Number(time.split(":")[1])
    ) {
      throw new Error("Проверьте правильность даты и времени.");
    }
  
    return parsed;
  }
  
  function findConflict(roomId, date, start, end) {
    return bookings.some(booking => {
      if (booking.roomId !== roomId || booking.date !== date) {
        return false;
      }
  
      return start < booking.end && end > booking.start;
    });
  }
  
  function createBooking(event) {
    event.preventDefault();
  
    const formData = new FormData(bookingForm);
  
    const employee = String(formData.get("employee") || "").trim();
    const roomId = String(formData.get("room") || "");
    const date = String(formData.get("date") || "");
    const start = String(formData.get("startTime") || "");
    const end = String(formData.get("endTime") || "");
  
    if (!employee || employee.length > 60) {
      showMessage("Введите имя длиной от 1 до 60 символов.", "error");
      return;
    }
  
    if (!ROOMS.some(room => room.id === roomId)) {
      showMessage("Выберите существующую комнату.", "error");
      return;
    }
  
    if (!date || !start || !end) {
      showMessage("Заполните все обязательные поля.", "error");
      return;
    }
  
    try {
      const startDate = parseBookingDate(date, start);
      const endDate = parseBookingDate(date, end);
  
      if (date < getLocalDateString()) {
        showMessage("Нельзя бронировать прошедшую дату.", "error");
        return;
      }
  
      if (endDate <= startDate) {
        showMessage("Окончание должно быть позже начала.", "error");
        return;
      }
    } catch (error) {
      showMessage(error.message, "error");
      return;
    }
  
    if (findConflict(roomId, date, start, end)) {
      showMessage(
        "Эта комната уже занята в выбранный промежуток.",
        "error"
      );
      return;
    }
  
    const room = ROOMS.find(item => item.id === roomId);
  
    const booking = {
      id: bookings.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      employee,
      roomId,
      roomName: room.name,
      date,
      start,
      end
    };
  
    bookings.push(booking);
  
    if (!saveBookings()) {
      bookings.pop();
      return;
    }
  
    bookingForm.reset();
    dateInput.value = getLocalDateString();
    document.getElementById("startTime").value = "10:00";
    document.getElementById("endTime").value = "11:00";
  
    renderAll();
    showMessage(`Бронирование №${booking.id} успешно создано!`, "success");
  }
  
  function cancelBooking(id) {
    const booking = bookings.find(item => item.id === id);
  
    if (!booking) {
      showMessage("Бронирование не найдено.", "error");
      return;
    }
  
    if (!confirm(`Отменить бронирование №${id}?`)) {
      return;
    }
  
    const previous = bookings;
    bookings = bookings.filter(item => item.id !== id);
  
    if (!saveBookings()) {
      bookings = previous;
      return;
    }
  
    renderAll();
    showMessage(`Бронирование №${id} отменено.`, "success");
  }
  
  function formatDate(date) {
    const parts = date.split("-");
  
    if (parts.length !== 3) {
      return date;
    }
  
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  
  function renderBookings() {
    if (bookings.length === 0) {
      bookingTable.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            Бронирований пока нет. Создайте первую бронь!
          </td>
        </tr>
      `;
      return;
    }
  
    const sorted = [...bookings].sort((a, b) =>
      `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)
    );
  
    bookingTable.innerHTML = sorted.map(booking => `
      <tr>
        <td><strong>${escapeHTML(booking.employee)}</strong></td>
        <td>${escapeHTML(booking.roomName || "Переговорная")}</td>
        <td>${escapeHTML(formatDate(booking.date))}</td>
        <td>${escapeHTML(booking.start)}–${escapeHTML(booking.end)}</td>
        <td><span class="status-badge">Забронировано</span></td>
        <td>
          <button class="delete-button"
            type="button"
            data-cancel="${booking.id}">
            Отменить
          </button>
        </td>
      </tr>
    `).join("");
  
    bookingTable.querySelectorAll("[data-cancel]").forEach(button => {
      button.addEventListener("click", () => {
        cancelBooking(Number(button.dataset.cancel));
      });
    });
  }
  
  function renderStats() {
    document.getElementById("totalRooms").textContent = ROOMS.length;
    document.getElementById("totalBookings").textContent = bookings.length;
  
    const now = new Date();
    const currentDate = getLocalDateString(now);
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  
    const occupiedNow = new Set(
      bookings
        .filter(booking =>
          booking.date === currentDate &&
          booking.start <= currentTime &&
          booking.end > currentTime
        )
        .map(booking => booking.roomId)
    );
  
    document.getElementById("freeRooms").textContent =
      ROOMS.length - occupiedNow.size;
  
    ROOMS.forEach(room => {
      const status = document.getElementById(`room-status-${room.id}`);
  
      if (!status) return;
  
      const busy = occupiedNow.has(room.id);
      status.textContent = busy ? "Занята сейчас" : "Доступна";
      status.classList.toggle("busy", busy);
    });
  
    document.getElementById("bookingCount").textContent =
      `${bookings.length} ${getBookingWord(bookings.length)}`;
  }
  
  function getBookingWord(count) {
    const n = Math.abs(count) % 100;
    const last = n % 10;
  
    if (n > 10 && n < 20) return "записей";
    if (last > 1 && last < 5) return "записи";
    if (last === 1) return "запись";
    return "записей";
  }
  
  function renderAll() {
    renderRooms();
    renderBookings();
    renderStats();
  }
  
  bookingForm.addEventListener("submit", createBooking);
  
  document.getElementById("openBooking").addEventListener("click", () => {
    document.getElementById("bookingFormSection")
      .scrollIntoView({ behavior: "smooth" });
    document.getElementById("employee").focus();
  });
  
  bookingForm.addEventListener("reset", () => {
    setTimeout(() => {
      dateInput.value = getLocalDateString();
      document.getElementById("startTime").value = "10:00";
      document.getElementById("endTime").value = "11:00";
      message.textContent = "";
      message.className = "message";
    }, 0);
  });
  
  dateInput.min = getLocalDateString();
  dateInput.value = getLocalDateString();
  
  renderAll();
  