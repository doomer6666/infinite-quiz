backend/
src/
├── controllers/ # Логика обработки событий (game.controller.ts)
├── services/ # Бизнес-логика (game.service.ts, bot.service.ts)
├── models/ # Мongoose схемы (User, Quiz, GameHistory)
├── sockets/ # Обработчики подключений (socket.handler.ts)
├── events/ # Типы событий (game.events.ts)
└── utils/ # Хелперы (генератор PIN, валидация)
