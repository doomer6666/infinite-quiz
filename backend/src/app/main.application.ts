import { inject, injectable } from "inversify";
import { Component } from "../shared/types/index.js";
import express, { Express, NextFunction, Request, Response } from "express";
import { IConfig, MainShema } from "../shared/config/index.js";
import { IDatabaseClient } from "../shared/database-client/index.js";
import { getMongoURI } from "../shared/utils/index.js";
import { ILogger } from "../shared/libs/logger/index.js";
import {
  IController,
  ParseTokenMiddleware,
} from "../shared/libs/rest/index.js";
import { HttpError } from "../shared/libs/rest/errors/http-error.js";
import { StatusCodes } from "http-status-codes";

@injectable()
export class MainApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<MainShema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: IDatabaseClient,
    @inject(Component.UserController)
    private readonly userController: IController,
    @inject(Component.QuizController)
    private readonly quizController: IController,
  ) {
    this.server = express();
  }

  public async init() {
    this.logger.info("Initializing REST application");
    this.logger.info(`Current PORT value from env ${this.config.get("PORT")}`);

    this.logger.info("Init database...");
    await this._initDB();
    this.logger.info("Init database completed");

    this.logger.info("Init app-level middleware");
    await this._initMiddleware();
    this.logger.info("App-level middleware initialization completed");

    this.logger.info("Init controllers...");
    await this._intiControllers();
    this.logger.info("Controller initialization completed");

    this.logger.info("Init exception filter...");
    this._initExceptionFilter();
    this.logger.info("Exception filter initialization completed");

    this.logger.info("Init express server...");
    await this._initServer();
    this.logger.info(
      `Server started on http://localhost:${this.config.get("PORT")}`,
    );
  }

  private async _initDB() {
    const mongoUrl = getMongoURI(
      this.config.get("DB_USER"),
      this.config.get("DB_PASSWORD"),
      this.config.get("DB_HOST"),
      this.config.get("DB_PORT"),
      this.config.get("DB_NAME"),
    );
    this.logger.info(`!!! GENERATED URL: ${mongoUrl} !!!`);

    return this.databaseClient.connect(mongoUrl);
  }

  private async _initServer() {
    const port = this.config.get("PORT");
    this.server.listen(port);
  }

  private async _intiControllers() {
    this.server.use("/users", this.userController.router);
    this.server.use("/quizzes", this.quizController.router);
  }

  private async _initMiddleware() {
    const parseTokenMiddleware = new ParseTokenMiddleware(
      this.config.get("JWT_SECRET"),
    );
    this.server.use(express.json());
    this.server.use(parseTokenMiddleware.execute.bind(parseTokenMiddleware));
  }

  private _initExceptionFilter() {
    this.server.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof HttpError) {
          res.status(err.httpStatusCode).json({
            type: "HTTP_ERROR",
            error: err.message,
            details: err.detail,
          });
          return;
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          type: "UNKNOWN_ERROR",
          error: err.message,
        });
      },
    );
  }
}
