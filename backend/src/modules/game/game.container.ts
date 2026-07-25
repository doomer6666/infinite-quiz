import { ContainerModule } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { GameRoomManager } from "./game-room.manager.js";
import { GameGateway } from "./game.gateway.js";

export function createGameContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<GameRoomManager>(Component.GameRoomManager)
      .to(GameRoomManager)
      .inSingletonScope();

    bind<GameGateway>(Component.GameGateway).to(GameGateway).inSingletonScope();
  });
}
