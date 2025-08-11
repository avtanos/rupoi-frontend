# АИС РУПОИ - Backend

Backend для автоматизированной информационной системы РУПОИ.

## Технологии

- **Python 3.11+**
- **Django 5.x**
- **Django REST Framework**
- **PostgreSQL**
- **JWT аутентификация**
- **CORS поддержка**

## Установка и запуск

### Предварительные требования

1. **Python 3.11+**
2. **PostgreSQL**
3. **Создать базу данных `rupoi`**

### Быстрый запуск (Windows)

```bash
# Запустить скрипт автоматической установки
run.bat
```

### Ручная установка

```bash
# 1. Создать виртуальное окружение
python -m venv .venv

# 2. Активировать виртуальное окружение
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Настроить переменные окружения
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=rupoi
set DB_USER=postgres
set DB_PASSWORD=postgres
set SECRET_KEY=change_me_in_production
set DEBUG=True

# 5. Выполнить миграции
python manage.py makemigrations
python manage.py migrate

# 6. Инициализировать данные
python manage.py init_data

# 7. Запустить сервер
python manage.py runserver 0.0.0.0:8000
```

## Структура проекта

```
backend/
├── config/                 # Настройки Django
│   ├── settings.py        # Основные настройки
│   ├── urls.py           # Главные URL-ы
│   └── wsgi.py           # WSGI конфигурация
├── accounts/              # Пользователи и роли
├── personal_cases/        # Личные дела
├── orders/               # Заказы
├── invoices/             # Накладные
├── warehouse/            # Склад
├── dictionaries/         # Справочники
├── utils.py             # Утилиты
└── manage.py            # Django CLI
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login/` - Вход в систему
- `POST /api/auth/refresh/` - Обновление токена
- `GET /api/auth/profile/` - Профиль пользователя

### Личные дела
- `GET /api/personal-cases/` - Список личных дел
- `POST /api/personal-cases/` - Создание личного дела
- `GET /api/personal-cases/{id}/` - Детали личного дела
- `PUT /api/personal-cases/{id}/` - Обновление личного дела

### Заказы
- `GET /api/orders/` - Список заказов
- `POST /api/orders/` - Создание заказа
- `GET /api/orders/{id}/` - Детали заказа
- `PUT /api/orders/{id}/` - Обновление заказа

### Накладные
- `GET /api/invoices/` - Список накладных
- `POST /api/invoices/` - Создание накладной
- `GET /api/invoices/{id}/` - Детали накладной

### Склад
- `GET /api/warehouse/stock/` - Остатки на складе
- `GET /api/warehouse/issues/` - История выдач
- `POST /api/warehouse/issues/` - Создание выдачи

### Справочники
- `GET /api/dictionaries/workshops/` - Цеха
- `GET /api/dictionaries/order-statuses/` - Статусы заказов
- `GET /api/dictionaries/tsr-categories/` - Категории ТСР

## Документация API

После запуска сервера документация доступна по адресу:
- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Тестовые пользователи

После выполнения `python manage.py init_data` создаются пользователи:

| Логин | Пароль | Роль | Описание |
|-------|--------|------|----------|
| admin | admin123 | Администратор | Полный доступ |
| registry | registry123 | Регистратура | Личные дела |
| med | med123 | Медицинский персонал | Заказы + Личные дела |
| workshop | workshop123 | Цех | Заказы + Накладные |
| warehouse | warehouse123 | Склад | Склад + Выдача |

## Роли и разрешения

- **REGISTRY** - Доступ к личным делам
- **MED** - Доступ к заказам и личным делам
- **WORKSHOP** - Доступ к заказам и накладным
- **WAREHOUSE** - Доступ к складу и выдаче
- **ADMIN** - Полный доступ ко всем модулям

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DB_HOST` | Хост PostgreSQL | localhost |
| `DB_PORT` | Порт PostgreSQL | 5432 |
| `DB_NAME` | Имя базы данных | rupoi |
| `DB_USER` | Пользователь БД | postgres |
| `DB_PASSWORD` | Пароль БД | postgres |
| `SECRET_KEY` | Секретный ключ Django | change_me_in_production |
| `DEBUG` | Режим отладки | True |
