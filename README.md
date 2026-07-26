# Infinite Quiz

Платформа для проведения интерактивных квизов в реальном времени. Организатор создаёт квиз, участники подключаются по коду комнаты и отвечают на вопросы с таймером.

## Стек технологий

### Backend

- **Node.js** + **TypeScript**
- **Express** — HTTP сервер
- **Socket.io** — WebSocket сервер
- **MongoDB** + **Mongoose** + **Typegoose** — база данных
- **Inversify** — DI контейнер
- **Zod** — валидация
- **JWT** — авторизация

### Frontend

- **React 19** + **TypeScript**
- **Vite** — сборщик
- **Redux Toolkit** + **RTK Query** — state management и API
- **React Router** — маршрутизация
- **React Hook Form** + **Zod** — формы и валидация
- **Socket.io Client** — WebSocket клиент

### Общая структура

- **Монорепо** — backend, frontend, common (общие типы и схемы)

## Структура проекта

```
infinite-quiz/
├── backend/                 # Backend (Express + Socket.io)
│   ├── src/
│   │   ├── app/            # Инициализация приложения
│   │   ├── modules/        # Модули (user, quiz, game, game-history)
│   │   │   ├── user/
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── default-user.service.ts
│   │   │   │   └── user.container.ts
│   │   │   ├── quiz/
│   │   │   ├── game/       # WebSocket gateway + game room manager
│   │   │   └── game-history/
│   │   └── shared/         # Общие утилиты (logger, rest, config)
│   ├── static/             # Статические файлы (аватары по умолчанию)
│   └── uploads/            # Загруженные пользователями файлы
│
├── frontend/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── app/            # Роуты, провайдеры
│   │   ├── pages/          # Страницы (QuizPage, GamePage, ProfilePage, etc.)
│   │   ├── widgets/        # Виджеты (Sidebar, Topbar, GameFooter, etc.)
│   │   ├── features/       # Фичи (filter-quizzes, etc.)
│   │   ├── entities/       # Сущности (user, quiz, game-history)
│   │   └── shared/         # Общие (api, lib, ui)
│   └── public/
│
├── common/                 # Общие типы и Zod схемы
│   └── src/
│       ├── types/          # TypeScript типы
│       ├── dto/            # Zod схемы (CreateQuizSchema, etc.)
│       └── enums/          # Enum'ы (QuizStatus, UserRole, etc.)
│
├── docker-compose.yml
└── package.json            # Корневой package.json (workspaces)
```

## Установка и запуск

### Требования

- Node.js >= 20
- MongoDB >= 7
- npm >= 10

### 1. Клонирование и установка

```bash
git clone https://github.com/doomer6666/infinite-quiz
cd infinite-quiz
npm install
```

### 2. Переменные окружения

**Backend** (`backend/.env`)

```env
PORT=4010
DB_HOST=localhost
DB_PORT=27017
DB_NAME=infinite-quiz
DB_USER=
DB_PASSWORD=
JWT_SECRET=your-secret-key
SALT=your-salt-key
UPLOAD_DIR=./uploads
```

**Frontend** (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4010
```

### 3. Запуск MongoDB

```bash
# Через Docker
docker-compose up -d mongodb

# Или локально
mongod --dbpath /path/to/data
```

### 4. Сборка common

```bash
cd common
npm run build
cd ..
```

### 5. Запуск Backend

```bash
cd backend
npm run dev    # development (nodemon)
# или
npm run build && npm start    # production
```

### 6. Запуск Frontend

```bash
cd frontend
npm run dev    # development (Vite)
# или
npm run build && npm run preview    # production
```

### 7. Открыть приложение

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4010

## API Endpoints

### Users

- `POST /users/register` — регистрация
- `POST /users/login` — авторизация
- `GET /users/me` — текущий пользователь
- `GET /users/:id` — публичный профиль
- `PATCH /users/:id` — обновить профиль
- `POST /users/:id/avatar` — загрузить аватар

### Quizzes

- `GET /quizzes` — список квизов
- `GET /quizzes/:id` — квиз по ID
- `POST /quizzes` — создать квиз
- `PATCH /quizzes/:id` — обновить квиз
- `DELETE /quizzes/:id` — удалить квиз
- `POST /quizzes/:id/image` — загрузить изображение квиза

### Game History

- `GET /history/my` — история игр пользователя
- `GET /history` — вся история

## WebSocket Events

### Client → Server

- `game:create` — создать комнату
- `game:join` — присоединиться к комнате
- `game:start` — начать игру
- `game:show-question` — показать вопрос
- `game:start-answering` — начать ответы
- `game:answer` — отправить ответ
- `game:next` — следующий вопрос

### Server → Client

- `game:created` — комната создана
- `game:joined` — присоединился к комнате
- `game:status` — смена статуса игры
- `game:players` — список игроков
- `game:question` — текущий вопрос
- `game:answering` — начало ответов (таймер)
- `game:answer-accepted` — ответ принят
- `game:results` — результаты вопроса
- `game:end` — конец игры
- `game:destroyed` — комната удалена

## Состояния игры

1. **LOBBY** — ожидание игроков
2. **INTRO** — заставка перед началом
3. **QUESTION_SHOW** — показ вопроса
4. **QUESTION_ANSWERING** — игроки отвечают (таймер)
5. **QUESTION_RESULTS** — результаты вопроса
6. **GAME_END** — конец игры, лидерборд
