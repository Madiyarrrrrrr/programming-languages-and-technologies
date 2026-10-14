// Данные о товарах с наглядными эмодзи
const products = [
    { id: 1, name: "📱 Смартфон TechPhone Pro", category: "Смартфоны", price: 75000, desc: "Флагманский смартфон с мощным процессором и отличной камерой." },
    { id: 2, name: "💻 Ноутбук Ultrawide 15", category: "Ноутбуки", price: 120000, desc: "Легкий и производительный ноутбук для работы и учебы." },
    { id: 3, name: "🎧 Беспроводные наушники SoundAir", category: "Аудио", price: 15000, desc: "Активное шумоподавление и до 30 часов работы от одного заряда." },
    { id: 4, name: "⌚ Умные часы FitPulse", category: "Гаджеты", price: 22000, desc: "Мониторинг пульса, сна, активности и защита от воды IP68." },
    { id: 5, name: "🖱️ Игровая мышь CyberGrip", category: "Аксессуары", price: 6500, desc: "Оптический сенсор 16000 DPI и настраиваемая RGB-подсветка." },
    { id: 6, name: "⌨️ Механическая клавиатура KeyPro", category: "Аксессуары", price: 12500, desc: "Надежные переключатели и прочный алюминиевый корпус." },
    { id: 7, name: "📲 Планшет TabPad 11", category: "Планшеты", price: 48000, desc: "Яркий 2K экран, поддержка стилуса и качественный звук." },
    { id: 8, name: "🔊 Портативная колонка BoomBox", category: "Аудио", price: 18000, desc: "Мощный басовитый звук и влагозащищенный корпус для отдыха на природе." }
  ];
  
  // Состояние корзины: { productId: quantity }
  const cart = {};
  
  // DOM-элементы
  const contentEl = document.querySelector("#content");
  const navButtons = document.querySelectorAll("[data-page]");
  const cartBadge = document.querySelector("#cart-badge");
  
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
    contentEl.innerHTML = ""; // Очищаем контейнер
  
    if (page === "catalog") {
      renderCatalog();
    } else if (page === "cart") {
      renderCart();
    } else if (page === "about") {
      renderAbout();
    }
  }
  
  // 1. Отображение каталога
  function renderCatalog() {
    const title = document.createElement("h2");
    title.textContent = "Каталог товаров";
    contentEl.appendChild(title);
  
    const grid = document.createElement("div");
    grid.className = "grid";
  
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
  
      const name = document.createElement("h3");
      name.textContent = product.name;
  
      const desc = document.createElement("p");
      desc.textContent = product.desc;
  
      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `${product.price.toLocaleString()} ₸`;
  
      const btn = document.createElement("button");
      btn.className = "btn-primary";
      btn.textContent = "В корзину";
      btn.addEventListener("click", () => addToCart(product.id));
  
      card.appendChild(name);
      card.appendChild(desc);
      card.appendChild(price);
      card.appendChild(btn);
  
      grid.appendChild(card);
    });
  
    contentEl.appendChild(grid);
  }
  
  // 2. Отображение корзины
  function renderCart() {
    const title = document.createElement("h2");
    title.textContent = "Ваша корзина";
    contentEl.appendChild(title);
  
    const cartContainer = document.createElement("div");
    cartContainer.className = "cart-list";
  
    const itemIds = Object.keys(cart);
  
    if (itemIds.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "Корзина пока пуста. Выберите товары в каталоге!";
      cartContainer.appendChild(emptyMsg);
      contentEl.appendChild(cartContainer);
      return;
    }
  
    let totalPrice = 0;
  
    itemIds.forEach(id => {
      const product = products.find(p => p.id === Number(id));
      const qty = cart[id];
      const itemSum = product.price * qty;
      totalPrice += itemSum;
  
      const itemRow = document.createElement("div");
      itemRow.className = "cart-item";
  
      const info = document.createElement("span");
      info.textContent = `${product.name} — ${product.price.toLocaleString()} ₸`;
  
      const controls = document.createElement("div");
      controls.className = "cart-controls";
  
      const btnMinus = document.createElement("button");
      btnMinus.className = "btn-qty";
      btnMinus.textContent = "-";
      btnMinus.addEventListener("click", () => changeQty(product.id, -1));
  
      const qtySpan = document.createElement("span");
      qtySpan.textContent = `${qty} шт.`;
  
      const btnPlus = document.createElement("button");
      btnPlus.className = "btn-qty";
      btnPlus.textContent = "+";
      btnPlus.addEventListener("click", () => changeQty(product.id, 1));
  
      const sumSpan = document.createElement("span");
      sumSpan.style.fontWeight = "bold";
      sumSpan.style.width = "100px";
      sumSpan.style.textAlign = "right";
      sumSpan.textContent = `${itemSum.toLocaleString()} ₸`;
  
      controls.appendChild(btnMinus);
      controls.appendChild(qtySpan);
      controls.appendChild(btnPlus);
      controls.appendChild(sumSpan);
  
      itemRow.appendChild(info);
      itemRow.appendChild(controls);
  
      cartContainer.appendChild(itemRow);
    });
  
    const summary = document.createElement("div");
    summary.className = "cart-summary";
    summary.textContent = `Итого к оплате: ${totalPrice.toLocaleString()} ₸`;
  
    cartContainer.appendChild(summary);
    contentEl.appendChild(cartContainer);
  }
  
  // 3. Отображение раздела "О магазине"
  function renderAbout() {
    const card = document.createElement("div");
    card.className = "about-card";
  
    const title = document.createElement("h2");
    title.textContent = "О магазине TechStore";
  
    const desc = document.createElement("p");
    desc.textContent = "TechStore — современный интернет-магазин потребительской электроники и аксессуаров. Мы предлагаем только проверенные устройства от мировых производителей с официальной гарантией.";
  
    const addressTitle = document.createElement("h3");
    addressTitle.textContent = "Контакты и Адрес";
  
    const address = document.createElement("p");
    address.textContent = "📍 Адрес: г. Алматы, пр. Абая, д. 150/2, БЦ «Digital Tower», 3 этаж";
  
    const phone = document.createElement("p");
    phone.textContent = "📞 Телефон: +7 (727) 390-20-26";
  
    const hours = document.createElement("p");
    hours.textContent = "🕒 Время работы: Пн-Сб с 09:00 до 20:00 (Вс — выходной)";
  
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(addressTitle);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(hours);
  
    contentEl.appendChild(card);
  }
  
  // Функционал работы с корзиной
  function addToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    updateCartBadge();
  }
  
  function changeQty(productId, delta) {
    if (cart[productId]) {
      cart[productId] += delta;
      if (cart[productId] <= 0) {
        delete cart[productId];
      }
    }
    updateCartBadge();
    renderCart(); // Перерисовываем корзину
  }
  
  function updateCartBadge() {
    const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
    cartBadge.textContent = totalCount;
  }
  
  // Инициализация при старте
  renderPage("catalog");