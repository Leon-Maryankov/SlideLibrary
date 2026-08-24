# SlideLibrary — библиотека слайдов для PowerPoint

*SlideLibrary* — это надстройка для Microsoft PowerPoint, которая предоставляет удобный доступ к корпоративной библиотеке готовых слайдов. Позволяет искать, просматривать и вставлять утверждённые слайды в презентацию одним кликом, не покидая PowerPoint.

---

## Требования

- Microsoft PowerPoint 2019, 2021 или Microsoft 365
- [Node.js](https://nodejs.org/) (LTS-версия)
- npm (устанавливается вместе с Node.js)
  
---

## Возможности

- Поиск слайдов по названию, тегам и категории
- Фильтрация по категориям (вкладки)
- Сортировка по названию или по дате обновления
- Статус утверждения слайда — утверждён / на ревью
- История версий слайда с описанием изменений
- Избранное — быстрый доступ к нужным слайдам
- Обновление каталога из удалённого источника (например, GitHub Pages)
- Вставка слайда в текущую презентацию в один клик

---

## Установка

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/leon-maryankov/SlideLibrary.git
cd SlideLibrary
```
### 2. Установите зависимости
```bash
npm install
```
### 3. Установите доверенный сертификат (только для Windows)
Надстройки Office требуют HTTPS даже в режиме локальной разработки.
Выполните в командной строке: 
```bash
npm install -g office-addin-dev-certs
office-addin-dev-certs install
```
### 4. Запустите локальный сервер разработки
```bash
npm start
```
### 5. Загрузите надстройку в PowerPoint
Откройте Microsoft PowerPoint.
«Главная» → «Надстройки» → Надстройка появится на ленте → откройте панель SlideLibrary.

---

## Каталог слайдов (`catalog.json`)

Каждый слайд в каталоге описывается объектом вида:

```json
{
  "id": "sales-q1-summary",
  "name": "Итоги Q1 по продажам",
  "category": "Аналитика продаж",
  "tags": ["продажи", "квартал", "итоги"],
  "file": "assets/slides/sales-q1-summary.pptx",
  "preview": "assets/previews/sales-q1-summary.png",
  "icon": "📊",
  "color": "#4CAF50",
  "approved": true,
  "approvedBy": "Имя Фамилия",
  "version": "1.2",
  "lastUpdated": "2026-05-10",
  "versions": [
    { "version": "1.2", "date": "2026-05-10", "changes": "Обновлены цифры", "file": "assets/slides/sales-q1-summary_v1.2.pptx" },
    { "version": "1.1", "date": "2026-03-01", "changes": "Правки дизайна", "file": "assets/slides/sales-q1-summary_v1.1.pptx" }
  ]
}
```
Чтобы добавить новый слайд — добавьте объект в массив `slides` в
`assets/catalog.json` и положите файл слайда в `assets/slides/`.

---

## 🔄 Обновление каталога (удалённый источник)
По умолчанию надстройка загружает каталог из локального catalog.json при старте. Кнопка «Обновить» может загружать свежий JSON из удалённого источника (например, с GitHub Pages). Для этого в файле taskpane.js задана константа:
```js
const CATALOG_URL = 'https://leon-maryankov.github.io/SlideLibrary/assets/catalog.json';
```
Вы можете изменить этот URL на свой — например, на корпоративный
SharePoint, Google Drive (с прямой ссылкой на JSON) или любой другой
публичный HTTPS-адрес.
