const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const hash = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');
const SESSION_TTL_MS = 10 * 60 * 1000; // 10 минут

// База пользователей
const users = [
    { id: 1, login: 'admin', passwordHash: hash('admin123'), name: 'Администратор Системы', role: 'admin', active: true },
    { id: 2, login: 'operator', passwordHash: hash('user123'), name: 'Оператор Мониторинга', role: 'viewer', active: true },
    { id: 3, login: 'intern', passwordHash: hash('intern123'), name: 'Стажер Отдела ИБ', role: 'viewer', active: false }
];

// Журнал аудита безопасности
const auditLogs = [];
function logEvent(actor, action, status, details) {
    auditLogs.unshift({
        time: new Date().toLocaleTimeString('ru-RU'),
        actor: actor || 'Гость',
        action,
        status,
        details
    });
    if (auditLogs.length > 50) auditLogs.pop();
}

// Хранилище сессий
const sessions = new Map();

// Middleware проверки сессии и срока ее действия
function requireSession(req, res, next) {
    const sid = req.cookies.iam_sid;
    if (!sid || !sessions.has(sid)) {
        return res.status(401).json({ error: 'Сессия не найдена или недействительна (401).' });
    }

    const session = sessions.get(sid);
    if (Date.now() > session.expiresAt) {
        sessions.delete(sid);
        res.clearCookie('iam_sid');
        logEvent(session.login, 'SESSION_EXPIRE', 'WARN', 'Срок действия сессии истек');
        return res.status(401).json({ error: 'Срок действия сессии истек. Выполните вход повторно.' });
    }

    const currentUser = users.find(u => u.id === session.userId);
    if (!currentUser || !currentUser.active) {
        sessions.delete(sid);
        res.clearCookie('iam_sid');
        return res.status(403).json({ error: 'Учетная запись заблокирована администратором.' });
    }

    req.session = session;
    req.user = currentUser;
    next();
}

// Middleware проверки прав администратора
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        logEvent(req.user.login, 'ACCESS_DENIED', '403', `Попытка вызова ${req.method} ${req.originalUrl}`);
        return res.status(403).json({ error: 'Недостаточно прав. Требуется роль admin (403 Forbidden).' });
    }
    next();
}

// Вход в систему
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ error: 'Укажите логин и пароль.' });
    }

    const user = users.find(u => u.login === login);
    if (!user || user.passwordHash !== hash(password)) {
        logEvent(login, 'LOGIN_FAILED', '401', 'Неверный логин или пароль');
        return res.status(401).json({ error: 'Неверный логин или пароль.' });
    }

    if (!user.active) {
        logEvent(login, 'LOGIN_BLOCKED', '403', 'Попытка входа в отключенный аккаунт');
        return res.status(403).json({ error: 'Учетная запись отключена. Обратитесь к администратору.' });
    }

    const sid = crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + SESSION_TTL_MS;
    sessions.set(sid, { userId: user.id, login: user.login, expiresAt });

    res.cookie('iam_sid', sid, { httpOnly: true, sameSite: 'strict', maxAge: SESSION_TTL_MS });
    logEvent(user.login, 'LOGIN_SUCCESS', '200', `Успешный вход (роль: ${user.role})`);

    res.json({ message: 'OK' });
});

// Текущий профиль и остаток времени сессии
app.get('/api/session', requireSession, (req, res) => {
    res.json({
        id: req.user.id,
        login: req.user.login,
        name: req.user.name,
        role: req.user.role,
        remainingSeconds: Math.max(0, Math.floor((req.session.expiresAt - Date.now()) / 1000))
    });
});

// Защищенный API: Список пользователей (доступен авторизованным)
app.get('/api/users', requireSession, (req, res) => {
    const safeUsers = users.map(({ id, login, name, role, active }) => ({ id, login, name, role, active }));
    res.json(safeUsers);
});

// Защищенный API: Изменение роли или статуса пользователя (только admin)
app.patch('/api/users/:id', requireSession, requireAdmin, (req, res) => {
    const targetId = Number(req.params.id);
    const targetUser = users.find(u => u.id === targetId);

    if (!targetUser) return res.status(404).json({ error: 'Пользователь не найден.' });
    if (targetUser.id === req.user.id) {
        return res.status(400).json({ error: 'Нельзя изменить роль или заблокировать самого себя.' });
    }

    if (req.body.role && ['admin', 'viewer'].includes(req.body.role)) {
        targetUser.role = req.body.role;
        logEvent(req.user.login, 'ROLE_CHANGE', '200', `Пользователю ${targetUser.login} назначена роль ${targetUser.role}`);
    }

    if (typeof req.body.active === 'boolean') {
        targetUser.active = req.body.active;
        logEvent(req.user.login, 'STATUS_CHANGE', '200', `Аккаунт ${targetUser.login}: ${targetUser.active ? 'активирован' : 'заблокирован'}`);
    }

    res.json({ ok: true });
});

// Защищенный API: Журнал событий (только admin)
app.get('/api/audit', requireSession, requireAdmin, (req, res) => {
    res.json(auditLogs);
});

// Выход
app.post('/api/logout', (req, res) => {
    const sid = req.cookies.iam_sid;
    if (sid && sessions.has(sid)) {
        const s = sessions.get(sid);
        logEvent(s.login, 'LOGOUT', '200', 'Пользователь завершил сессию');
        sessions.delete(sid);
    }
    res.clearCookie('iam_sid');
    res.json({ ok: true });
});

app.listen(3000, () => console.log('Вариант 16 запущен: http://localhost:3000'));