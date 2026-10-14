// Данные аудиторий
const rooms = [
    { id: 1, name: "🚪 Аудитория 101 (Лекционная)", capacity: 90, equipment: "Проектор, Доска, Микрофон" },
    { id: 2, name: "💻 Аудитория 204 (Компьютерный класс)", capacity: 30, equipment: "30 ПК, Проектор, Терминал" },
    { id: 3, name: "🔬 Аудитория 305 (Лаборатория физики)", capacity: 25, equipment: "Спец. оборудование, Вытяжка" },
    { id: 4, name: "📊 Аудитория 410 (Семинарская)", capacity: 45, "equipment": "Интерактивная панель, ТВ" }
  ];
  
  // Массив бронирований с начальными тестовыми данными
  const bookings = [
    { id: 1, roomId: 1, title: "Лекция по Алгоритмам", date: "2026-06-10", timeStart: "09:00", timeEnd: "10:30" }
  ];
  
  // DOM-элементы
  const contentEl = document.querySelector("#content");
  const navButtons = document.querySelectorAll("[data-page]");
  const bookingBadge = document.querySelector("#booking-badge");
  
  // Переключение страниц
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderPage(btn.dataset.page);
    });
  });
  
  // Главная функция рендеринга
  function renderPage(page) {
    contentEl.innerHTML = "";
    updateBadge();
  
    if (page === "rooms") {
      renderRooms();
    } else if (page === "bookings") {
      renderBookings();
    } else if (page === "rules") {
      renderRules();
    }
  }
  
  // 1. Вкладка «Аудитории»
  function renderRooms() {
    const title = document.createElement("h2");
    title.textContent = "Доступные аудитории";
    contentEl.appendChild(title);
  
    const grid = document.createElement("div");
    grid.className = "grid";
  
    rooms.forEach(room => {
      const card = document.createElement("div");
      card.className = "card";
  
      const name = document.createElement("h3");
      name.textContent = room.name;
  
      const cap = document.createElement("div");
      cap.className = "badge-room";
      cap.textContent = `Вместимость: ${room.capacity} мест`;
  
      const eq = document.createElement("p");
      eq.textContent = `Оборудование: ${room.equipment}`;
  
      const btn = document.createElement("button");
      btn.className = "btn-primary";
      btn.textContent = "Забронировать";
      btn.addEventListener("click", () => {
        // Переключаемся на вкладку бронирования с автовыбором аудитории
        navButtons.forEach(b => b.classList.remove("active"));
        document.querySelector('[data-page="bookings"]').classList.add("active");
        renderBookings(room.id);
      });
  
      card.appendChild(name);
      card.appendChild(cap);
      card.appendChild(eq);
      card.appendChild(btn);
  
      grid.appendChild(card);
    });
  
    contentEl.appendChild(grid);
  }
  
  // 2. Вкладка «Бронирования» (с формой проверки пересечения времени)
  function renderBookings(preselectedRoomId = null) {
    const title = document.createElement("h2");
    title.textContent = "Управление бронированием";
    contentEl.appendChild(title);
  
    // Форма добавления брони
    const formCard = document.createElement("div");
    formCard.className = "form-card";
  
    const formTitle = document.createElement("h3");
    formTitle.textContent = "Забронировать аудиторию";
    formCard.appendChild(formTitle);
  
    const form = document.createElement("form");
    form.innerHTML = `
      <div class="form-group">
        <label>Аудитория:</label>
        <select id="room-select">
          ${rooms.map(r => `<option value="\${r.id}" ${r.id === preselectedRoomId ? 'selected' : ''}>${r.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Цель / Название мероприятия:</label>
        <input type="text" id="event-title" placeholder="Например: Защита проектов" required>
      </div>
      <div class="form-group">
        <label>Дата:</label>
        <input type="date" id="event-date" required>
      </div>
      <div class="form-group">
        <label>Время начала:</label>
        <input type="time" id="event-start" required>
      </div>
      <div class="form-group">
        <label>Время окончания:</label>
        <input type="time" id="event-end" required>
      </div>
      <div id="form-message"></div>
      <button type="submit" class="btn-primary" style="margin-top: 10px;">Проверить и забронировать</button>
    `;
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const roomId = Number(form.querySelector("#room-select").value);
      const eventTitle = form.querySelector("#event-title").value.trim();
      const date = form.querySelector("#event-date").value;
      const timeStart = form.querySelector("#event-start").value;
      const timeEnd = form.querySelector("#event-end").value;
      const msgDiv = form.querySelector("#form-message");
  
      msgDiv.innerHTML = "";
  
      // Валидация времени
      if (timeStart >= timeEnd) {
        msgDiv.innerHTML = `<div class="error-msg">Ошибка: время окончания должно быть позже времени начала!</div>`;
        return;
      }
  
      // Проверка на пересечение времени для конкретной аудитории в ту же дату
      const hasConflict = bookings.some(b => {
        if (b.roomId !== roomId || b.date !== date) return false;
        // Пересечение: (StartA < EndB) и (EndA > StartB)
        return (timeStart < b.timeEnd) && (timeEnd > b.timeStart);
      });
  
      if (hasConflict) {
        msgDiv.innerHTML = `<div class="error-msg">⚠️ Ошибка: аудитория уже занята в указанное время! Выберите другой слот.</div>`;
        return;
      }
  
      // Добавление бронирования
      const newBooking = {
        id: Date.now(),
        roomId,
        title: eventTitle,
        date,
        timeStart,
        timeEnd
      };
  
      bookings.push(newBooking);
      updateBadge();
      renderBookings(); // Перерисовываем вкладку
    });
  
    formCard.appendChild(form);
    contentEl.appendChild(formCard);
  
    // Список существующих бронирований
    const listTitle = document.createElement("h3");
    listTitle.textContent = "Активные бронирования";
    listTitle.style.marginTop = "20px";
    contentEl.appendChild(listTitle);
  
    if (bookings.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Активных бронирований пока нет.";
      empty.style.color = "#666";
      empty.style.marginTop = "10px";
      contentEl.appendChild(empty);
      return;
    }
  
    bookings.forEach(b => {
      const room = rooms.find(r => r.id === b.roomId);
      const item = document.createElement("div");
      item.className = "booking-item";
  
      const info = document.createElement("div");
      info.className = "booking-info";
      info.innerHTML = `
        <h4>${b.title} (${room ? room.name : 'Аудитория'})</h4>
        <p>📅 Дата: ${b.date} | ⏰ Время: ${b.timeStart} - ${b.timeEnd}</p>
      `;
  
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "btn-danger";
      cancelBtn.textContent = "Отменить";
      cancelBtn.addEventListener("click", () => {
        const index = bookings.findIndex(x => x.id === b.id);
        if (index !== -1) {
          bookings.splice(index, 1);
          updateBadge();
          renderBookings();
        }
      });
  
      item.appendChild(info);
      item.appendChild(cancelBtn);
      contentEl.appendChild(item);
    });
  }
  
  // 3. Вкладка «Правила»
  function renderRules() {
    const card = document.createElement("div");
    card.className = "rules-card";
  
    const title = document.createElement("h2");
    title.textContent = "Правила бронирования аудиторий";
  
    const desc = document.createElement("p");
    desc.textContent = "Соблюдение регламента бронирования обеспечивает комфортное проведение учебных и внеучебных мероприятий в университете.";
  
    const ul = document.createElement("ul");
    ul.innerHTML = `
      <li>Заявки на бронирование принимаются студентами и преподавателями не менее чем за 2 часа до начала мероприятия.</li>
      <li>Система автоматически проверяет пересечение временных интервалов. При совпадении времени бронь отклоняется.</li>
      <li>Максимальное время непрерывного бронирования одной аудитории — 4 часа.</li>
      <li>Ответственное лицо обязано освободить аудиторию за 5 минут до окончания забронированного интервала.</li>
      <li>За порчу или некорректное использование мультимедийного оборудования налагается дисциплинарная ответственность.</li>
    `;
  
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(ul);
    contentEl.appendChild(card);
  }
  
  // Обновление счетчика в бейдже навигации
  function updateBadge() {
    bookingBadge.textContent = bookings.length;
  }
  
  // Инициализация при старте
  renderPage("rooms");