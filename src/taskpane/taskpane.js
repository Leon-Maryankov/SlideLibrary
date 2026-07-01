import catalogData from '../../assets/catalog.json';

const CATALOG_URL = 'https://leon-maryankov.github.io/SlideLibrary/assets/catalog.json';

let slides = catalogData.slides || catalogData;
let allCategories = [
  'Все',
  ...(catalogData.categories || [...new Set(slides.map(s => s.category).filter(Boolean))])
];

let activeCat = 'Все';
let searchQuery = '';
let sortMode = 'name';
let favFilter = false;
let favorites = new Set();
let recentlyUsed = [];
let inserting = null;
let modalSlideId = null;
let currentCatalog = catalogData;

const $tabs = document.getElementById('tabs');
const $grid = document.getElementById('slideGrid');
const $recentGrid = document.getElementById('recentGrid');
const $recentSection = document.getElementById('recentSection');
const $search = document.getElementById('searchInput');
const $count = document.getElementById('countLabel');
const $sort = document.getElementById('sortSelect');
const $status = document.getElementById('status');
const $modal = document.getElementById('modal');
const $modalTitle = document.getElementById('modalTitle');
const $modalPreview = document.getElementById('modalPreview');
const $modalMeta = document.getElementById('modalMeta');
const $modalInsert = document.getElementById('modalInsert');
const $modalClose = document.getElementById('modalClose');
const $modalCancel = document.getElementById('modalCancel');
const $refreshBtn = document.getElementById('refreshBtn');
const $modalVersions = document.getElementById('modalVersions');
const $versionsList = document.getElementById('versionsList');
const $favFilter = document.getElementById('favFilterCheckbox');

const hasStorage = typeof OfficeRuntime !== 'undefined' && OfficeRuntime.storage;

async function loadFromStorage() {
  if (!hasStorage) return;
  try {
    const favsRaw = await OfficeRuntime.storage.getItem('sl_favorites');
    if (favsRaw) JSON.parse(favsRaw).forEach(id => favorites.add(id));
    const recRaw = await OfficeRuntime.storage.getItem('sl_recent');
    if (recRaw) recentlyUsed = JSON.parse(recRaw).slice(0, 3);
  } catch (e) {
    console.warn('[SlideLibrary] Storage error:', e);
  }
}

async function persistFavorites() {
  if (!hasStorage) return;
  try {
    await OfficeRuntime.storage.setItem('sl_favorites', JSON.stringify([...favorites]));
  } catch (e) {
    console.warn('[SlideLibrary] Storage write error:', e);
  }
}

async function addToRecent(id) {
  recentlyUsed = [id, ...recentlyUsed.filter(x => x !== id)].slice(0, 3);
  if (!hasStorage) return;
  try {
    await OfficeRuntime.storage.setItem('sl_recent', JSON.stringify(recentlyUsed));
  } catch (e) {
    console.warn('[SlideLibrary] Storage write error:', e);
  }
}

function getFilteredSlides() {
  const q = searchQuery.toLowerCase().trim();
  let items = slides.filter(s => {
    const matchCat = activeCat === 'Все' || s.category === activeCat;
    const matchQ = !q ||
      s.name.toLowerCase().includes(q) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(q))) ||
      (s.category && s.category.toLowerCase().includes(q));
    return matchCat && matchQ;
  });
  if (favFilter) {
    items = items.filter(s => favorites.has(s.id));
  }
  const sortFns = {
    name: (a, b) => a.name.localeCompare(b.name, 'ru'),
    date: (a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''),
  };
  return items.sort(sortFns[sortMode] || sortFns.name);
}

function renderAll() {
  renderTabs();
  renderGrid();
  renderRecent();
}

function renderTabs() {
  $tabs.innerHTML = allCategories.map(cat => {
    const active = cat === activeCat;
    return `<button class="tab${active ? ' tab--active' : ''}" data-cat="${cat}">${cat}</button>`;
  }).join('');
  $tabs.querySelectorAll('.tab').forEach(btn =>
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      renderAll();
    })
  );
}

function getDeclension(number, one, two, five) {
  const n = Math.abs(number) % 100;
  const lastDigit = n % 10;

  if (n >= 11 && n <= 19) return five;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return two;
  return five;
}

function renderGrid() {
  const items = getFilteredSlides();
  $count.textContent = `${items.length} ${getDeclension(items.length, 'слайд', 'слайда', 'слайдов')}`;
  if (!items.length) {
    $grid.innerHTML = '<p class="empty">Слайды не найдены</p>';
    return;
  }
  $grid.innerHTML = '';
  items.forEach(item => $grid.appendChild(buildCard(item, false)));
}

function renderRecent() {
  const recentItems = recentlyUsed
    .map(id => slides.find(s => s.id === id))
    .filter(Boolean);
  if (!recentItems.length) {
    $recentSection.style.display = 'none';
    return;
  }
  $recentSection.style.display = 'block';
  $recentGrid.innerHTML = '';
  recentItems.forEach(item => $recentGrid.appendChild(buildCard(item, true)));
}

function buildCard(item, compact) {
  const isFav = favorites.has(item.id);
  const isIns = inserting === item.id;
  const color = item.color || '#4CAF50';

  const card = document.createElement('div');
  card.className = compact ? 'card card--compact' : 'card';

  const statusIcon = item.approved
    ? '<img src="assets/icons/check.svg" class="badge-icon" alt="утверждён">'
    : '<img src="assets/icons/hourglass.svg" class="badge-icon" alt="на ревью">';

  card.innerHTML = `
    <div class="card__thumb" style="background:${color}18; border-color:${color}33;">
      ${item.preview
      ? `<img src="${item.preview}" alt="${item.name}" onerror="this.style.display='none';">`
      : ''
    }
      <div class="card__thumb-icon" style="color:${color};">${item.icon || '📊'}</div>
      <span class="badge ${item.approved ? 'badge--ok' : 'badge--pending'}">
        ${statusIcon}
      </span>
      <button class="fav-btn${isFav ? ' fav-btn--on' : ''}"
              aria-label="${isFav ? 'Убрать из избранного' : 'Добавить в избранное'}"
              data-id="${item.id}">♥</button>
    </div>
    <p class="card__name">${item.name}</p>
    <p class="card__tags">${(item.tags || []).join(' • ')}</p>
    ${!compact ? `
      <div class="card__foot">
        <span class="card__ver">${item.version || ''}</span>
        <span class="card__date">${item.lastUpdated || ''}</span>
      </div>
    ` : ''}
    <button class="card__btn${isIns ? ' card__btn--loading' : ''}" data-id="${item.id}">
      ${isIns ? '⏳ Загрузка...' : 'Вставить'}
    </button>
  `;

  card.addEventListener('click', () => openModal(item.id));
  card.querySelector('.fav-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(item.id);
  });
  card.querySelector('.card__btn').addEventListener('click', e => {
    e.stopPropagation();
    insertSlide(item.id, item.file);
  });

  return card;
}

function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  persistFavorites();
  renderAll();
}

function setStatus(message, type) {
  $status.textContent = message;
  $status.className = 'status' + (type ? ` status--${type}` : '');
  if (type === 'success') {
    setTimeout(() => {
      $status.textContent = '';
      $status.className = 'status';
    }, 5000);
  }
}

function insertSlide(id, filePath) {
  if (inserting) return;
  inserting = id;
  renderGrid();
  setStatus('⏳ Загрузка слайда...', '');

  const url = filePath.startsWith('http') ? filePath : (window.location.origin + '/' + filePath);

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Файл не найден: ${url}`);
      return res.arrayBuffer();
    })
    .then(buffer => {
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      if (typeof PowerPoint === 'undefined') {
        throw new Error('PowerPoint API не загружен. Проверьте подключение Office.js.');
      }
      return PowerPoint.run(async context => {
        context.presentation.insertSlidesFromBase64(base64);
        await context.sync();
      });
    })
    .then(async () => {
      await addToRecent(id);
      inserting = null;
      renderAll();
      setStatus('✅ Слайд вставлен в презентацию!', 'success');
    })
    .catch(err => {
      console.error('[SlideLibrary] Insert error:', err);
      inserting = null;
      renderGrid();
      setStatus('❌ Ошибка: ' + err.message, 'error');
    });
}

function refreshCatalog() {
  setStatus('🔄 Загрузка свежего каталога...', '');
  fetch(CATALOG_URL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      currentCatalog = data;
      slides = data.slides || data;
      allCategories = [
        'Все',
        ...(data.categories || [...new Set(slides.map(s => s.category).filter(Boolean))])
      ];
      if (!allCategories.includes(activeCat)) activeCat = 'Все';
      renderAll();
      setStatus('✅ Каталог обновлён успешно!', 'success');
    })
    .catch(err => {
      console.error('[SlideLibrary] Refresh error:', err);
      setStatus('❌ Не удалось обновить каталог: ' + err.message, 'error');
    });
}

function openModal(id) {
  const item = slides.find(s => s.id === id);
  if (!item) return;
  modalSlideId = id;
  const color = item.color || '#4CAF50';

  $modalTitle.textContent = item.name;
  $modalPreview.style.background = color + '18';
  if (item.preview) {
    $modalPreview.innerHTML = `<img src="${item.preview}" alt="${item.name}"
      onerror="this.outerHTML='<span style=\\'font-size:52px;color:${color};\\' aria-hidden=\\'true\\'>${item.icon || '📊'}</span>'"
    >`;
  } else {
    $modalPreview.innerHTML = `<span style="font-size:52px;color:${color};" aria-hidden="true">${item.icon || '📊'}</span>`;
  }

  const statusText = item.approved
    ? '<img src="assets/icons/check.svg" class="status-icon" alt="утверждён"> Утверждён'
    : '<img src="assets/icons/hourglass.svg" class="status-icon" alt="на ревью"> На ревью';

  $modalMeta.innerHTML = `
    <div class="meta-row"><span>Категория</span><b>${item.category || '—'}</b></div>
    <div class="meta-row"><span>Версия</span><b>${item.version || '—'}</b></div>
    <div class="meta-row"><span>Обновлён</span><b>${item.lastUpdated || '—'}</b></div>
    <div class="meta-row"><span>Статус</span><b class="${item.approved ? 'ok' : 'pending'}">${statusText}</b></div>
    <div class="meta-row"><span>Теги</span><b>${(item.tags || []).join(', ') || '—'}</b></div>
    ${item.approvedBy ? `<div class="meta-row"><span>Утвердил</span><b>${item.approvedBy}</b></div>` : ''}
  `;

  if (item.versions && item.versions.length > 0) {
    $modalVersions.style.display = 'block';
    $versionsList.innerHTML = '';
    const sorted = [...item.versions].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    sorted.forEach(ver => {
      const li = document.createElement('li');
      const isCurrent = ver.version === item.version;
      li.innerHTML = `
        <div class="ver-info">
          <span class="ver-name">${ver.version}${isCurrent ? ' (текущая)' : ''}</span>
          <span class="ver-date">${ver.date || ''}</span>
          ${ver.changes ? `<span class="ver-changes">${ver.changes}</span>` : ''}
        </div>
        <button class="ver-btn" data-file="${ver.file}" data-version="${ver.version}">Вставить</button>
      `;
      const btn = li.querySelector('.ver-btn');
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const file = btn.dataset.file;
        const version = btn.dataset.version;
        closeModal();
        setStatus(`⏳ Вставка версии ${version}...`, '');
        insertSlide(item.id, file);
      });
      $versionsList.appendChild(li);
    });
  } else {
    $modalVersions.style.display = 'none';
  }

  $modal.style.display = 'flex';
}

function closeModal() {
  $modal.style.display = 'none';
  modalSlideId = null;
}

$search.addEventListener('input', () => {
  searchQuery = $search.value;
  renderGrid();
});

$sort.addEventListener('change', () => {
  sortMode = $sort.value;
  renderGrid();
});

$favFilter.addEventListener('change', () => {
  favFilter = $favFilter.checked;
  renderGrid();
});

$modalClose.addEventListener('click', closeModal);
$modalCancel.addEventListener('click', closeModal);
$modal.addEventListener('click', e => {
  if (e.target === $modal) closeModal();
});

$modalInsert.addEventListener('click', () => {
  if (!modalSlideId) return;
  const item = slides.find(s => s.id === modalSlideId);
  closeModal();
  if (item) insertSlide(item.id, item.file);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

$refreshBtn.addEventListener('click', refreshCatalog);

async function init() {
  await loadFromStorage();
  renderAll();
}

Office.onReady(() => {
  init().catch(e => console.warn('[SlideLibrary] Init error:', e));
});