# SlideLibrary — библиотека слайдов для PowerPoint

*SlideLibrary* — это надстройка для Microsoft PowerPoint, которая предоставляет удобный доступ к корпоративной библиотеке готовых слайдов. Позволяет искать, просматривать и вставлять утверждённые слайды в презентацию одним кликом, не покидая PowerPoint.

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

### Способ 1. Запуск через Docker

#### 1.Установите Docker Desktop
[Скачать Docker Desktop](https://www.docker.com/products/docker-desktop/)
#### 2.Склонируйте репозиторий
```
git clone https://github.com/Leon-Maryankov/SlideLibrary.git
cd SlideLibrary
```
#### 3. Запустить контейнер или создать образ самостоятельно
- Запустить контейнер:
```
docker-compose up
```
- Создать образ самостоятельно:
```
docker-compose up --build
```
- Готовый образ всегда доступен по адресу:
```
ghcr.io/leon-maryankov/slidelibrary:latest
```
#### 4. Открыть надстройку в PowerPoint

### Способ 2. Локальный запуск

#### Требования:

- Microsoft PowerPoint 2019, 2021 или Microsoft 365
- [Node.js](https://nodejs.org/) (LTS-версия)
- npm (устанавливается вместе с Node.js)
- LibreOffice (для генерации превью слайдов). Скачать: https://ru.libreoffice.org/download/libreoffice/
- Poppler (утилита pdftoppm, используется вместе с LibreOffice).
  - Windows: установите через Chocolatey (от админа): choco install poppler
  - Linux: sudo apt install poppler-utils
  - macOS: brew install poppler

#### 1. Клонируйте репозиторий
```bash
git clone https://github.com/leon-maryankov/SlideLibrary.git
cd SlideLibrary
```
#### 2. Установите зависимости
```bash
npm install
```
#### 3. Установите доверенный сертификат (только для Windows)
Надстройки Office требуют HTTPS даже в режиме локальной разработки.
Выполните в командной строке: 
```bash
npm install -g office-addin-dev-certs
office-addin-dev-certs install
```
#### 4. Настройте переменные окружения
Скопируйте .env.example в .env:
```bash
cp .env.example .env
```
#### 5. Запустите локальный сервер
В первом окне терминала:
```bash
node server.js
```
Сервер запустится на http://localhost:3001 и автоматически просканирует папку assets/, сгенерирует превью и обновит catalog.json.
#### 6. Запустите надстройку
Во втором окне терминала:
```bash
npm start
```
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

## Добавление своих файлов
- Презентация: положите .pptx в assets/slides/ — сервер сам создаст превью и добавит запись в catalog.json.
- Изображение: положите файл в соответствующую папку (photos, illustrations, icons, logos) — он автоматически появится во вкладке.
- Личные файлы: используйте «Личный кабинет» в надстройке (кнопка «Добавить в библиотеку» или импорт папки).
