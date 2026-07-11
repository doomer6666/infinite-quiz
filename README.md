backend/
src/
├── controllers/ # Логика обработки событий (game.controller.ts)
├── services/ # Бизнес-логика (game.service.ts, bot.service.ts)
├── models/ # Мongoose схемы (User, Quiz, GameHistory)
├── sockets/ # Обработчики подключений (socket.handler.ts)
├── events/ # Типы событий (game.events.ts)
└── utils/ # Хелперы (генератор PIN, валидация)

packages/client/
├── src/
│ ├── app/ # Инициализация приложения
│ │ ├── providers/
│ │ ├── store/
│ │ └── styles/
│ │
│ ├── pages/ # Страницы
│ │
│ ├── widgets/ # Самодостаточные блоки UI
│ │
│ ├── features/ # Действия пользователя(бизнес-фичи)
│ │ ├── auth/
│ │ │ ├── api/
│ │ │ ├── model/
│ │ │ ├── ui/
│ │
│ ├── entities/ # Бизнес-сущности
│ │ ├── entity/
│ │ │ ├── api/
│ │ │ ├── model/
│ │ │ ├── ui/
│ │
│ └── shared/ # Переиспользуемое без бизнес-логики
│ ├── api/
│ │ ├── baseApi.ts
│ ├── config/
│ ├── lib/
│ │ ├── hooks/
│ │ └── utils/
│ ├── ui/
│ └── index.ts
