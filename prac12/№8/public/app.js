const authCard = document.getElementById('authCard');
const appCard = document.getElementById('appCard');
const authError = document.getElementById('authError');
const accessBanner = document.getElementById('accessBanner');

async function initSession() {
    const res = await fetch('/api/me');
    if (res.ok) {
        const user = await res.json();
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRoleBadge').textContent = `Роль: ${user.role}`;
        authCard.classList.add('hidden');
        appCard.classList.remove('hidden');

        // Автоматически загружаем раздел, соответствующий роли
        const defaultEndpoint = user.role === 'teacher' ? '/api/teacher-data' : '/api/student-data';
        loadSection(defaultEndpoint);
    } else {
        authCard.classList.remove('hidden');
        appCard.classList.add('hidden');
    }
}

async function loadSection(endpoint) {
    accessBanner.classList.add('hidden');
    const res = await fetch(endpoint);
    const data = await res.json();

    if (!res.ok) {
        accessBanner.textContent = data.error;
        accessBanner.className = 'banner error';
        document.getElementById('sectionTitle').textContent = 'Доступ ограничен';
        document.getElementById('sectionList').innerHTML = '';
        return;
    }

    accessBanner.textContent = `Сервер подтвердил права доступа (${res.status} OK)`;
    accessBanner.className = 'banner success';
    document.getElementById('sectionTitle').textContent = data.title;
    document.getElementById('sectionList').innerHTML = data.items.map(i => `<li>${i}</li>`).join('');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.classList.add('hidden');

    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value.trim();

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
    });

    const data = await res.json();
    if (!res.ok) {
        authError.textContent = data.error;
        authError.classList.remove('hidden');
        return;
    }

    e.target.reset();
    await initSession();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => loadSection(btn.dataset.endpoint));
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    await initSession();
});

initSession();