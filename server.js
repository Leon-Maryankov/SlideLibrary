require('dotenv').config();

const fs = require('fs');
const { execSync } = require('child_process');

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function findExecutable(name, defaultPaths = []) {
  const envKey = name.toUpperCase() + '_PATH';
  if (process.env[envKey] && fs.existsSync(process.env[envKey])) {
    return process.env[envKey];
  }

  try {
    const cmd = process.platform === 'win32' ? `where ${name}` : `which ${name}`;
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    const path = output.split('\n')[0].trim();
    if (fs.existsSync(path)) return path;
  } catch (e) {}

  for (const p of defaultPaths) {
    if (fs.existsSync(p)) return p;
  }

  return null;
}

// ========== ПОИСК ИСПОЛНЯЕМЫХ ФАЙЛОВ ==========
const SOFFICE_PATH = findExecutable('soffice', [
  'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
  'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
  '/usr/bin/soffice',
  '/opt/libreoffice/program/soffice',
  '/Applications/LibreOffice.app/Contents/MacOS/soffice'
]);

const PDFTOPPM_PATH = findExecutable('pdftoppm', [
  'C:\\ProgramData\\chocolatey\\bin\\pdftoppm.exe',
  'C:\\Users\\' + process.env.USERNAME + '\\poppler\\Library\\bin\\pdftoppm.exe',
  '/usr/bin/pdftoppm',
  '/usr/local/bin/pdftoppm'
]);

if (!SOFFICE_PATH) console.error('❌ LibreOffice не найден. Установите его или укажите SOFFICE_PATH в .env');
if (!PDFTOPPM_PATH) console.error('❌ Poppler не найден. Установите его или укажите PDFTOPPM_PATH в .env');

// ========== ИМПОРТЫ ==========
const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');
const usersModule = require('./users');

// ========== ИНИЦИАЛИЗАЦИЯ БД ПОЛЬЗОВАТЕЛЕЙ ==========
usersModule.initUsersDb();

// ========== НАСТРОЙКА ПУТЕЙ ==========
const ASSETS_DIR = process.env.ASSETS_DIR || path.join(__dirname, 'assets');

const slidesDir = path.join(ASSETS_DIR, 'slides');
const previewsDir = path.join(ASSETS_DIR, 'previews');
const catalogPath = path.join(ASSETS_DIR, 'catalog.json');
const tileFolders = {
  photos: path.join(ASSETS_DIR, 'photos'),
  illustrations: path.join(ASSETS_DIR, 'illustrations'),
  icons: path.join(ASSETS_DIR, 'icons'),
  logos: path.join(ASSETS_DIR, 'logos')
};

// ========== СОЗДАНИЕ ПАПОК ==========
function ensureDirectories() {
  const dirs = [ASSETS_DIR, slidesDir, previewsDir, ...Object.values(tileFolders)];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Создана папка: ${dir}`);
    }
  });
}
ensureDirectories();

// ========== СОЗДАНИЕ ПУСТОГО КАТАЛОГА ==========
if (!fs.existsSync(catalogPath)) {
  const emptyCatalog = {
    version: new Date().toISOString().slice(0, 7),
    categories: ['Общее'],
    slides: [],
    tiles: []
  };
  fs.writeFileSync(catalogPath, JSON.stringify(emptyCatalog, null, 4));
  console.log('📄 Создан пустой catalog.json');
}

if (SOFFICE_PATH && !fs.existsSync(SOFFICE_PATH)) console.error('❌ LibreOffice не найден по пути:', SOFFICE_PATH);
if (PDFTOPPM_PATH && !fs.existsSync(PDFTOPPM_PATH)) console.error('❌ Poppler не найден по пути:', PDFTOPPM_PATH);

// ========== ГЕНЕРАЦИЯ ПРЕВЬЮ ==========
function generatePreviewsForPptx(pptxPath) {
  const baseName = path.parse(pptxPath).name;
  const outPdf = path.join(previewsDir, `${baseName}.pdf`);
  const outPngDir = path.join(previewsDir, baseName);

  if (!fs.existsSync(outPngDir)) fs.mkdirSync(outPngDir, { recursive: true });

  const cmd1 = `"${SOFFICE_PATH}" --headless --convert-to pdf --outdir "${previewsDir}" "${pptxPath}"`;
  return new Promise((resolve, reject) => {
    exec(cmd1, (err, stdout, stderr) => {
      if (err) {
        console.error('Ошибка конвертации в PDF:', stderr);
        return reject(new Error('Не удалось конвертировать в PDF'));
      }

      const cmd2 = `"${PDFTOPPM_PATH}" -png -r 100 "${outPdf}" "${path.join(outPngDir, 'slide')}"`;
      exec(cmd2, (err2, stdout2, stderr2) => {
        if (err2) {
          console.error('Ошибка разбивки PDF на PNG:', stderr2);
          if (fs.existsSync(outPdf)) fs.unlinkSync(outPdf);
          return reject(new Error('Не удалось создать PNG'));
        }

        if (fs.existsSync(outPdf)) fs.unlinkSync(outPdf);

        const pngFiles = fs.readdirSync(outPngDir).filter(f => f.endsWith('.png')).sort();
        const previews = pngFiles.map(f => `assets/previews/${baseName}/${f}`);
        resolve(previews);
      });
    });
  });
}

// ========== СИНХРОНИЗАЦИЯ КАТАЛОГА ==========
async function syncCatalog() {
  console.log('Синхронизация каталога...');

  if (!fs.existsSync(slidesDir)) {
    console.log('⚠️ Папка slides отсутствует, синхронизация пропущена.');
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  if (!catalog.slides) catalog.slides = [];
  if (!catalog.tiles) catalog.tiles = [];

  let changed = false;

  const pptxFiles = fs.readdirSync(slidesDir).filter(f => f.endsWith('.pptx'));
  for (const pptxFile of pptxFiles) {
    const filePath = `assets/slides/${pptxFile}`;
    const existing = catalog.slides.find(s => s.file === filePath);

    if (!existing) {
      console.log(`➕ Новая презентация: ${pptxFile}`);
      let previews = [];
      try {
        previews = await generatePreviewsForPptx(path.join(slidesDir, pptxFile));
      } catch (e) {
        console.warn('Не удалось сгенерировать превью:', pptxFile, e.message);
      }

      const newSlide = {
        id: 'pub-' + Date.now() + '-' + path.parse(pptxFile).name,
        name: path.parse(pptxFile).name,
        category: 'Общее',
        tags: [],
        file: filePath,
        preview: previews.length ? previews[0] : null,
        previews: previews,
        lastUpdated: new Date().toISOString().slice(0, 7),
        approved: false,
        approvedBy: '-',
        color: '#2688EB',
        scope: 'public',
        kind: 'presentations'
      };
      catalog.slides.push(newSlide);
      changed = true;
    } else {
      if (!existing.preview && !existing.previews) {
        console.log(`⏳ Генерирую превью для существующей: ${pptxFile}`);
        try {
          const previews = await generatePreviewsForPptx(path.join(slidesDir, pptxFile));
          existing.preview = previews.length ? previews[0] : null;
          existing.previews = previews;
          changed = true;
        } catch (e) {
          console.warn('Не удалось сгенерировать превью:', pptxFile, e.message);
        }
      }
    }
  }

  for (const [kind, folder] of Object.entries(tileFolders)) {
    if (!fs.existsSync(folder)) continue;
    const files = fs.readdirSync(folder).filter(f => /\.(png|jpe?g|gif|svg|webp|avif|aviff)$/i.test(f));
    for (const file of files) {
      const filePath = `assets/${kind}/${file}`;
      const exists = catalog.tiles.some(t => t.file === filePath);
      if (!exists) {
        console.log(`➕ Новый тайл: ${filePath}`);
        catalog.tiles.push({
          id: `${kind}-${file.replace(/\.[^.]+$/, '')}-${Date.now()}`,
          name: file.replace(/\.[^.]+$/, ''),
          scope: 'public',
          kind,
          visual: 'image',
          file: filePath,
          preview: filePath,
          format: kind === 'icons' ? (file.split('.').pop() || '') : undefined
        });
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 4));
    console.log('✅ Каталог обновлён!');
  } else {
    console.log('✅ Каталог уже актуален.');
  }
}

// ========== EXPRESS APP ==========
const app = express();
app.use(cors());
app.use(express.json());

// ========== СТАТИКА ==========
app.get('/taskpane.css', (req, res) => {
  res.type('text/css');
  res.sendFile(path.join(__dirname, 'src/taskpane', 'taskpane.css'));
});

app.get('/taskpane.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'src/taskpane', 'taskpane.js'));
});

app.use('/assets', express.static(ASSETS_DIR));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'src/taskpane')));

// Заглушка для favicon (убирает 404 в консоли)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ========== MULTER ==========
const upload = multer({ storage: multer.memoryStorage() });

// ========== АВТОРИЗАЦИЯ ==========

// Вход по email
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email обязателен' });
  }
  try {
    const user = await usersModule.findUser(email);
    if (!user) {
      return res.status(403).json({ error: 'Email не найден в базе сотрудников' });
    }
    await usersModule.updateLastLogin(user.email);
    res.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Проверка авторизации (для авто-входа)
app.get('/api/auth/check', async (req, res) => {
  const email = (req.headers['x-user-email'] || '').toString();
  if (!email) return res.status(401).json({ error: 'Не авторизован' });
  try {
    const user = await usersModule.findUser(email);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });
    res.json({ success: true, user: { email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Мидлвар для защиты API
async function requireAuth(req, res, next) {
  const email = (req.headers['x-user-email'] || '').toString();
  if (!email) return res.status(401).json({ error: 'Требуется авторизация' });
  try {
    const user = await usersModule.findUser(email);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// Мидлвар для роутов, доступных только администратору
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
}

// ========== АДМИНИСТРИРОВАНИЕ СОТРУДНИКОВ ==========
// Список сотрудников (только для admin)
app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await usersModule.getAllUsers();
    res.json({ users });
  } catch (err) {
    console.error('Ошибка получения списка пользователей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить или обновить сотрудника (только для admin)
app.post('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  const { email, name, role } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email обязателен' });
  }
  try {
    await usersModule.addUser(email, name || '', role === 'admin' ? 'admin' : 'user');
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка добавления пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Деактивировать сотрудника (только для admin)
app.delete('/api/admin/users/:email', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await usersModule.removeUser(req.params.email);
    res.json(result);
  } catch (err) {
    console.error('Ошибка удаления пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ========== КАТАЛОГ ==========
app.get('/api/catalog', requireAuth, async (req, res) => {
  try {
    if (!fs.existsSync(catalogPath)) {
      return res.json({ slides: [], tiles: [] });
    }
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const scope = req.query.scope || 'public';

    const slides = (catalog.slides || []).filter(s => (s.scope || 'public') === scope);
    const tiles = (catalog.tiles || []).filter(t => (t.scope || 'public') === scope);

    res.json({ slides, tiles });
  } catch (err) {
    console.error('Ошибка чтения каталога:', err);
    res.status(500).json({ error: 'Ошибка чтения каталога' });
  }
});

// ========== ЗАГРУЗКА ФАЙЛА ==========
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  const { name, tags, category } = req.body;
  const fileBuffer = req.file?.buffer;

  if (!fileBuffer) return res.status(400).json({ error: 'Файл не получен' });
  if (!name) return res.status(400).json({ error: 'Имя не указано' });

  const safeName = name.replace(/[^a-z0-9а-яё\-_ ]/gi, '_').replace(/\s+/g, '_');
  const pptxFileName = `${safeName}_${Date.now()}.pptx`;
  const pptxPath = path.join(slidesDir, pptxFileName);

  fs.writeFileSync(pptxPath, fileBuffer);

  const baseName = path.parse(pptxFileName).name;
  const previewFolder = path.join(previewsDir, baseName);
  if (!fs.existsSync(previewFolder)) fs.mkdirSync(previewFolder, { recursive: true });

  const outPdf = path.join(previewsDir, `${baseName}.pdf`);

  const cmd1 = `"${SOFFICE_PATH}" --headless --convert-to pdf --outdir "${previewsDir}" "${pptxPath}"`;
  exec(cmd1, (err, stdout, stderr) => {
    if (err) {
      console.error('Ошибка конвертации в PDF:', stderr);
      return res.status(500).json({ error: 'Не удалось конвертировать в PDF' });
    }

    const cmd2 = `"${PDFTOPPM_PATH}" -png -r 100 "${outPdf}" "${path.join(previewFolder, 'slide')}"`;
    exec(cmd2, (err2, stdout2, stderr2) => {
      if (err2) {
        console.error('Ошибка разбивки PDF на PNG:', stderr2);
        if (fs.existsSync(outPdf)) fs.unlinkSync(outPdf);
        return res.status(500).json({ error: 'Не удалось создать PNG' });
      }

      if (fs.existsSync(outPdf)) fs.unlinkSync(outPdf);

      const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      if (!catalog.slides) catalog.slides = [];

      const pngFiles = fs.readdirSync(previewFolder).filter(f => f.endsWith('.png')).sort();
      const previews = pngFiles.map(f => `assets/previews/${baseName}/${f}`);

      const newSlide = {
        id: 'pub-' + Date.now(),
        name: name,
        category: category || 'Общее',
        tags: tags ? JSON.parse(tags) : [],
        file: `assets/slides/${pptxFileName}`,
        preview: previews.length ? previews[0] : null,
        previews: previews,
        lastUpdated: new Date().toISOString().slice(0, 7),
        approved: false,
        approvedBy: req.user.email,
        color: '#2688EB',
        scope: 'public',
        kind: 'presentations'
      };

      catalog.slides.push(newSlide);
      fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 4));

      res.json({ success: true, slide: newSlide });
    });
  });
});

// ========== СИНХРОНИЗАЦИЯ ==========
app.get('/api/sync', requireAuth, async (req, res) => {
  try {
    await syncCatalog();
    res.json({ success: true, message: 'Каталог синхронизирован' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ========== ЗАПУСК СЕРВЕРА ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер запущен на http://0.0.0.0:${PORT}`);
  console.log(`📁 Папка assets: ${ASSETS_DIR}`);
  syncCatalog().catch(e => console.error('Ошибка синхронизации:', e));
});

// ========== СЛЕЖЕНИЕ ЗА ИЗМЕНЕНИЯМИ ==========
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const onFilesChange = debounce(() => {
  console.log('🔄 Обнаружены изменения в файлах, синхронизирую...');
  syncCatalog().catch(e => console.error('Ошибка автосинхронизации:', e));
}, 2000);

try {
  if (fs.existsSync(slidesDir)) fs.watch(slidesDir, onFilesChange);
  Object.values(tileFolders).forEach(folder => {
    if (fs.existsSync(folder)) fs.watch(folder, onFilesChange);
  });

  if (fs.existsSync(catalogPath)) {
    fs.watch(catalogPath, debounce(() => {
      console.log('📝 catalog.json изменён вручную, пересинхронизирую...');
      syncCatalog().catch(e => console.error('Ошибка синхронизации:', e));
    }, 1000));
  }
} catch (watchErr) {
  console.warn('⚠️ Не удалось настроить слежение за файлами (возможно, внутри Docker):', watchErr.message);
}