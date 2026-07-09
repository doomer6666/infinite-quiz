export const Component = {
  Logger: Symbol.for("Logger"),
  Config: Symbol.for("Config"),
  DatabaseClient: Symbol.for("DatabaseClient"),
  MainApplication: Symbol.for("MainApplication"),
  UserModel: Symbol.for("UserModel"),
  UserService: Symbol.for("UserService"),
  QuizModel: Symbol.for("QuizModel"),
  QuizService: Symbol.for("QuizService"),
  UserController: Symbol.for("UserController"),
  QuizController: Symbol.for("QuizController"),
  AuthService: Symbol.for("AuthService"),
  PathTransformer: Symbol.for("PathTransformer"),
} as const;
