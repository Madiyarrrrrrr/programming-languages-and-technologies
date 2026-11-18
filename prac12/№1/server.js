const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Тестовая учетная запись (в реальности пароли хранятся в виде хешей)
const STUDENT_USER = {
    login: 'student01',
    passwordHash: crypto.createHash('sha256').update('pass123').digest('hex'),
    fullName: 'Алихан Сериков',
    group: 'ИС-25-22',
    gpa: '3.85',
    specialty: 'Информационные системы'
};

// Хранилище активных серверных сессий (sessionId -> данные)
const sessions = new Map();

// Middleware проверки авторизации
function requireAuth(req, res, next) {
    const sid = req.cookies.session_id;
    if (!sid || !sessions.has(sid)) {
        return res.status(401).json({ error: 'Доступ запрещен. Требуется авторизация (401).' });
    }
    req.user = sessions.get(sid);
    next();
}

// Маршрут входа
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password || !login.trim() || !password.trim()) {
        return res.status(400).json({ error: 'Заполните все обязательные поля.' });
    }

    const inputHash = crypto.createHash('sha256').update(password).digest('hex');

    if (login !== STUDENT_USER.login || inputHash !== STUDENT_USER.passwordHash) {
        return res.status(401).json({ error: 'Неверный логин или пароль.' });
    }

    // Создание сессии и установка HttpOnly cookie
    const sessionId = crypto.randomBytes(24).toString('hex');
    sessions.set(sessionId, {
        login: STUDENT_USER.login,
        fullName: STUDENT_USER.fullName,
        group: STUDENT_USER.group,
        gpa: STUDENT_USER.gpa,
        specialty: STUDENT_USER.specialty
    });

    res.cookie('session_id', sessionId, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600 * 1000 // 1 час
    });

    res.json({ message: 'Вход выполнен успешно.' });
});

// Защищенный ресурс: данные кабинета студента
app.get('/api/profile', requireAuth, (req, res) => {
    res.json(req.user);
});

// Выход из системы
app.post('/api/logout', (req, res) => {
    const sid = req.cookies.session_id;
    if (sid) {
        sessions.delete(sid);
    }
    res.clearCookie('session_id');
    res.json({ message: 'Сессия завершена.' });
});

app.listen(3000, () => console.log('Вариант 1 запущен: http://localhost:3000'));