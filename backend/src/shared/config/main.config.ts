import { inject } from "inversify";
import { IConfig } from "./config.interface.js";
import { configShema as configMainShema, MainShema } from "./main.shema.js";
import { Component } from "../types/conponent.js";
import { config } from "dotenv";
import { ILogger } from "../libs/logger/index.js";

export class Config implements IConfig<MainShema> {
  private readonly mainConfig: MainShema;

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    const configOutput = config();
    if (configOutput.error || !configOutput.parsed) {
      throw new Error("Failed to parse .env file");
    }

    configMainShema.load({});
    configMainShema.validate({ allowed: "strict", output: this.logger.info });

    this.mainConfig = configMainShema.getProperties();
    this.logger.info("Configuration loaded successfully");
  }

  public get<T extends keyof MainShema>(key: T): MainShema[T] {
    return this.mainConfig[key];
  }
}
