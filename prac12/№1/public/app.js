const loginView = document.getElementById('loginView');
const profileView = document.getElementById('profileView');
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

function showError(text) {
    errorMsg.textContent = text;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    errorMsg.classList.add('hidden');
}

// Загрузка защищенных данных с сервера
async function loadProfile() {
    const res = await fetch('/api/profile');
    if (res.ok) {
        const data = await res.json();
        document.getElementById('studentName').textContent = data.fullName;
        document.getElementById('studentGroup').textContent = data.group;
        document.getElementById('studentSpec').textContent = data.specialty;
        document.getElementById('studentGpa').textContent = data.gpa;
        
        loginView.classList.add('hidden');
        profileView.classList.remove('hidden');
    } else {
        loginView.classList.remove('hidden');
        profileView.classList.add('hidden');
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
    });

    const data = await res.json();
    if (!res.ok) {
        showError(data.error);
        return;
    }

    loginForm.reset();
    await loadProfile();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    await loadProfile();
});

// Кнопка для демонстрации защиты на сервере при тестировании
document.getElementById('testDirectBtn').addEventListener('click', async () => {
    const res = await fetch('/api/profile');
    const data = await res.json();
    showError(`Ответ сервера (${res.status}): ${data.error}`);
});

// Проверка активной сессии при загрузке/обновлении страницы
loadProfile();