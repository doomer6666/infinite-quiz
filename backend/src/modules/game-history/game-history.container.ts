import { ContainerModule } from "inversify";
import { types } from "@typegoose/typegoose";
import { Component } from "../../shared/types/conponent.js";
import { IGameHistoryService } from "./game-history-service.interface.js";
import { DefaultGameHistoryService } from "./default-game-history.service.js";
import { GameHistoryEntity, GameHistoryModel } from "./game-history.entity.js";
import { BaseController } from "../../shared/libs/rest/index.js";
import { GameHistoryController } from "./game-history.controller.js";

export function createGameHistoryContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<IGameHistoryService>(Component.GameHistoryService)
      .to(DefaultGameHistoryService)
      .inSingletonScope();

    bind<types.ModelType<GameHistoryEntity>>(
      Component.GameHistoryModel,
    ).toConstantValue(GameHistoryModel);

    bind<BaseController>(Component.GameHistoryController)
      .to(GameHistoryController)
      .inSingletonScope();
  });
}
