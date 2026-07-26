import "reflect-metadata";
import { Container } from "inversify";
import {
  createMainApplicationContainer,
  MainApplication,
} from "./app/index.js";
import { Component } from "./shared/types/conponent.js";
import { createUserContainer } from "./modules/user/index.js";
import { createAuthContainer } from "./modules/auth/index.js";
import { CreateQuizContainer } from "./modules/quiz/index.js";
import { createGameContainer } from "./modules/game/game.container.js";
import { createGameHistoryContainer } from "./modules/game-history/index.js";

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(createMainApplicationContainer());
  appContainer.load(createUserContainer());
  appContainer.load(createAuthContainer());
  appContainer.load(CreateQuizContainer());
  appContainer.load(createGameContainer());
  appContainer.load(createGameHistoryContainer());

  const app = appContainer.get<MainApplication>(Component.MainApplication);
  await app.init();
}

bootstrap();
