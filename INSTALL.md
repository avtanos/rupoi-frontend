# Инструкция по установке АИС РУПОИ

## Требования

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Redis (для Celery)

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd mod_poi
```

### 2. Настройка Backend (Django)

```bash
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Создание файла .env
cp .env.example .env
# Отредактируйте .env файл с вашими настройками

# Создание базы данных PostgreSQL
createdb ais_rupoi

# Применение миграций
python manage.py makemigrations
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Сбор статических файлов
python manage.py collectstatic

# Запуск сервера разработки
python manage.py runserver
```

### 3. Настройка Frontend (Vue.js)

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev
```

### 4. Настройка базы данных

Создайте файл `.env` в папке `backend` со следующими настройками:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=ais_rupoi
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379/0
```

### 5. Настройка CORS

В файле `backend/core/settings.py` добавьте домены в `CORS_ALLOWED_ORIGINS`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## Структура проекта

```
mod_poi/
├── backend/                 # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── core/               # Основные настройки Django
│   ├── apps/               # Django приложения
│   │   ├── accounts/       # Пользователи и роли
│   │   ├── personal_files/ # Личные дела
│   │   ├── orders/         # Заказы и наряды
│   │   ├── invoices/       # Накладные
│   │   ├── warehouse/      # Склад
│   │   └── reports/        # Отчеты
│   └── static/             # Статические файлы
├── frontend/               # Vue.js frontend
│   ├── package.json
│   ├── src/
│   │   ├── components/     # Vue компоненты
│   │   ├── views/          # Страницы
│   │   ├── stores/         # Pinia stores
│   │   ├── router/         # Маршрутизация
│   │   └── assets/         # Ресурсы
│   └── public/
└── docker/                 # Docker конфигурация
```

## Роли пользователей

1. **Регистратура** - создание личных дел, поиск
2. **Медотдел** - направления, заказы, отчеты
3. **Цеха** - изготовление, накладные
4. **Склад готовой продукции** - выдача, контроль
5. **Администрация** - полный доступ

## Основные модули

### 1. Модуль "Личные дела"
- Создание и редактирование личных дел
- Поиск по ПИН, ФИО
- История оказания услуг
- Управление документами

### 2. Модуль "Заказы и наряды"
- Заказы на изготовление протезов
- Заказы на изготовление обуви
- Заказы на изготовление Отто-бок
- Наряды на ремонт
- Управление статусами и приоритетами

### 3. Модуль "Накладные"
- Создание накладных
- Отслеживание движения изделий
- Управление статусами выдачи

### 4. Модуль "Склад"
- Управление складскими позициями
- Контроль наличия
- Выдача готовой продукции

### 5. Модуль "Отчеты"
- Формирование различных отчетов
- Статистика и аналитика

## API Endpoints

### Аутентификация
- `POST /api/users/login/` - Вход в систему
- `POST /api/users/logout/` - Выход из системы
- `GET /api/users/me/` - Получение информации о текущем пользователе

### Личные дела
- `GET /api/personal-files/` - Список личных дел
- `POST /api/personal-files/` - Создание личного дела
- `GET /api/personal-files/{id}/` - Детали личного дела
- `PUT /api/personal-files/{id}/` - Обновление личного дела
- `DELETE /api/personal-files/{id}/` - Удаление личного дела

### Заказы
- `GET /api/orders/` - Список заказов
- `POST /api/orders/` - Создание заказа
- `GET /api/orders/{id}/` - Детали заказа
- `PUT /api/orders/{id}/` - Обновление заказа
- `DELETE /api/orders/{id}/` - Удаление заказа

### Накладные
- `GET /api/invoices/` - Список накладных
- `POST /api/invoices/` - Создание накладной
- `GET /api/invoices/{id}/` - Детали накладной
- `PUT /api/invoices/{id}/` - Обновление накладной
- `DELETE /api/invoices/{id}/` - Удаление накладной

### Склад
- `GET /api/warehouse/` - Список складских позиций
- `POST /api/warehouse/` - Создание складской позиции
- `GET /api/warehouse/{id}/` - Детали складской позиции
- `PUT /api/warehouse/{id}/` - Обновление складской позиции
- `DELETE /api/warehouse/{id}/` - Удаление складской позиции

## Разработка

### Backend разработка

```bash
cd backend
python manage.py runserver
```

### Frontend разработка

```bash
cd frontend
npm run dev
```

### Тестирование

```bash
# Backend тесты
cd backend
python manage.py test

# Frontend тесты
cd frontend
npm run test
```

## Развертывание

### Production настройки

1. Измените `DEBUG = False` в `settings.py`
2. Настройте `ALLOWED_HOSTS`
3. Используйте production базу данных
4. Настройте статические файлы
5. Настройте SSL сертификаты

### Docker развертывание

```bash
docker-compose up -d
```

## Поддержка

Для получения поддержки обращайтесь к разработчикам проекта.
