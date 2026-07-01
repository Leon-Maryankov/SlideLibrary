# SlideLibrary — библиотека слайдов для PowerPoint

*SlideLibrary* — это надстройка для Microsoft PowerPoint, которая предоставляет удобный доступ к корпоративной библиотеке готовых слайдов. Позволяет искать, просматривать и вставлять утверждённые слайды в презентацию одним кликом, не покидая PowerPoint.

---

## Требования

- **Microsoft PowerPoint 2019, 2021 или Microsoft 365**.
- **Node.js**.
- **npm** (устанавливается вместе с Node.js).
  
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
В командной строке: 
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
«Главная» → «Надстройки» → «Мои надстройки».

---

## 🔄 Обновление каталога (удалённый источник)
По умолчанию надстройка загружает каталог из локального catalog.json при старте. Кнопка «Обновить» может загружать свежий JSON из удалённого источника (например, с GitHub Pages). Для этого в файле taskpane.js задана константа:
```bash
const CATALOG_URL = 'https://leon-maryankov.github.io/SlideLibrary/assets/catalog.json';
```
Вы можете изменить этот URL на свой (например, корпоративный SharePoint или любой публичный HTTPS-адрес).
