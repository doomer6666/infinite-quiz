import express from "express";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./sockets/index.js";
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

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(createMainApplicationContainer());
  appContainer.load(createUserContainer());
  appContainer.load(createAuthContainer());
  appContainer.load(CreateQuizContainer());
  const app = appContainer.get<MainApplication>(Component.MainApplication);
  await app.init();
}

bootstrap();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// initSocket(io);

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
