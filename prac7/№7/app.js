"use strict";

// Данные спортивного клуба
const clubData = {
    workouts: [
        {
            id: 1,
            icon: "🏋️",
            name: "Силовая тренировка",
            description: "Развитие силы и укрепление мышц всего тела.",
            time: "60 минут",
            level: "Средний",
            trainer: "Александр",
            price: 3000
        },
        {
            id: 2,
            icon: "🧘",
            name: "Йога",
            description: "Гибкость, расслабление и восстановление.",
            time: "45 минут",
            level: "Начальный",
            trainer: "Анна",
            price: 2500
        },
        {
            id: 3,
            icon: "🥊",
            name: "Бокс",
            description: "Кардионагрузка, координация и выносливость.",
            time: "60 минут",
            level: "Продвинутый",
            trainer: "Дмитрий",
            price: 3500
        }
    ],

    trainers: [
        {
            id: 1,
            icon: "💪",
            name: "Александр Петров",
            specialty: "Силовые тренировки",
            experience: "7 лет опыта",
            description: "Помогает развивать силу и набирать мышечную массу."
        },
        {
            id: 2,
            icon: "🧘",
            name: "Анна Смирнова",
            specialty: "Йога и растяжка",
            experience: "5 лет опыта",
            description: "Помогает улучшить гибкость и восстановить баланс."
        },
        {
            id: 3,
            icon: "🥊",
            name: "Дмитрий Иванов",
            specialty: "Бокс и фитнес",
            experience: "8 лет опыта",
            description: "Развивает выносливость и обучает технике бокса."
        }
    ],

    memberships: [
        {
            id: 1,
            name: "Старт",
            price: 15000,
            duration: "1 месяц",
            features: ["8 посещений", "Тренажёрный зал", "Раздевалка"]
        },
        {
            id: 2,
            name: "Стандарт",
            price: 25000,
            duration: "1 месяц",
            features: ["Безлимитные посещения", "Групповые занятия", "Раздевалка"]
        },
        {
            id: 3,
            name: "Премиум",
            price: 40000,
            duration: "1 месяц",
            features: ["Все услуги Стандарта", "2 занятия с тренером", "Приоритетная запись"]
        }
    ]
};

// Состояние приложения
const state = {
    activePage: "workouts",
    bookedWorkouts: [],
    selectedMembership: null
};

// Основные элементы страницы
const content = document.querySelector("#content");
const tabs = document.querySelectorAll(".tab");
const notice = document.querySelector("#notice");

// Создание текстового элемента без вставки HTML
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = String(text);
    }

    return element;
}

// Создание кнопки
function createButton(text, className, onClick) {
    const button = createElement("button", className, text);
    button.type = "button";
    button.addEventListener("click", onClick);

    return button;
}

// Форматирование цены в тенге
function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₸";
}

// Создание заголовка раздела
function createHeading(title, description) {
    const wrapper = createElement("div", "");

    wrapper.append(
        createElement("h2", "section-heading", title),
        createElement("p", "section-description", description)
    );

    return wrapper;
}

// Создание карточки тренировки
function createWorkoutCard(workout) {
    const card = createElement("article", "card");
    const icon = createElement("div", "card-icon", workout.icon);

    icon.setAttribute("aria-hidden", "true");

    card.append(
        icon,
        createElement("h3", "", workout.name),
        createElement("p", "", workout.description)
    );

    const details = createElement("div", "card-details");

    details.append(
        createElement("p", "", "⏱ Длительность: " + workout.time),
        createElement("p", "", "🎯 Уровень: " + workout.level),
        createElement("p", "", "Тренер: " + workout.trainer)
    );

    const bottom = createElement("div", "card-bottom");
    bottom.append(
        createElement("div", "price", formatPrice(workout.price))
    );

    const isBooked = state.bookedWorkouts.includes(workout.id);

    const button = createButton(
        isBooked ? "Вы записаны" : "Записаться",
        isBooked ? "secondary-button" : "primary-button",
        () => {
            if (state.bookedWorkouts.includes(workout.id)) {
                showNotice("Вы уже записаны на эту тренировку.");
                return;
            }

            state.bookedWorkouts.push(workout.id);
            showNotice("Вы успешно записались: " + workout.name + ".");
            renderPage();
        }
    );

    if (isBooked) {
        button.disabled = true;
    }

    bottom.append(button);
    card.append(details, bottom);

    return card;
}

// Создание карточки тренера
function createTrainerCard(trainer) {
    const card = createElement("article", "card");
    const icon = createElement("div", "card-icon", trainer.icon);

    icon.setAttribute("aria-hidden", "true");

    card.append(
        icon,
        createElement("h3", "", trainer.name),
        createElement("p", "", trainer.specialty)
    );

    const details = createElement("div", "card-details");

    details.append(
        createElement("p", "", trainer.experience),
        createElement("p", "", trainer.description)
    );

    card.append(details);

    return card;
}

// Создание карточки абонемента
function createMembershipCard(membership) {
    const card = createElement("article", "card");

    card.append(
        createElement("div", "card-icon", "🎫"),
        createElement("h3", "", membership.name),
        createElement("p", "", "Срок действия: " + membership.duration)
    );

    const details = createElement("div", "card-details");

    membership.features.forEach(feature => {
        details.append(
            createElement("p", "", "✓ " + feature)
        );
    });

    const bottom = createElement("div", "card-bottom");
    bottom.append(
        createElement("div", "price", formatPrice(membership.price))
    );

    const isSelected = state.selectedMembership === membership.id;

    const button = createButton(
        isSelected ? "Абонемент выбран" : "Выбрать абонемент",
        isSelected ? "secondary-button" : "primary-button",
        () => {
            state.selectedMembership = membership.id;
            showNotice(
                "Вы выбрали абонемент «" + membership.name + "»."
            );
            renderPage();
        }
    );

    if (isSelected) {
        button.disabled = true;
    }

    bottom.append(button);
    card.append(details, bottom);

    return card;
}

// Создание статистики
function createStats() {
    const stats = createElement("div", "stats");

    const selectedMembership = clubData.memberships.find(
        item => item.id === state.selectedMembership
    );

    const items = [
        ["3", "Вида тренировок"],
        [String(state.bookedWorkouts.length), "Записей на тренировки"],
        [
            selectedMembership ? selectedMembership.name : "Не выбран",
            "Твой абонемент"
        ]
    ];

    items.forEach(([value, label]) => {
        const stat = createElement("div", "stat");

        stat.append(
            createElement("strong", "", value),
            createElement("span", "", label)
        );

        stats.append(stat);
    });

    return stats;
}

// Отображение тренировок
function renderWorkouts() {
    content.append(
        createHeading(
            "Наши тренировки",
            "Выбери подходящее направление и запишись на занятие."
        ),
        createStats()
    );

    const cards = createElement("div", "cards");

    clubData.workouts.forEach(workout => {
        cards.append(createWorkoutCard(workout));
    });

    content.append(cards);
}

// Отображение тренеров
function renderTrainers() {
    content.append(
        createHeading(
            "Наши тренеры",
            "Профессионалы, которые помогут достичь твоих целей."
        )
    );

    const cards = createElement("div", "cards");

    clubData.trainers.forEach(trainer => {
        cards.append(createTrainerCard(trainer));
    });

    content.append(cards);
}

// Отображение абонементов
function renderMemberships() {
    content.append(
        createHeading(
            "Абонементы",
            "Выбери подходящий тариф для регулярных занятий."
        ),
        createStats()
    );

    const cards = createElement("div", "cards");

    clubData.memberships.forEach(membership => {
        cards.append(createMembershipCard(membership));
    });

    content.append(cards);
}

// Переключение содержимого вкладок
function renderPage() {
    content.replaceChildren();

    if (state.activePage === "workouts") {
        renderWorkouts();
    } else if (state.activePage === "trainers") {
        renderTrainers();
    } else if (state.activePage === "memberships") {
        renderMemberships();
    }

    // Обновляем оформление и состояние доступности вкладок
    tabs.forEach(tab => {
        const isActive = tab.dataset.page === state.activePage;

        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });
}

// Сообщения пользователю
function showNotice(message) {
    notice.textContent = message;
}

// Обработка кликов по вкладкам
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        state.activePage = tab.dataset.page;
        showNotice("");
        renderPage();
    });
});

// Клавиатурная навигация между вкладками
const tabList = document.querySelector(".tabs");

tabList.addEventListener("keydown", event => {
    const currentIndex = Array.from(tabs).indexOf(document.activeElement);

    if (currentIndex === -1) {
        return;
    }

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else {
        return;
    }

    event.preventDefault();

    tabs[nextIndex].focus();
    tabs[nextIndex].click();
});

// Первоначальная загрузка приложения
renderPage();