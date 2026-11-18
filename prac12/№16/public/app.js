let timerInterval = null;
let currentUser = null;

function notify(text, isError = false) {
    const el = document.getElementById('globalAlert');
    el.textContent = text;
    el.className = `msg ${isError ? 'error' : 'success'}`;
    setTimeout(() => el.classList.add('hidden'), 5000);
}

function startSessionTimer(secondsLeft) {
    clearInterval(timerInterval);
    let remaining = secondsLeft;

    const updateDisplay = () => {
        const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
        const secs = String(remaining % 60).padStart(2, '0');
        document.getElementById('sessionTimer').textContent = `Сессия: ${mins}:${secs}`;
        if (remaining <= 0) {
            clearInterval(timerInterval);
            checkSession();
        }
        remaining--;
    };

    updateDisplay();
    timerInterval = setInterval(updateDisplay, 1000);
}

async function checkSession() {
    const res = await fetch('/api/session');
    if (!res.ok) {
        clearInterval(timerInterval);
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('dashboardScreen').classList.add('hidden');
        return;
    }

    currentUser = await res.json();
    document.getElementById('currentUserBadge').textContent = `${currentUser.name} (${currentUser.role})`;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');

    startSessionTimer(currentUser.remainingSeconds);
    await loadUsers();
    if (currentUser.role === 'admin') {
        await loadAuditLog();
    } else {
        document.getElementById('auditTableBody').innerHTML = '';
    }
}

async function loadUsers() {
    const res = await fetch('/api/users');
    if (!res.ok) return;
    const users = await res.json();

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td><strong>${u.login}</strong></td>
            <td>${u.name}</td>
            <td><span class="tag ${u.role}">${u.role}</span></td>
            <td><span class="tag ${u.active ? 'active' : 'blocked'}">${u.active ? 'Активен' : 'Заблокирован'}</span></td>
            <td>
                <button class="btn action" onclick="updateUser(${u.id}, { role: '${u.role === 'admin' ? 'viewer' : 'admin'}' })">
                    Сменить роль
                </button>
                <button class="btn action" onclick="updateUser(${u.id}, { active: ${!u.active} })">
                    ${u.active ? 'Блокировать' : 'Разблокировать'}
                </button>
            </td>
        </tr>
    `).join('');
}

// Намеренно разрешаем клик даже роли viewer, чтобы продемонстрировать серверную защиту 403
window.updateUser = async (id, payload) => {
    const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
        notify(`Ошибка (${res.status}): ${data.error}`, true);
        return;
    }

    notify('Данные пользователя обновлены.');
    await loadUsers();
    if (currentUser.role === 'admin') await loadAuditLog();
};

async function loadAuditLog() {
    const res = await fetch('/api/audit');
    const data = await res.json();

    if (!res.ok) {
        notify(`Ошибка доступа к журналу (${res.status}): ${data.error}`, true);
        return;
    }

    document.getElementById('auditTableBody').innerHTML = data.map(row => `
        <tr>
            <td>${row.time}</td>
            <td><b>${row.actor}</b></td>
            <td><code>${row.action}</code></td>
            <td>${row.status}</td>
            <td>${row.details}</td>
        </tr>
    `).join('');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('loginAlert');
    alertBox.classList.add('hidden');

    const login = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
    });

    const data = await res.json();
    if (!res.ok) {
        alertBox.textContent = data.error;
        alertBox.classList.remove('hidden');
        return;
    }

    e.target.reset();
    await checkSession();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    await checkSession();
});

document.getElementById('refreshBtn').addEventListener('click', loadUsers);
document.getElementById('loadAuditBtn').addEventListener('click', loadAuditLog);

checkSession();