import { inject, injectable } from "inversify";
import {
  BaseController,
  HttpMethod,
  PrivateRouteMiddleware,
} from "../../shared/libs/rest/index.js";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { IGameHistoryService } from "./game-history-service.interface.js";
import { Request, Response } from "express";
import { GameHistoryResponseSchema } from "@infinite-quiz/common";

@injectable()
export class GameHistoryController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: ILogger,
    @inject(Component.GameHistoryService)
    private readonly gameHistoryService: IGameHistoryService,
  ) {
    super(logger);
    this.logger.info("Register routes for GameHistoryController…");

    this.addRoute({
      method: HttpMethod.Get,
      path: "/my",
      handler: this.getMyHistory,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      method: HttpMethod.Get,
      path: "/",
      handler: this.getAll,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async getMyHistory(req: Request, res: Response) {
    const userId = req.tokenPayload?.id;
    if (!userId) {
      return this.send(res, 401, { error: "Unauthorized" });
    }

    const asHost = await this.gameHistoryService.findByHostId(userId);
    const asPlayer = await this.gameHistoryService.findByPlayerId(userId);

    const all = [...asHost, ...asPlayer];
    const unique = Array.from(
      new Map(all.map((h) => [h._id.toString(), h])).values(),
    );
    unique.sort(
      (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime(),
    );

    this.ok(
      res,
      unique.map((h) => {
        const plain = h.toObject();
        return GameHistoryResponseSchema.parse({
          ...plain,
          _id: plain._id.toString(),
        });
      }),
    );
  }

  public async getAll(_req: Request, res: Response) {
    const history = await this.gameHistoryService.findAll();
    this.ok(
      res,
      history.map((h) => {
        const plain = h.toObject();
        return GameHistoryResponseSchema.parse({
          ...plain,
          _id: plain._id.toString(),
        });
      }),
    );
  }
}
