const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'users.db');

// Инициализация БД и создание таблицы
function initUsersDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new sqlite3.Database(DB_PATH);
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        name TEXT DEFAULT '',
        role TEXT DEFAULT 'user',
        active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // ИСПРАВЛЕНО: раньше здесь был хардкод трёх сотрудников (maryankof@mail.ru, ivanov@..., petrov@...).
    // Это неудобно для реальной эксплуатации — добавление/удаление сотрудника требовало
    // менять код и пересобирать сервер. Теперь при пустой БД создаётся только ОДИН
    // сид-админ из переменных окружения (см. .env: ADMIN_EMAIL, ADMIN_NAME).
    // Всех остальных сотрудников админ добавляет через /api/admin/users (см. server.js).
    db.get('SELECT COUNT(*) as cnt FROM users', (err, row) => {
      if (!err && row.cnt === 0) {
        const seedEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        if (seedEmail) {
          const seedName = process.env.ADMIN_NAME || 'Администратор';
          db.run(
            'INSERT OR IGNORE INTO users (email, name, role) VALUES (?, ?, ?)',
            [seedEmail, seedName, 'admin'],
            (insertErr) => {
              if (!insertErr) console.log('📋 Создан первый администратор:', seedEmail);
            }
          );
        } else {
          console.warn('⚠️  Таблица users пуста, а ADMIN_EMAIL не задан в .env — некому будет войти и добавить остальных сотрудников. Задайте ADMIN_EMAIL=you@company.com в .env и перезапустите сервер.');
        }
      }
    });
  });
  db.close();
}

// Поиск пользователя по email
function findUser(email) {
  return new Promise((resolve, reject) => {
    if (!email || typeof email !== 'string') return resolve(null);
    const normalized = email.trim().toLowerCase();
    const db = new sqlite3.Database(DB_PATH);
    db.get(
      'SELECT * FROM users WHERE email = ? AND active = 1',
      [normalized],
      (err, row) => {
        db.close();
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

// Обновление last_login
function updateLastLogin(email) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?',
      [email.toLowerCase()],
      function (err) {
        db.close();
        if (err) reject(err);
        else resolve(this);
      }
    );
  });
}

// Добавить / обновить пользователя (используется из /api/admin/users)
function addUser(email, name = '', role = 'user') {
  return new Promise((resolve, reject) => {
    if (!email || typeof email !== 'string') return reject(new Error('Email обязателен'));
    const normalized = email.trim().toLowerCase();
    const safeRole = role === 'admin' ? 'admin' : 'user';
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'INSERT INTO users (email, name, role, active) VALUES (?, ?, ?, 1) ' +
      'ON CONFLICT(email) DO UPDATE SET name = excluded.name, role = excluded.role, active = 1',
      [normalized, name, safeRole],
      function (err) {
        db.close();
        if (err) reject(err);
        else resolve({ success: true });
      }
    );
  });
}

// Деактивировать пользователя (мягкое удаление — историю last_login не теряем)
function removeUser(email) {
  return new Promise((resolve, reject) => {
    if (!email || typeof email !== 'string') return reject(new Error('Email обязателен'));
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'UPDATE users SET active = 0 WHERE email = ?',
      [email.trim().toLowerCase()],
      function (err) {
        db.close();
        if (err) reject(err);
        else resolve({ success: this.changes > 0 });
      }
    );
  });
}

// Получить всех активных пользователей (для админ-панели в личном кабинете)
function getAllUsers() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all(
      'SELECT email, name, role, active, created_at, last_login FROM users WHERE active = 1 ORDER BY email',
      (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

module.exports = {
  initUsersDb,
  findUser,
  updateLastLogin,
  addUser,
  removeUser,
  getAllUsers,
  DB_PATH
};