const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const hash = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');

const USERS = [
    { login: 'student', passwordHash: hash('1234'), name: 'Мадияр Жантлеуов', role: 'student' },
    { login: 'teacher', passwordHash: hash('1234'), name: 'Дархан Касымов', role: 'teacher' }
];

const sessions = new Map();

// Проверка аутентификации (401)
function authMiddleware(req, res, next) {
    const sid = req.cookies.sid;
    if (!sid || !sessions.has(sid)) {
        return res.status(401).json({ error: 'Необходимо войти в систему (401 Unauthorized).' });
    }
    req.user = sessions.get(sid);
    next();
}

// Проверка роли (403)
function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({
                error: `Доступ запрещен (403 Forbidden). Ваша роль: "${req.user.role}", требуется: "${role}".`
            });
        }
        next();
    };
}

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль.' });
    }

    const user = USERS.find(u => u.login === login && u.passwordHash === hash(password));
    if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные.' });
    }

    const sid = crypto.randomBytes(24).toString('hex');
    sessions.set(sid, { login: user.login, name: user.name, role: user.role });

    res.cookie('sid', sid, { httpOnly: true, sameSite: 'strict' });
    res.json({ name: user.name, role: user.role });
});

app.get('/api/me', authMiddleware, (req, res) => {
    res.json(req.user);
});

// Ресурс только для студентов
app.get('/api/student-data', authMiddleware, requireRole('student'), (req, res) => {
    res.json({
        title: 'Зачетная книжка и задания студента',
        items: [
            'Языки и технология программирования — Лабораторная №12 (Сдано)',
            'Базы данных — Проектирование ER-диаграммы (В работе)',
            'Операционные системы — Управление процессами (Оценка: 95)'
        ]
    });
});

// Ресурс только для преподавателей
app.get('/api/teacher-data', authMiddleware, requireRole('teacher'), (req, res) => {
    res.json({
        title: 'Ведомость преподавателя (Группа ИС-25-22)',
        items: [
            'Жантлеуов Мадияр — Допущен к защите ЛР №12',
            'Сериков Алихан — Лабораторная №11: 90 баллов',
            'Омарова Амина — Лабораторная №11: 95 баллов'
        ]
    });
});

app.post('/api/logout', (req, res) => {
    sessions.delete(req.cookies.sid);
    res.clearCookie('sid');
    res.json({ ok: true });
});

app.listen(3000, () => console.log('Вариант 8 запущен: http://localhost:3000'));