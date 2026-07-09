import { ContainerModule } from "inversify";
import { Config, IConfig, MainShema } from "../shared/config/index.js";
import { Component } from "../shared/types/index.js";
import { MainApplication } from "./main.application.js";
import {
  IDatabaseClient,
  MongoDatabaseClient,
} from "../shared/database-client/index.js";
import { ILogger, PinoLogger } from "../shared/libs/logger/index.js";
import { PathTransformer } from "../shared/libs/rest/transform/path-transformer.js";

export function createMainApplicationContainer(): ContainerModule {
  const container = new ContainerModule(({ bind }) => {
    bind<MainApplication>(Component.MainApplication)
      .to(MainApplication)
      .inSingletonScope();

    bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
    bind<PathTransformer>(Component.PathTransformer)
      .to(PathTransformer)
      .inSingletonScope();

    bind<IDatabaseClient>(Component.DatabaseClient)
      .to(MongoDatabaseClient)
      .inSingletonScope();

    bind<IConfig<MainShema>>(Component.Config).to(Config).inSingletonScope();
  });

  return container;
}
